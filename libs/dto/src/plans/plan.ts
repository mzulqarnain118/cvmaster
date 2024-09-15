import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const planSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(255),
  price: z.number().multipleOf(0.01),
  currency: z.string().default("$"),
  description: z.string().default(""),
  status: z.boolean().default(true),
  duration: z.enum(["month", "quarterly", "sixMonths", "year", "days"]).default("month"),
  days: z.number().default(0),
  trialPeriod: z.number().default(0),
  priceId: z.string(),
  deleted: z.boolean().default(false),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class PlanDto extends createZodDto(planSchema) {}
