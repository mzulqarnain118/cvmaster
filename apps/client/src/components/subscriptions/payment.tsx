import { useAttachPaymentMethod } from "@/client/services/subscription";
import {
  Elements,
  ElementsConsumer,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@reactive-resume/ui";
import { useEffect, useState } from "react";
import { PlanDto } from "@reactive-resume/dto";

const stripePromise = loadStripe(
  "pk_test_51MPNmZAmjpmKiIpxOPgBvB8pRZR0KoE6KFdEyOCGY6F4R6KwHPiWG4z6B0vZdkFn6DN1Z1x9UsXtDX2njOTaNGkI00fmuLeg5J",
);

const CheckoutForm = ({
  stripe,
  elements,
  selectedPlan,
  onSuccess,
  subscriptionLoading,
  printLoading,
}: {
  stripe: any;
  elements: any;
  selectedPlan: PlanDto;
  onSuccess: () => void;
  subscriptionLoading: boolean;
  printLoading: boolean;
}) => {
  const { attachPaymentMethod, loading } = useAttachPaymentMethod();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [isPaymentRequestAvailable, setIsPaymentRequestAvailable] = useState(false);

  const handleApplePay = async () => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Subscription Fee",
        amount: Math.round(parseFloat(selectedPlan.price as unknown as string) * 100), // Amount in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if the payment request can be made
    const canMakePayment = await pr.canMakePayment();
    setIsPaymentRequestAvailable(!!canMakePayment);

    pr.on("token", async (event: any) => {
      try {
        await attachPaymentMethod({ source: event.token.id, type: "applePay" });
        onSuccess();
        event.complete("success");
      } catch (error) {
        console.log(error);
        event.complete("fail");
      }
    });

    setPaymentRequest(pr);
  };

  useEffect(() => {
    handleApplePay();
  }, [stripe]);

  useEffect(() => {
    hideStripeElement();
  }, [stripe, document.querySelectorAll(".ElementsApp")]);

  const hideStripeElement = () => {
    const elements = document.querySelectorAll(".ElementsApp");
    elements.forEach((element) => {
      element.classList.add("hide-stripe-element");
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    const token_id = result.token.id;
    await attachPaymentMethod({ source: token_id, type: "card" });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-5">Add your Payment Details</h3>
      <CardElement />

      {isPaymentRequestAvailable && paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}

      {!isPaymentRequestAvailable && (
        <h4 className="mt-5 mb-3">Apple Pay is not available on this device or browser.</h4>
      )}

      <Button
        className="w-full mt-5"
        variant="primary"
        disabled={!stripe || loading || subscriptionLoading || printLoading}
      >
        {loading || subscriptionLoading || printLoading ? "Loading..." : "Continue"}
      </Button>
    </form>
  );
};

export const Payment = ({
  selectedPlan,
  onSuccess,
  subscriptionLoading,
  printLoading,
}: {
  selectedPlan: PlanDto;
  onSuccess: () => void;
  subscriptionLoading: boolean;
  printLoading: boolean;
}) => {
  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm
            stripe={stripe}
            elements={elements}
            selectedPlan={selectedPlan}
            onSuccess={onSuccess}
            subscriptionLoading={subscriptionLoading}
            printLoading={printLoading}
          />
        )}
      </ElementsConsumer>
    </Elements>
  );
};
