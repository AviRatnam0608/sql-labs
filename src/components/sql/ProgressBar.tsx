import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
}

export default function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const pct = (current / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question <span className="font-bold text-foreground">{current}</span> of {total}
        </span>
        <span>
          <span className="font-bold text-success">{correct}</span> correct
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
