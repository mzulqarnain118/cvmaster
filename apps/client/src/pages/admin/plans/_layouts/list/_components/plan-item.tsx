import { t } from "@lingui/macro";
import { DotsThreeVertical, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { PlanDto } from "@reactive-resume/dto";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import dayjs from "dayjs";
import { useDialog } from "@/client/stores/dialog";
import { BaseListItem } from "./base-item";

type Props = {
  plan: PlanDto;
};

export const PlanListItem = ({ plan }: Props) => {
  const { open } = useDialog<PlanDto>("plan");

  const lastUpdated = dayjs().to(plan.updatedAt);

  const onUpdate = () => {
    open("update", { id: "plan", item: plan });
  };

  const onDelete = () => {
    open("delete", { id: "plan", item: plan });
  };

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="aspect-square">
        <Button size="icon" variant="ghost">
          <DotsThreeVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onUpdate();
          }}
        >
          <PencilSimple size={14} className="mr-2" />
          {`Edit`}
        </DropdownMenuItem>

        <ContextMenuSeparator />

        <DropdownMenuItem
          className="text-error"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger className="even:bg-secondary/20">
        <BaseListItem
          className="group"
          name={plan.name}
          price={plan.price}
          duration={plan.duration}
          status={plan.status === true ? "Active" : "In-active"}
          description={t`Last updated ${lastUpdated}`}
          end={dropdownMenu}
        />
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onUpdate}>
          <PencilSimple size={14} className="mr-2" />
          {`Edit`}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-error" onClick={onDelete}>
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
