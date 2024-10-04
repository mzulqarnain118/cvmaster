import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import Stripe from "stripe";
import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { PrismaService } from "nestjs-prisma";
import { CreatePlanDto, UpdatePlanDto, UserDto } from "@reactive-resume/dto";
import {
  amountToCents,
  getRecurring,
  subscriptionActive,
  subscriptionStatusLabel,
} from "./utils/helpers";
import { Duration, PRODUCT_ID, SUBSCRIPTION_STATUS } from "./utils/constants";
import { ErrorMessage } from "@reactive-resume/utils";

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  // Plans
  async findAllPlans() {
    return this.prisma.plans.findMany({
      where: { deleted: false },
      orderBy: { updatedAt: "desc" },
    });
  }
  findOnePlan(id: string) {
    return this.prisma.plans.findUniqueOrThrow({ where: { id, deleted: false } });
  }
  async createPlan(createPlanDto: CreatePlanDto) {
    const price = await this.stripe.prices.create({
      active: createPlanDto.status,
      nickname: createPlanDto.name,
      currency: "usd",
      recurring: getRecurring(createPlanDto.duration as Duration, createPlanDto.days) as any,
      unit_amount: amountToCents(createPlanDto.price),
      product: PRODUCT_ID,
    });

    return this.prisma.plans.create({
      data: {
        name: createPlanDto.name,
        price: createPlanDto.price,
        currency: createPlanDto.currency || "$",
        description: createPlanDto.description ?? "",
        status: createPlanDto.status,
        duration: createPlanDto.duration,
        days: createPlanDto.duration == "days" ? createPlanDto.days : 1,
        trialPeriod: createPlanDto.trialPeriod,
        planType: createPlanDto.planType,
        priceId: price.id,
      },
    });
  }
  async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      const prev = await this.prisma.plans.findUniqueOrThrow({
        where: { id },
      });
      if (prev.deleted) throw new BadRequestException(ErrorMessage.PlanNotFound);

      // update price
      let stripePrice = await this.stripe.prices.retrieve(prev.priceId);
      if (
        stripePrice.unit_amount != amountToCents(updatePlanDto.price ?? 0) ||
        prev.duration != updatePlanDto.duration ||
        prev.days != updatePlanDto.days
      ) {
        if (stripePrice.active) await this.stripe.prices.update(prev.priceId, { active: false });
        stripePrice = await this.stripe.prices.create({
          active: updatePlanDto.status,
          nickname: updatePlanDto.name,
          currency: "usd",
          recurring: getRecurring(
            updatePlanDto.duration as Duration,
            updatePlanDto.days ?? 0,
          ) as any,
          unit_amount: amountToCents(updatePlanDto.price ?? 0),
          product: PRODUCT_ID,
        });
      } else if (prev.status != updatePlanDto.status || prev.name != updatePlanDto.name) {
        stripePrice = await this.stripe.prices.update(prev.priceId, {
          active: updatePlanDto.status,
          nickname: updatePlanDto.name,
        });
      }

      // update DB
      return await this.prisma.plans.update({
        data: {
          name: updatePlanDto.name,
          price: updatePlanDto.price,
          duration: updatePlanDto.duration,
          days: updatePlanDto.days,
          trialPeriod: updatePlanDto.trialPeriod,
          planType: updatePlanDto.planType,
          description: updatePlanDto.description,
          status: updatePlanDto.status,
          priceId: stripePrice.id,
        },
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
  async removePlan(id: string) {
    const { priceId } = await this.prisma.plans.findUniqueOrThrow({
      where: { id },
      select: { priceId: true },
    });

    // archive Price
    await this.stripe.prices.update(priceId, { active: false });

    return this.prisma.plans.update({
      data: { deleted: true },
      where: { id },
    });
  }

  // Customers
  async getPaymentUser(id: string) {
    try {
      return (await this.stripe.customers.retrieve(id)) as any;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async createPaymentUser(email: string, name: string) {
    try {
      return (await this.stripe.customers.create({ email, name })) as any;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Payment Methods
  async createPaymentMethod(card: any) {
    return await this.stripe.paymentMethods.create(card);
  }
  async attachPaymentMethod(paymentMethod: string, customer: string) {
    return await this.stripe.paymentMethods.attach(paymentMethod, { customer });
  }
  async addCustomerPaymentMethod(
    customerId: string,
    source: string,
    type: string,
    isDefault = true,
  ) {
    try {
      let paymentMethod = source;
      if (type === "card") {
        // create payment method
        const cardPaymentMethod = await this.createPaymentMethod({
          type: "card",
          "card[token]": source,
        });
        paymentMethod = cardPaymentMethod.id;
      }

      // attach to customer
      await this.attachPaymentMethod(paymentMethod, customerId);
      if (isDefault) {
        await this.stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: paymentMethod },
        });
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Subscriptions
  async get(id: string) {
    try {
      return await this.stripe.subscriptions.retrieve(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async cancel(id: string, cancel_at_period_end = true) {
    try {
      const subscription = await this.get(id);

      // remove previous schedule
      // if (subscription.schedule) await releaseSchedule(subscription.schedule);

      return cancel_at_period_end
        ? await this.stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end,
          })
        : await this.stripe.subscriptions.cancel(subscription.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async create(
    customerId: string,
    email: string,
    trialAvailed: boolean,
    priceId: string,
    planId: string,
  ) {
    try {
      const planDetails = await this.prisma.plans.findUniqueOrThrow({
        where: { id: planId, deleted: false },
      });

      const trial_period_days = trialAvailed ? 0 : planDetails.trialPeriod ?? 0;
      const sourceData = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days,
      });

      // First payment error
      if (sourceData.status === SUBSCRIPTION_STATUS.incomplete) {
        await this.cancel(sourceData.id, false);
        throw new Error(`Payment attempt fails, please check your payment method`);
      }

      // update user
      await this.prisma.user.update({
        where: { email },
        data: {
          subscriptionId: sourceData.id,
          planId,
          trialAvailed: trial_period_days > 0,
        },
      });

      return sourceData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // helpers
  async userSubscriptionInfo(user: UserDto) {
    const response = {
      isSubscriptionActive: false,
      planName: "",
      subscriptionStatus: "In-active",
      planType: "both",
    };

    if (user.subscriptionId) {
      const subscription = await this.get(user.subscriptionId);
      response.isSubscriptionActive = subscriptionActive(subscription);
      response.subscriptionStatus = subscriptionStatusLabel(subscription);
    }

    if (user.planId) {
      const plan = await this.prisma.plans.findUniqueOrThrow({ where: { id: user.planId } });
      response.planName = plan.name;
      response.planType = plan.planType;
    }

    return response;
  }
}
