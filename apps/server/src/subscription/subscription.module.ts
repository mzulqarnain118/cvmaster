import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeModule } from "@golevelup/nestjs-stripe";

@Module({
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get("STRIPE_SECRET_KEY") as string,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
