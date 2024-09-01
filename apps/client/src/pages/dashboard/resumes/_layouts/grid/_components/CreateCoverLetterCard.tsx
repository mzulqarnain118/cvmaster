import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { KeyboardShortcut } from "@reactive-resume/ui";
import { useDialog } from "@/client/stores/dialog";
import { BaseCard } from "./base-card";

export const CreateCoverLetterCard = () => {
  const { open } = useDialog("coverLetter");

  return (
    <BaseCard
      onClick={() => {
        open("create");
      }}
    >
      <Plus size={64} weight="thin" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12 bg-gradient-to-t from-background/80 to-transparent">
        <h4 className="font-medium">
          {t`Create a new cover letter`}
          <KeyboardShortcut className="ml-2">^L</KeyboardShortcut>
        </h4>
        <p className="text-xs opacity-75">{t`Start building from scratch`}</p>
      </div>
    </BaseCard>
  );
};
