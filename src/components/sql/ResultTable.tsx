import { motion } from "framer-motion";
import type { QueryResult } from "@/lib/sqlEngine";

interface ResultTableProps {
  result: QueryResult;
  isCorrect?: boolean;
  label?: string;
}

export default function ResultTable({ result, isCorrect, label }: ResultTableProps) {
  if (result.columns.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic p-4 text-center">
        No results returned.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border overflow-hidden ${
        isCorrect === true
          ? "border-success animate-pulse-success"
          : isCorrect === false
          ? "border-destructive animate-pulse-error"
          : "border-border"
      }`}
    >
      {label && (
        <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
          isCorrect === true
            ? "bg-success/10 text-success"
            : isCorrect === false
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}>
          {label}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              {result.columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left font-mono font-semibold text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.values.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-border/50"
              >
                {row.map((val, j) => (
                  <td key={j} className="px-3 py-1.5 font-mono">
                    {val === null ? (
                      <span className="text-muted-foreground italic">NULL</span>
                    ) : (
                      String(val)
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
