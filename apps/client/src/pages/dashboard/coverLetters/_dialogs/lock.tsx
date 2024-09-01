import { t } from "@lingui/macro";
import { ResumeDto } from "@reactive-resume/dto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@reactive-resume/ui";

import { useLockResume } from "@/client/services/resume/lock";
import { useDialog } from "@/client/stores/dialog";

export const LockCLDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ResumeDto>("lockCL");

  const isLockMode = mode === "create";
  const isUnlockMode = mode === "update";

  const { lockResume, loading } = useLockResume();

  const onSubmit = async () => {
    if (!payload.item) return;

    await lockResume({ id: payload.item.id, set: isLockMode });

    close();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isLockMode && `Are you sure you want to lock this cover letter?`}
            {isUnlockMode && `Are you sure you want to unlock this cover letter?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLockMode &&
              `Locking a cover letter will prevent any further changes to it. This is useful when you have already shared your cover letter with someone and you don't want to accidentally make any changes to it.`}
            {isUnlockMode && `Unlocking a cover letter will allow you to make changes to it again.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
          <AlertDialogAction variant="info" disabled={loading} onClick={onSubmit}>
            {isLockMode && t`Lock`}
            {isUnlockMode && t`Unlock`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
