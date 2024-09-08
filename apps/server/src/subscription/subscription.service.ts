import { Injectable, InternalServerErrorException } from "@nestjs/common";
import Stripe from "stripe";
import { InjectStripeClient } from "@golevelup/nestjs-stripe";

const PRODUCT_ID = "prod_QnihnoExaBUFZa";

// const SUBSCRIPTION_STATUS = {
//   incomplete: "incomplete",
//   incomplete_expired: "incomplete_expired",
//   trialing: "trialing",
//   active: "active",
//   past_due: "past_due",
//   canceled: "canceled",
//   unpaid: "unpaid",
//   paused: "paused",
// };

@Injectable()
export class SubscriptionService {
  constructor(@InjectStripeClient() private stripe: Stripe) {}

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
}
