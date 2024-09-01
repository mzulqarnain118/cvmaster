import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { ResumeDto } from "@reactive-resume/dto";
import { KeyboardShortcut } from "@reactive-resume/ui";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

export const CreateCoverLetterListItem = () => {
  const { open } = useDialog<ResumeDto>("coverLetter");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      title={
        <>
          <span>{`Create a new cover letter`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^N</KeyboardShortcut>
        </>
      }
      description={t`Start building from scratch`}
      onClick={() => {
        open("create");
      }}
    />
  );
};
