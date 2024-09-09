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
import { useUpdateUser, useUser } from "@/client/services/user";
import { useCreateSubscription } from "@/client/services/subscription";
import { usePrintResume } from "@/client/services/resume";

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const SubscribeDialog = () => {
  const { createSubscription, loading: subscriptionLoading } = useCreateSubscription();
  const { printResume, loading: printLoading } = usePrintResume();

  const { user } = useUser();
  const { isOpen, close, payload } = useDialog("subscription");

  const [step, setStep] = useState<number>(1);
  const [selected, setSelected] = useState<string>("");

  const purchaseSubscription = async (id: string) => {
    await createSubscription(id);
    const { url } = await printResume({ id: payload.resumeId });
    openInNewTab(url);
    close();
  };

  const onPlanSelect = (id: string) => {
    setSelected(id);
    if (user?.isCardAttached) purchaseSubscription(id);
    else setStep(2);
  };

  const reset = () => {
    setSelected("");
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
            onSuccess={() => purchaseSubscription(selected)}
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
