import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useResumes } from "@/client/services/resume";

import { BaseCard } from "./_components/base-card";
import { CreateCoverLetterCard } from "./_components/create-card";
import { ImportCoverLetterCard } from "./_components/import-card";
import { CoverLetterCard } from "./_components/cover-letter-card";

export const GridView = () => {
  const { resumes, loading } = useResumes();

  const data = loading ? [] : resumes?.filter((item) => item.type === "coverLetter");

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateCoverLetterCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
      >
        <ImportCoverLetterCard />
      </motion.div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
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
          {data
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <CoverLetterCard resume={resume} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
