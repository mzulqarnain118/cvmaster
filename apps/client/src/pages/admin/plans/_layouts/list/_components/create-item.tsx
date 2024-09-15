import { Plus } from "@phosphor-icons/react";
import { PlanDto } from "@reactive-resume/dto";
import { KeyboardShortcut } from "@reactive-resume/ui";
import { useDialog } from "@/client/stores/dialog";
import { BaseListItem } from "./base-item";

export const CreatePlanListItem = () => {
  const { open } = useDialog<PlanDto>("plan");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      name={
        <>
          <span>{`Create a new plan`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^N</KeyboardShortcut>
        </>
      }
      onClick={() => {
        open("create");
      }}
    />
  );
};
