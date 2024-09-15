import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { usePlans } from "@/client/services/plan";

import { BaseListItem } from "./_components/base-item";
import { CreatePlanListItem } from "./_components/create-item";
import { PlanListItem } from "./_components/plan-item";

export const ListView = () => {
  const { plans, loading } = usePlans();

  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreatePlanListItem />
      </motion.div>

      {loading &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {plans && (
        <AnimatePresence>
          {plans
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <PlanListItem plan={plan} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
