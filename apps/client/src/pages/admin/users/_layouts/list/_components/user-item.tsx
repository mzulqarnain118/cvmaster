import { t } from "@lingui/macro";
import { UserDto } from "@reactive-resume/dto";
import { ContextMenu, ContextMenuTrigger } from "@reactive-resume/ui";
import dayjs from "dayjs";
import { BaseListItem } from "./base-item";

type Props = {
  user: UserDto;
};

export const UserListItem = ({ user }: Props) => {
  const lastUpdated = dayjs().to(user.updatedAt);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="even:bg-secondary/20">
        <BaseListItem
          className="group"
          name={user.name}
          email={user.email}
          subscription={user.subscriptionStatus}
          plan={user.planName}
          description={t`Last updated ${lastUpdated}`}
        />
      </ContextMenuTrigger>
    </ContextMenu>
  );
};
