import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Logger,
  InternalServerErrorException,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { SubscriptionService } from "./subscription.service";
import { User as UserEntity } from "@prisma/client";
import { User } from "@/server/user/decorators/user.decorator";
import { CreatePlanDto, PlanDto, UpdatePlanDto } from "@reactive-resume/dto";
import { PlanGuard } from "./guards/plan.guard";
import { Plan } from "./decorators/plan.decorator";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Subscriptions

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() body: any) {
    try {
      await this.subscriptionService.create(
        user.paymentUserId as string,
        user.email,
        user.trialAvailed,
        body.priceId,
        body.planId,
      );
      return true;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // Plans

  @Get("/plan")
  @UseGuards(TwoFactorGuard)
  findAllPlans() {
    return this.subscriptionService.findAllPlans();
  }

  @Get("/plan/:id")
  @UseGuards(TwoFactorGuard, PlanGuard)
  findOnePlan(@Plan() plan: PlanDto) {
    return plan;
  }

  @Post("/plan")
  @UseGuards(TwoFactorGuard)
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    try {
      return await this.subscriptionService.createPlan(createPlanDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Patch("/plan/:id")
  @UseGuards(TwoFactorGuard)
  updatePlan(@Param("id") id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.subscriptionService.updatePlan(id, updatePlanDto);
  }

  @Delete("/plan/:id")
  @UseGuards(TwoFactorGuard)
  removePlan(@Param("id") id: string) {
    return this.subscriptionService.removePlan(id);
  }

  // Payment

  @Post("/payment-method/attach")
  @UseGuards(TwoFactorGuard)
  async attachPaymentMethod(@User() user: UserEntity, @Body() body: any) {
    try {
      await this.subscriptionService.addCustomerPaymentMethod(
        user.paymentUserId as string,
        body.source,
        body.type,
      );

      return true;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
