import { Injectable, InternalServerErrorException } from "@nestjs/common";
import Stripe from "stripe";
import { InjectStripeClient } from "@golevelup/nestjs-stripe";
import { PrismaService } from "nestjs-prisma";
import { SUBSCRIPTION_STATUS } from "./utils/constants";

const PRODUCT_ID = "prod_QnihnoExaBUFZa";

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  // Plans
  async findAllPlans() {
    try {
      const prices = await this.stripe.prices.list({
        product: PRODUCT_ID,
        type: "recurring",
        active: true,
      });
      return prices.data ?? [];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
