interface DifficultyBadgeProps {
  difficulty: "beginner" | "intermediate" | "advanced";
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = {
    beginner: "bg-success/15 text-success border-success/30",
    intermediate: "bg-sql-groupby/15 text-sql-groupby border-sql-groupby/30",
    advanced: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}
