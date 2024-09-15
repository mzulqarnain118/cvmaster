import { createZodDto } from "nestjs-zod/dto";

import { planSchema } from "./plan";

export const updatePlanSchema = planSchema.partial();

export class UpdatePlanDto extends createZodDto(updatePlanSchema) {}
