import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Patch,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateUserDto, UserDto } from "@reactive-resume/dto";
import { ErrorMessage } from "@reactive-resume/utils";
import type { Response } from "express";

import { AuthService } from "../auth/auth.service";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "./decorators/user.decorator";
import { UserService } from "./user.service";
import { SubscriptionService } from "../subscription/subscription.service";
export type PlanType = "resume" | "coverLetter" | "both";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  async findAllUsers() {
    const usersList = (await this.userService.findAllUsers()) as UserDto[];

    for await (const user of usersList) {
      const resp = await this.subscriptionService.userSubscriptionInfo(user);
      user.isSubscriptionActive = resp.isSubscriptionActive;
      user.planName = resp.planName;
      user.subscriptionStatus = resp.subscriptionStatus;
      user.planType = resp.planType as PlanType;
    }

    return usersList;
  }

  // Me

  @Get("me")
  @UseGuards(TwoFactorGuard)
  async fetch(@User() user: UserDto) {
    const paymentUser = user.paymentUserId
      ? await this.subscriptionService.getPaymentUser(user.paymentUserId)
      : await this.subscriptionService.createPaymentUser(user.email, user.name);

    if (!user.paymentUserId) {
      await this.userService.updateByEmail(user.email, { paymentUserId: paymentUser.id });
      user.paymentUserId = paymentUser.id;
    }

    user.isCardAttached =
      paymentUser?.invoice_settings?.default_payment_method || paymentUser?.default_source
        ? true
        : false;

    const resp = await this.subscriptionService.userSubscriptionInfo(user);
    console.log("🚀 ~ UserController ~ fetch ~ resp:", resp);
    user.isSubscriptionActive = resp.isSubscriptionActive;
    user.planName = resp.planName;
    user.subscriptionStatus = resp.subscriptionStatus;
    user.planType = resp.planType as PlanType;

    return user;
  }

  @Patch("me")
  @UseGuards(TwoFactorGuard)
  async update(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    try {
      // If user is updating their email, send a verification email
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        await this.userService.updateByEmail(user.email, {
          emailVerified: false,
          email: updateUserDto.email,
        });

        await this.authService.sendVerificationEmail(updateUserDto.email);

        user.email = updateUserDto.email;
      }

      const returnUser = await this.userService.updateByEmail(user.email, {
        name: updateUserDto.name,
        picture: updateUserDto.picture,
        username: updateUserDto.username,
        locale: updateUserDto.locale,
      });

      const paymentUser = user.paymentUserId
        ? await this.subscriptionService.getPaymentUser(user.paymentUserId)
        : await this.subscriptionService.createPaymentUser(user.email, user.name);

      if (!user.paymentUserId) {
        await this.userService.updateByEmail(user.email, { paymentUserId: paymentUser.id });
        returnUser.paymentUserId = paymentUser.id;
      }

      const isCardAttached =
        paymentUser?.invoice_settings?.default_payment_method || paymentUser?.default_source
          ? true
          : false;

      const { isSubscriptionActive, planName, subscriptionStatus } =
        await this.subscriptionService.userSubscriptionInfo(user);

      return { ...returnUser, isCardAttached, isSubscriptionActive, planName, subscriptionStatus };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete("me")
  @UseGuards(TwoFactorGuard)
  async delete(@User("id") id: string, @Res({ passthrough: true }) response: Response) {
    await this.userService.deleteOneById(id);

    response.clearCookie("Authentication");
    response.clearCookie("Refresh");

    response.status(200).send({ message: "Sorry to see you go, goodbye!" });
  }
}
