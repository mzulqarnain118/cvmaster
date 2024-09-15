import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import Stripe from "stripe";
import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { PrismaService } from "nestjs-prisma";
import { CreatePlanDto, UpdatePlanDto } from "@reactive-resume/dto";
import { amountToCents, getRecurring } from "./utils/helpers";
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
        days: createPlanDto.days,
        trialPeriod: createPlanDto.trialPeriod,
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
  async addCustomerPaymentMethod(customerId: string, source: string, isDefault = true) {
    try {
      // create payment method
      const paymentMethod = await this.createPaymentMethod({
        type: "card",
        "card[token]": source,
      });

      // attach to customer
      await this.attachPaymentMethod(paymentMethod.id, customerId);
      if (isDefault) {
        await this.stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: paymentMethod.id },
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
  async create(customerId: string, email: string, priceId: string) {
    try {
      const sourceData = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });

      // First payment error
      if (sourceData.status === SUBSCRIPTION_STATUS.incomplete) {
        await this.cancel(sourceData.id, false);
        throw new Error(`Payment attempt fails, please check your payment method`);
      }

      // update user
      await this.prisma.user.update({
        where: { email },
        data: { subscriptionId: sourceData.id },
      });

      return sourceData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
