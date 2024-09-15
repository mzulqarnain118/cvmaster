import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { ErrorMessage } from "@reactive-resume/utils";
import { Request } from "express";

import { SubscriptionService } from "../subscription.service";

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const plan = await this.subscriptionService.findOnePlan(request.params.id);
      request.payload = { plan };
      return true;
    } catch {
      throw new NotFoundException(ErrorMessage.PlanNotFound);
    }
  }
}
