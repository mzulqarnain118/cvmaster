import { cn } from "@reactive-resume/utils";

type Props = {
  name?: React.ReactNode;
  email?: React.ReactNode;
  subscription?: React.ReactNode;
  description?: React.ReactNode;
  plan?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const BaseListItem = ({
  name,
  email,
  subscription,
  plan,
  description,
  start,
  end,
  className,
  onClick,
}: Props) => (
  <div
    className={cn(
      "flex cursor-pointer items-center rounded p-4 transition-colors hover:bg-secondary/30",
      className,
    )}
    onClick={onClick}
  >
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex size-5 items-center justify-center">{start}</div>
        <h4 className="w-[220px] truncate font-medium lg:w-[150px]">{name}</h4>
        <p className="hidden text-xs opacity-75 sm:block w-[130px]">{email}</p>
        <p className="hidden text-xs opacity-75 sm:block w-[200px]">{subscription}</p>
        <p className="hidden text-xs opacity-75 sm:block w-[150px]">{plan}</p>
        <p className="hidden text-xs opacity-75 sm:block w-[185px]">{description}</p>
      </div>

      {end && <div className="flex size-5 items-center justify-center">{end}</div>}
    </div>
  </div>
);
