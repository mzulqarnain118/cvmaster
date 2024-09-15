import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PlanDto } from "@reactive-resume/dto";

export const Plan = createParamDecorator(
  (data: keyof PlanDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const plan = request.payload?.plan as PlanDto;
    return data ? plan[data] : plan;
  },
);
