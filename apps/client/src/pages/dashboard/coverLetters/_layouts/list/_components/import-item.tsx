import { t } from "@lingui/macro";
import { DownloadSimple } from "@phosphor-icons/react";
import { KeyboardShortcut } from "@reactive-resume/ui";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

export const ImportCoverLetterListItem = () => {
  const { open } = useDialog("importCL");

  return (
    <BaseListItem
      start={<DownloadSimple size={18} />}
      title={
        <>
          <span>{`Import an existing cover letter`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^I</KeyboardShortcut>
        </>
      }
      description={`LinkedIn, JSON Cover letter, etc.`}
      onClick={() => {
        open("create");
      }}
    />
  );
};
