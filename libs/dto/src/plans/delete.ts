import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const deletePlanSchema = z.object({
  id: idSchema,
});

export class DeletePlanDto extends createZodDto(deletePlanSchema) {}
