import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { SubscriptionService } from "./subscription.service";
import { User as UserEntity } from "@prisma/client";
import { User } from "@/server/user/decorators/user.decorator";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get("/plans")
  @UseGuards(TwoFactorGuard)
  findAllPlans() {
    return this.subscriptionService.findAllPlans();
  }

  @Post("/payment-method/attach")
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() body: any) {
    try {
      await this.subscriptionService.addCustomerPaymentMethod(
        user.paymentUserId as string,
        body.source,
      );

      return true;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // @Post()
  // @UseGuards(TwoFactorGuard)
  // async create(@User() user: UserEntity, @Body() createSubscriptionDto: any) {
  //   try {
  //     return await this.subscriptionService.create(user.id, createSubscriptionDto);
  //   } catch (error) {
  //     Logger.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }
}
