import { Card, Button } from "@reactive-resume/ui";
import Tilt from "react-parallax-tilt";
import { defaultTiltProps } from "@/client/constants/parallax-tilt";
import { usePlans } from "@/client/services/subscription";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@reactive-resume/utils";
import { ContextMenu, ContextMenuTrigger } from "@reactive-resume/ui";
import { Star, StarHalf } from "@phosphor-icons/react";

const BaseCard = ({
  children,
  className,
  onClick,
  isPopular,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isPopular?: boolean;
}) => (
  <Tilt {...defaultTiltProps}>
    <Card
      className={cn(
        "relative flex aspect-[1/1.4142] scale-100 cursor-pointer items-center justify-center bg-gradient-to-br from-secondary/50 to-primary/30 p-0 transition-all hover:shadow-lg hover:scale-105 active:scale-95",
        className,
      )}
      onClick={onClick}
    >
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
  onClick: (id: string) => void;
  subscriptionLoading: boolean;
  printLoading: boolean;
}) => {
  const { plans, loading } = usePlans();

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

      {plans && (
        <AnimatePresence>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <BaseCard className="space-y-0" isPopular={index === 1}>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">{plan.nickname || ""}</h3>
                      <p className="text-3xl font-extrabold mb-4">
                        ${plan.unit_amount ? (plan.unit_amount / 100).toFixed(2) : ""}
                        <span className="text-sm font-normal">
                          /{plan.recurring?.interval || ""}
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
                        onClick={() => onClick(plan.id)}
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
