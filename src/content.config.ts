/**
 * Content collections and their schemas. Every field an editor can supply is
 * defined here; templates own layout and fixed wording.
 */
import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/** A month stored as `YYYY-MM`, displayed as "Month Year". */
const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM, for example 2026-05");

/** Square-bracket text standing in for a value nobody has supplied yet. */
const placeholder = z.string().regex(/^\[[^\]]+\]$/);

/** A web address, or a placeholder until the address is supplied. */
const urlOrPlaceholder = z.union([z.url(), placeholder]);

/** Rich text written in Markdown. */
const markdown = z.string().min(1);

export const GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "F",
] as const;

export const RELEVANCY_LEVELS = ["Low", "Average", "High"] as const;

/**
 * Reviewer descriptor values. Each list holds the review form's dropdown
 * options, in the form's wording.
 */
export const DESCRIPTORS = {
  role: ["Library administrator", "Business librarian"],
  institutionType: ["doctoral research university"],
  experience: ["10+ years of experience"],
  relationship: ["evaluator/selector", "administrator"],
} as const;

const sources = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/sources" }),
  schema: z.object({
    name: z.string().min(1),
    sortName: z.string().min(1).optional(),
    lastReviewed: yearMonth,
    vendor: reference("vendors"),
    bestKnownFor: markdown,
    alternatives: z
      .array(
        z.object({
          name: z.string().min(1),
          source: reference("sources").optional(),
          note: z.string().min(1).optional(),
        }),
      )
      .optional(),
    content: z
      .array(
        z.object({
          name: z.string().min(1),
          url: urlOrPlaceholder.optional(),
          description: z.string().min(1).optional(),
        }),
      )
      .optional(),
    aiFeatures: markdown.optional(),
    useCases: z
      .object({
        teaching: z.array(markdown).optional(),
        commercial: z.array(markdown).optional(),
      })
      .optional(),
    accessibility: z
      .object({
        grade: z.enum(GRADES),
        laaUrl: urlOrPlaceholder,
        laaYear: z.number().int().min(2000).max(2100),
      })
      .optional(),
    faq: z
      .array(z.object({ question: z.string().min(1), answer: markdown }))
      .optional(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    source: reference("sources"),
    date: yearMonth,
    role: z.enum(DESCRIPTORS.role),
    institutionType: z.enum(DESCRIPTORS.institutionType),
    experience: z.enum(DESCRIPTORS.experience),
    relationship: z.enum(DESCRIPTORS.relationship),
    relevancy: z
      .object({
        researchers: z.enum(RELEVANCY_LEVELS).optional(),
        teaching: z.enum(RELEVANCY_LEVELS).optional(),
        commercial: z.enum(RELEVANCY_LEVELS).optional(),
      })
      .optional(),
    disclosures: z
      .array(z.object({ label: z.string().min(1), text: z.string().min(1) }))
      .optional(),
  }),
});

const vendors = defineCollection({
  loader: file("./src/content/vendors.yaml"),
  schema: z.object({
    name: z.string().min(1),
    url: urlOrPlaceholder,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().min(1),
    lead: z.string().min(1).optional(),
  }),
});

export const collections = { sources, reviews, vendors, pages };
