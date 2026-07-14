import { X } from "lucide-react";
import { motion } from "framer-motion";
import { MCQuiz, type MCQQuestion } from "./MCQuiz";

export function MCQuizModal({
  title,
  questions,
  loading,
  onClose,
}: {
  title: string;
  questions: MCQQuestion[];
  loading?: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-background rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border shrink-0" dir="rtl">
          <h2 className="font-black text-foreground">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">جاري تحضير الأسئلة...</p>
            </div>
          ) : (
            <MCQuiz questions={questions} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
