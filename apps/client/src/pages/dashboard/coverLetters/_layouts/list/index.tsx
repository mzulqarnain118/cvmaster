import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useResumes } from "@/client/services/resume";

import { BaseListItem } from "./_components/base-item";
import { CreateCoverLetterListItem } from "./_components/create-item";
import { ImportCoverLetterListItem } from "./_components/import-item";
import { CoverLetterListItem } from "./_components/cover-letter-item";

export const ListView = () => {
  const { resumes, loading } = useResumes();

  const data = loading ? [] : resumes?.filter((item) => item.type === "coverLetter");

  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateCoverLetterListItem />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      >
        <ImportCoverLetterListItem />
      </motion.div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {data && (
        <AnimatePresence>
          {data
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <CoverLetterListItem resume={resume} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
