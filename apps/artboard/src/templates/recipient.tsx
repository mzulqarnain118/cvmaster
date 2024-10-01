import { cn } from "@reactive-resume/utils";
import { useArtboardStore } from "../store/artboard";

export const Recipient = () => {
  const recipient = useArtboardStore((state) => state.resume.recipient);

  if (localStorage.getItem("type") !== "coverLetter") {
    return null;
  }

  return (
    <section id="recipient" className="space-y-2">
      <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
        <h4>Recipient</h4>
      </div>

      <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="size-1.5 rounded-full border border-primary" />
        <h4>Recipient</h4>
        <div className="size-1.5 rounded-full border border-primary" />
      </div>

      <main className={cn("relative space-y-2", "border-l border-primary pl-4")}>
        <div className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" />

        <div className="space-y-1">
          {recipient?.date && <div>{recipient?.date}</div>}
          {recipient?.name && <div>{recipient?.name}</div>}
          {recipient?.email && (
            <a href={`mailto:${recipient?.email}`} target="_blank" rel="noreferrer">
              {recipient?.email}
            </a>
          )}
          {recipient?.subject && <div>{recipient?.subject}</div>}
          {recipient?.greeting && <div>{recipient?.greeting}</div>}
        </div>
      </main>
    </section>
  );
};

// const Recipient = () => {
//   const recipient = useArtboardStore((state) => state.resume.recipient);

//   return (
//     <section id="recipient" className="space-y-2">
//       <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
//         <h4>Recipient</h4>
//       </div>

//       <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
//         <div className="size-1.5 rounded-full border border-primary" />
//         <h4>Recipient</h4>
//         <div className="size-1.5 rounded-full border border-primary" />
//       </div>

//       <main className={cn("relative space-y-2", "border-l border-primary pl-4")}>
//         <div className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" />

//         <div className="space-y-1">
//           {recipient?.date && <div className="break-words max-w-[200px]">{recipient?.date}</div>}
//           {recipient?.name && <div className="break-words max-w-[200px]">{recipient?.name}</div>}
//           {recipient?.email && (
//             <a
//               className="break-words max-w-[200px]"
//               href={`mailto:${recipient?.email}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               {recipient?.email}
//             </a>
//           )}
//           {recipient?.subject && (
//             <div className="break-words max-w-[200px]">{recipient?.subject}</div>
//           )}
//           {recipient?.greeting && (
//             <div className="break-words max-w-[200px]">{recipient?.greeting}</div>
//           )}
//         </div>
//       </main>
//     </section>
//   );
// };
