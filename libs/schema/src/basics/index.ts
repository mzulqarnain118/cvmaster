import { z } from "zod";

import { defaultUrl, urlSchema } from "../shared";
import { customFieldSchema } from "./custom";

// Schema
export const basicsSchema = z.object({
  name: z.string(),
  headline: z.string(),
  email: z.literal("").or(z.string().email()),
  phone: z.string(),
  location: z.string(),
  url: urlSchema,
  customFields: z.array(customFieldSchema),
  picture: z.object({
    url: z.string(),
    size: z.number().default(64),
    aspectRatio: z.number().default(1),
    borderRadius: z.number().default(0),
    effects: z.object({
      hidden: z.boolean().default(false),
      border: z.boolean().default(false),
      grayscale: z.boolean().default(false),
    }),
  }),
});

// Type
export type Basics = z.infer<typeof basicsSchema>;

// Defaults
export const defaultBasics: Basics = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  url: defaultUrl,
  customFields: [],
  picture: {
    url: "",
    size: 64,
    aspectRatio: 1,
    borderRadius: 0,
    effects: {
      hidden: false,
      border: false,
      grayscale: false,
    },
  },
};

export const recipientSchema = z.object({
  date: z.string().optional(),
  greeting: z.string().optional(),
  subject: z.string().optional(),
  name: z.string().optional(),
  email: z.literal("").or(z.string().email()).optional(),
});

export type Recipient = z.infer<typeof recipientSchema>;

export const defaultRecipient: Recipient = {
  date: "",
  greeting: "",
  subject: "",
  name: "",
  email: "",
};

export * from "./custom";
