// Example: CoverLetterDialog.tsx
import React from "react";
import { useDialog } from "@/client/stores/dialog";

const CoverLetterDialog = () => {
  const { isOpen, mode, close } = useDialog("coverLetter");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2>{mode === "create" ? "Create Cover Letter" : "Edit Cover Letter"}</h2>
        {/* Add form or content here */}
        <button onClick={close} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default CoverLetterDialog;
