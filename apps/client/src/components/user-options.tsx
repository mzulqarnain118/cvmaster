import { t } from "@lingui/macro";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  KeyboardShortcut,
} from "@reactive-resume/ui";
import { useNavigate } from "react-router-dom";

import { useLogout } from "../services/auth";
import { useUser } from "@/client/services/user";

type Props = {
  children: React.ReactNode;
};

export const UserOptions = ({ children }: Props) => {
  const { user } = useUser();

  const navigate = useNavigate();
  const { logout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            navigate(user?.role === "admin" ? "/admin/settings" : "/dashboard/settings");
          }}
        >
          {t`Settings`}
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut>⇧S</KeyboardShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          {t`Logout`}
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut>⇧Q</KeyboardShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
