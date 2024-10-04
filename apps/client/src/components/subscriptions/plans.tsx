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

const features = {
  both: ["Resume", "Cover Letter"],
  resume: ["Resume"],
  coverLetter: ["Cover Letter"],
};
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
      {loading &&
        Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{
              animationFillMode: "backwards",
              animationDelay: `${i * 200}ms`,
            }}
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
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: (index + 1) * 0.1 },
              }}
              exit={{
                opacity: 0,
                filter: "blur(10px)",
                transition: { duration: 0.6 },
              }}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <BaseCard
                    className="space-y-0 shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition-shadow"
                    isPopular={index === 1}
                    trialDays={user?.trialAvailed ? 0 : plan.trialPeriod}
                  >
                    <div className="p-6 text-center flex flex-col justify-between">
                      <h3 className="text-2xl font-bold text-white mb-3">{plan.name || ""}</h3>
                      <p className="text-3xl font-extrabold text-white mb-4">
                        ${plan.price ?? 0}
                        <span className="text-sm font-medium text-white ml-1">
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
                      <ul className="text-sm mb-6 flex flex-col items-start">
                        {features?.[plan?.planType]?.map((feat, idx) => (
                          <li key={idx} className="flex items-center mb-2">
                            <Star weight="fill" className="text-yellow-400 mr-2" />
                            {feat} Download
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full bg-white text-black transition-colors duration-200"
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
