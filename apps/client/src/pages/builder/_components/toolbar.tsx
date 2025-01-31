import { t } from "@lingui/macro";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CircleNotch,
  ClockClockwise,
  CubeFocus,
  FilePdf,
  Hash,
  LineSegment,
  LinkSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { Button, Separator, Toggle, Tooltip } from "@reactive-resume/ui";
import { motion } from "framer-motion";

import { useToast } from "@/client/hooks/use-toast";
import { usePrintResume } from "@/client/services/resume";
import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore, useTemporalResumeStore } from "@/client/stores/resume";
import { useDialog } from "@/client/stores/dialog";
import { useUser } from "@/client/services/user";

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const BuilderToolbar = () => {
  const { user } = useUser();
  const { open } = useDialog("subscription");
  const { toast } = useToast();
  const setValue = useResumeStore((state) => state.setValue);
  const undo = useTemporalResumeStore((state) => state.undo);
  const redo = useTemporalResumeStore((state) => state.redo);
  const frameRef = useBuilderStore((state) => state.frame.ref);

  const { id, type } = useResumeStore((state) => state.resume);
  const isPublic = useResumeStore((state) => state.resume.visibility === "public");
  const pageOptions = useResumeStore((state) => state.resume.data.metadata.page.options);

  const { printResume, loading } = usePrintResume();

  const onPrint = async () => {
    if (user?.isSubscriptionActive) {
      if (user?.planType !== "both" && type !== user?.planType) {
        toast({
          variant: "info",
          title: t`Upgrade your subscription.`,
          description: t`Your subscription does not include ${type}.Please upgrade your subsciption for unlocking this feature.`,
        });
        return;
      }

      const { url } = await printResume({ id });
      openInNewTab(url);
    } else {
      open("create", { resumeId: id });
    }
  };

  const onCopy = async () => {
    if (user?.isSubscriptionActive) {
      const { url } = await printResume({ id });
      await navigator.clipboard.writeText(url);
      toast({
        variant: "success",
        title: t`A link has been copied to your clipboard.`,
        description: t`Anyone with this link can view and download the resume. Share it on your profile or with recruiters.`,
      });
    } else {
      open("create", { resumeId: id });
    }
  };

  const onZoomIn = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_IN" }, "*");
  const onZoomOut = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_OUT" }, "*");
  const onResetView = () => frameRef?.contentWindow?.postMessage({ type: "RESET_VIEW" }, "*");
  const onCenterView = () => frameRef?.contentWindow?.postMessage({ type: "CENTER_VIEW" }, "*");

  return (
    <motion.div className="fixed inset-x-0 bottom-0 mx-auto hidden py-6 text-center md:block">
      <div className="inline-flex items-center justify-center rounded-full bg-background px-4 shadow-xl">
        <Tooltip content={t`Undo`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            onClick={() => {
              undo();
            }}
          >
            <ArrowCounterClockwise />
          </Button>
        </Tooltip>

        <Tooltip content={t`Redo`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            onClick={() => {
              redo();
            }}
          >
            <ArrowClockwise />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Zoom In`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomIn}>
            <MagnifyingGlassPlus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Zoom Out`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomOut}>
            <MagnifyingGlassMinus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Reset Zoom`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onResetView}>
            <ClockClockwise />
          </Button>
        </Tooltip>

        <Tooltip content={t`Center Artboard`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onCenterView}>
            <CubeFocus />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Toggle Page Break Line`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.breakLine}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.breakLine", pressed);
            }}
          >
            <LineSegment />
          </Toggle>
        </Tooltip>

        <Tooltip content={t`Toggle Page Numbers`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.pageNumbers}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.pageNumbers", pressed);
            }}
          >
            <Hash />
          </Toggle>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Copy Link to Resume`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            disabled={!isPublic}
            onClick={onCopy}
          >
            <LinkSimple />
          </Button>
        </Tooltip>

        <Tooltip content={t`Download PDF`}>
          <Button
            size="icon"
            variant="ghost"
            disabled={loading}
            className="rounded-none"
            onClick={onPrint}
          >
            {loading ? <CircleNotch className="animate-spin" /> : <FilePdf />}
          </Button>
        </Tooltip>
      </div>
    </motion.div>
  );
};
