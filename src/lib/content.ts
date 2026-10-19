/**
 * Loads sources, reviews and vendors, checks that every reference between
 * them points at an entry that exists, and returns them ready for pages.
 * A broken reference stops the build with a message naming the file.
 */
import { getCollection, type CollectionEntry } from "astro:content";

import { compareSources } from "@/lib/sort";

export type Source = CollectionEntry<"sources">;
export type Review = CollectionEntry<"reviews">;
export type Vendor = CollectionEntry<"vendors">;

export interface SiteContent {
  /** Sources in A to Z order. */
  sources: Source[];
  vendors: Map<string, Vendor>;
  /** Reviews for each source id, newest first. */
  reviewsBySource: Map<string, Review[]>;
}

let cached: Promise<SiteContent> | undefined;

async function load(): Promise<SiteContent> {
  const [sources, reviews, vendorList] = await Promise.all([
    getCollection("sources"),
    getCollection("reviews"),
    getCollection("vendors"),
  ]);

  const sourceIds = new Set(sources.map((source) => source.id));
  const vendors = new Map(vendorList.map((vendor) => [vendor.id, vendor]));
  const problems: string[] = [];

  for (const source of sources) {
    if (!vendors.has(source.data.vendor.id)) {
      problems.push(
        `sources/${source.id}: vendor "${source.data.vendor.id}" is not in vendors.yaml`,
      );
    }
    for (const alternative of source.data.alternatives ?? []) {
      if (alternative.source && !sourceIds.has(alternative.source.id)) {
        problems.push(
          `sources/${source.id}: alternative "${alternative.name}" points at missing source "${alternative.source.id}"`,
        );
      }
    }
  }

  const reviewsBySource = new Map<string, Review[]>();
  for (const review of reviews) {
    const sourceId = review.data.source.id;
    if (!sourceIds.has(sourceId)) {
      problems.push(
        `reviews/${review.id}: source "${sourceId}" does not exist`,
      );
      continue;
    }
    const list = reviewsBySource.get(sourceId) ?? [];
    list.push(review);
    reviewsBySource.set(sourceId, list);
  }

  if (problems.length > 0) {
    throw new Error(`Broken content references:\n- ${problems.join("\n- ")}`);
  }

  for (const list of reviewsBySource.values()) {
    list.sort(
      (a, b) =>
        b.data.date.localeCompare(a.data.date) || b.id.localeCompare(a.id),
    );
  }

  return {
    sources: [...sources].sort((a, b) => compareSources(a.data, b.data)),
    vendors,
    reviewsBySource,
  };
}

/** All site content, loaded and checked once per build. */
export function getSiteContent(): Promise<SiteContent> {
  cached ??= load();
  return cached;
}
