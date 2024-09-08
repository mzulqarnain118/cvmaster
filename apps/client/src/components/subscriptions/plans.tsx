import { Card } from "@reactive-resume/ui";
import Tilt from "react-parallax-tilt";

import { defaultTiltProps } from "@/client/constants/parallax-tilt";
import { usePlans } from "@/client/services/subscription";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@reactive-resume/utils";

import { ContextMenu, ContextMenuTrigger } from "@reactive-resume/ui";

const BaseCard = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <Tilt {...defaultTiltProps}>
    <Card
      className={cn(
        "relative flex aspect-[1/1.4142] scale-100 cursor-pointer items-center justify-center bg-secondary/50 p-0 transition-transform active:scale-95",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  </Tilt>
);

export const PlanCards = ({ onClick }: { onClick: (id: string) => void }) => {
  const { plans, loading } = usePlans();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <BaseCard className="space-y-0" onClick={() => onClick(plan.id)}>
                    <div className={"p-4 pt-12"}>
                      <h4 className="line-clamp-2 font-medium">{plan.nickname || ""}</h4>

                      <p className="line-clamp-1 text-xs opacity-75">
                        Price: {plan.unit_amount ? `${plan.unit_amount / 100}$` : ""}
                      </p>

                      <p className="line-clamp-1 text-xs opacity-75">
                        Duration:{" "}
                        {plan.recurring
                          ? `${plan.recurring.interval_count} ${plan.recurring.interval}`
                          : ""}
                      </p>
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
