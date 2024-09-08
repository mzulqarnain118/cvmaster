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

export const SubscribeDialog = () => {
  const { user } = useUser();
  const { isOpen, close } = useDialog("subscription");

  const [step, setStep] = useState<number>(1);
  const [selected, setSelected] = useState<string>("");

  const purchaseSubscription = (id: string) => {};

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

        {step == 1 && <PlanCards onClick={onPlanSelect} />}
        {step == 2 && <Payment onSuccess={() => purchaseSubscription(selected)} />}

        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
