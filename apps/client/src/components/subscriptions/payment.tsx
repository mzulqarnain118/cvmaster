import { useAttachPaymentMethod } from "@/client/services/subscription";
import { Elements, ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MPNmZAmjpmKiIpxOPgBvB8pRZR0KoE6KFdEyOCGY6F4R6KwHPiWG4z6B0vZdkFn6DN1Z1x9UsXtDX2njOTaNGkI00fmuLeg5J",
);

const CheckoutForm = ({
  stripe,
  elements,
  onSuccess,
}: {
  stripe: any;
  elements: any;
  onSuccess: () => void;
}) => {
  const { attachPaymentMethod, loading } = useAttachPaymentMethod();

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
    await attachPaymentMethod(token_id);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-5">Add your Payment Details</h3>
      <CardElement />
      <button className="mt-5" disabled={!stripe || loading}>
        {loading ? "Loading..." : "Continue"}
      </button>
    </form>
  );
};

export const Payment = ({ onSuccess }: { onSuccess: () => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm stripe={stripe} elements={elements} onSuccess={onSuccess} />
        )}
      </ElementsConsumer>
    </Elements>
  );
};
