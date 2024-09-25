import { t } from "@lingui/macro";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@reactive-resume/ui";

import { useDialog } from "@/client/stores/dialog";
import { PlanCards } from "../plans";
import { Payment } from "../payment";
import { useEffect, useState } from "react";
import { useUser } from "@/client/services/user";
import { useCreateSubscription } from "@/client/services/subscription";
import { usePrintResume } from "@/client/services/resume";
import { openInNewTab } from "@reactive-resume/utils";

export const SubscribeDialog = () => {
  const { createSubscription, loading: subscriptionLoading } = useCreateSubscription();
  const { printResume, loading: printLoading } = usePrintResume();
  const { user } = useUser();
  const { isOpen, close, payload } = useDialog("subscription");

  const [step, setStep] = useState<number>(1);
  const [selectedPriceId, setSelectedPriceId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const purchaseSubscription = async (priceId: string, planId: string) => {
    if (user?.isSubscriptionActive) {
      const { url } = await printResume({ id: payload.resumeId });
      openInNewTab(url);
    } else {
      await createSubscription({ priceId, planId });
      close();
    }
  };

  const onPlanSelect = (priceId: string, planId: string) => {
    setSelectedPriceId(priceId);
    setSelectedPlanId(planId);
    if (user?.isCardAttached) purchaseSubscription(priceId, planId);
    else setStep(2);
  };

  const reset = () => {
    setSelectedPriceId("");
    setSelectedPlanId("");
    setStep(1);
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Subscribe</AlertDialogTitle>
        </AlertDialogHeader>

        {step == 1 && (
          <PlanCards
            onClick={onPlanSelect}
            subscriptionLoading={subscriptionLoading}
            printLoading={printLoading}
          />
        )}
        {step == 2 && (
          <Payment
            onSuccess={() => purchaseSubscription(selectedPriceId, selectedPlanId)}
            subscriptionLoading={subscriptionLoading}
            printLoading={printLoading}
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
