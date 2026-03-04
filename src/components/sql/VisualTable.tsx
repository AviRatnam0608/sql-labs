import { motion } from "framer-motion";
import type { TableVisual } from "@/lib/questions";

const colorMap = {
  blue: {
    header: "bg-primary/10 text-primary",
    row: "data-row-blue",
    border: "border-primary/20",
    badge: "bg-primary text-primary-foreground",
  },
  green: {
    header: "bg-secondary/10 text-secondary",
    row: "data-row-green",
    border: "border-secondary/20",
    badge: "bg-secondary text-secondary-foreground",
  },
  purple: {
    header: "bg-accent/10 text-accent",
    row: "data-row-purple",
    border: "border-accent/20",
    badge: "bg-accent text-accent-foreground",
  },
  orange: {
    header: "bg-sql-having/10 text-sql-having",
    row: "data-row-orange",
    border: "border-sql-having/20",
    badge: "bg-sql-having text-primary-foreground",
  },
};

interface VisualTableProps {
  table: TableVisual;
  highlightRows?: number[];
  dimRows?: number[];
  delay?: number;
}

export default function VisualTable({ table, highlightRows, dimRows, delay = 0 }: VisualTableProps) {
  const colors = colorMap[table.colorGroup];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`rounded-lg border ${colors.border} overflow-hidden`}
    >
      <div className={`px-3 py-2 ${colors.header} flex items-center gap-2`}>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
          TABLE
        </span>
        <span className="font-mono font-bold text-sm">{table.name}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50">
              {table.columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left font-mono font-semibold text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => {
              const isHighlighted = highlightRows?.includes(i);
              const isDimmed = dimRows?.includes(i);
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isDimmed ? 0.35 : 1, x: 0 }}
                  transition={{ duration: 0.2, delay: delay + i * 0.05 }}
                  className={`border-t border-border/50 ${isHighlighted ? colors.row : ""} ${
                    isDimmed ? "line-through" : ""
                  }`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
