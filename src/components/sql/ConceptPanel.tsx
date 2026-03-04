import { motion } from "framer-motion";
import { BookOpen, Lightbulb } from "lucide-react";

interface ConceptPanelProps {
  concept: string;
  detail: string;
  hints: string[];
  showHints: boolean;
  onToggleHints: () => void;
}

export default function ConceptPanel({ concept, detail, hints, showHints, onToggleHints }: ConceptPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-3"
    >
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-primary">{concept}</span>
        </div>
        <p className="text-xs text-foreground/70 leading-relaxed">{detail}</p>
      </div>

      <button
        onClick={onToggleHints}
        className="flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showHints ? "Hide hints" : "Show hints"}
      </button>

      {showHints && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-1.5"
        >
          {hints.map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-xs bg-accent/10 text-accent border border-accent/20 rounded-md px-3 py-2"
            >
              💡 {hint}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
