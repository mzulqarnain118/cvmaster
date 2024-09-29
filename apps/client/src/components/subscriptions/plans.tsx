import { Card, Button } from "@reactive-resume/ui";
import Tilt from "react-parallax-tilt";
import { defaultTiltProps } from "@/client/constants/parallax-tilt";
import { usePlans } from "@/client/services/plan";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@reactive-resume/utils";
import { ContextMenu, ContextMenuTrigger } from "@reactive-resume/ui";
import { Star, StarHalf } from "@phosphor-icons/react";
import { useUser } from "@/client/services/user";
import { PlanDto } from "@reactive-resume/dto";

const BaseCard = ({
  children,
  className,
  onClick,
  isPopular,
  trialDays,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isPopular?: boolean;
  trialDays?: number;
}) => (
  <Tilt {...defaultTiltProps}>
    <Card
      className={cn(
        "relative flex aspect-[1/1.4142] scale-100 cursor-pointer items-center justify-center bg-gradient-to-br from-secondary/50 to-primary/30 p-0 transition-all hover:shadow-lg hover:scale-105 active:scale-95",
        className,
      )}
      onClick={onClick}
    >
      {trialDays != undefined && trialDays > 0 && (
        <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded-bl-md">
          {trialDays} day(s) trial
        </div>
      )}

      {isPopular && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded-bl-md">
          Popular
        </div>
      )}

      {children}
    </Card>
  </Tilt>
);

export const PlanCards = ({
  onClick,
  subscriptionLoading,
  printLoading,
}: {
  onClick: (plan: PlanDto) => void;
  subscriptionLoading: boolean;
  printLoading: boolean;
}) => {
  const { plans, loading } = usePlans();
  const { user } = useUser();

  const data = plans?.filter((item) => item.status == true);

  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
      {loading &&
        Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseCard />
          </div>
        ))}

      {data && (
        <AnimatePresence>
          {data.map((plan, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <BaseCard
                    className="space-y-0"
                    isPopular={index === 1}
                    trialDays={user?.trialAvailed ? 0 : plan.trialPeriod}
                  >
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">{plan.name || ""}</h3>
                      <p className="text-3xl font-extrabold mb-4">
                        ${plan.price ?? 0}
                        <span className="text-sm font-normal">
                          /
                          {plan.duration == "month"
                            ? "Monthly"
                            : plan.duration == "quarterly"
                              ? "Every 3 months"
                              : plan.duration == "sixMonths"
                                ? "Every 6 months"
                                : plan.duration == "year"
                                  ? "Yearly"
                                  : plan.duration == "days"
                                    ? `Every ${plan.days} day(s)`
                                    : plan.duration}
                        </span>
                      </p>
                      <ul className="text-sm mb-6">
                        <li className="flex items-center justify-center mb-2">
                          <Star weight="fill" className="text-yellow-400 mr-2" />
                          Feature 1
                        </li>
                        <li className="flex items-center justify-center mb-2">
                          <Star weight="fill" className="text-yellow-400 mr-2" />
                          Feature 2
                        </li>
                        <li className="flex items-center justify-center">
                          <StarHalf weight="fill" className="text-yellow-400 mr-2" />
                          Feature 3
                        </li>
                      </ul>
                      <Button
                        className="w-full"
                        variant="primary"
                        disabled={subscriptionLoading || printLoading}
                        onClick={() => onClick(plan)}
                      >
                        {subscriptionLoading || printLoading ? "Processing..." : "Get Started"}
                      </Button>
                    </div>
                  </BaseCard>
                </ContextMenuTrigger>
              </ContextMenu>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
