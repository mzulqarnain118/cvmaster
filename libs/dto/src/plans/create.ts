import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createPlanSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().multipleOf(0.01),
  currency: z.string().default("$"),
  description: z.string().default(""),
  status: z.boolean().default(true),
  duration: z.enum(["month", "quarterly", "sixMonths", "year", "days"]).default("month"),
  days: z.number().min(1).default(1),
  trialPeriod: z.number().default(0),
});

export class CreatePlanDto extends createZodDto(createPlanSchema) {}
