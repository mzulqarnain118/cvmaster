import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useUsers } from "@/client/services/user";

import { BaseListItem } from "./_components/base-item";
import { UserListItem } from "./_components/user-item";

export const ListView = () => {
  const { users, loading } = useUsers();

  return (
    <div className="grid gap-y-2">
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

      {users && (
        <AnimatePresence>
          {
            <>
              <BaseListItem
                className="group"
                name="NAME"
                email="EMAIL"
                subscription="SUBSCRIPTION"
                plan="PLAN"
                description="DESCRIPTION"
              />

              {users
                .sort((a, b) => sortByDate(a, b, "updatedAt"))
                .map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                    exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
                  >
                    <UserListItem user={user} />
                  </motion.div>
                ))}
            </>
          }
        </AnimatePresence>
      )}
    </div>
  );
};
