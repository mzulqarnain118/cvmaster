import { cn } from "@reactive-resume/utils";

type Props = {
  name?: React.ReactNode;
  price?: React.ReactNode;
  currency?: React.ReactNode;
  duration?: React.ReactNode;
  status?: React.ReactNode;
  description?: React.ReactNode;
  days?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const BaseListItem = ({
  name,
  price,
  currency,
  duration,
  days,
  status,
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
        <h4 className="w-[220px] truncate font-medium lg:w-[320px]">{name}</h4>
        {price != null && price != undefined && (
          <p className="hidden text-xs opacity-75 sm:block w-[60px]">{`${currency}${price}`}</p>
        )}
        <p className="hidden text-xs opacity-75 sm:block w-[120px]">
          {duration == "month"
            ? "Monthly"
            : duration == "quarterly"
              ? "Every 3 months"
              : duration == "sixMonths"
                ? "Every 6 months"
                : duration == "year"
                  ? "Yearly"
                  : duration == "days"
                    ? `Every ${days} day(s)`
                    : duration}
        </p>
        <p className="hidden text-xs opacity-75 sm:block w-[70px]">{status}</p>
        <p className="hidden text-xs opacity-75 sm:block w-[185px]">{description}</p>
      </div>

      {end && <div className="flex size-5 items-center justify-center">{end}</div>}
    </div>
  </div>
);
