import { useState } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "execution-order",
    title: "SQL Execution Order",
    subtitle: "What you write vs what the engine actually executes.",
  },
  {
    id: "joins",
    title: "JOINs Visualized",
    subtitle: "How rows match (or don't) across tables.",
  },
  {
    id: "groupby",
    title: "GROUP BY + HAVING",
    subtitle: "How rows collapse into summary groups.",
  },
  {
    id: "where-having",
    title: "WHERE vs HAVING",
    subtitle: "The classic SQL interview trap.",
  },
  {
    id: "count-trap",
    title: "COUNT(*) Trap",
    subtitle: "Why LEFT JOIN + COUNT(*) often lies.",
  },
] as const;

const executionSteps = [
  { step: 1, cmd: "FROM / JOIN", desc: "Read tables and create the working set", color: "bg-sql-from text-primary-foreground" },
  { step: 2, cmd: "WHERE", desc: "Filter individual rows", color: "bg-sql-where text-secondary-foreground" },
  { step: 3, cmd: "GROUP BY", desc: "Collapse rows into groups", color: "bg-sql-groupby text-foreground" },
  { step: 4, cmd: "HAVING", desc: "Filter groups (aggregate-aware)", color: "bg-sql-having text-primary-foreground" },
  { step: 5, cmd: "SELECT", desc: "Choose output columns", color: "bg-sql-select text-accent-foreground" },
  { step: 6, cmd: "ORDER BY", desc: "Sort final rows", color: "bg-sql-orderby text-destructive-foreground" },
  { step: 7, cmd: "LIMIT", desc: "Return first N rows", color: "bg-muted text-muted-foreground" },
];

function JoinVisualizer() {
  const [joinType, setJoinType] = useState<"inner" | "left">("inner");

  const joinData = {
    inner: {
      note: "Only rows with matches in both tables survive.",
      left: [
        { id: 1, name: "Alice", matched: true },
        { id: 2, name: "Bob", matched: true },
        { id: 3, name: "Carol", matched: false },
      ],
      right: [
        { scientist_id: 1, exp: "EXP-001", matched: true },
        { scientist_id: 2, exp: "EXP-002", matched: true },
        { scientist_id: 9, exp: "EXP-003", matched: false },
      ],
      result: [
        ["Alice", "EXP-001"],
        ["Bob", "EXP-002"],
      ],
      sql: "SELECT s.name, e.exp FROM scientists s INNER JOIN experiments e ON s.id = e.scientist_id;",
    },
    left: {
      note: "All left rows remain; unmatched right values become NULL.",
      left: [
        { id: 1, name: "Alice", matched: true },
        { id: 2, name: "Bob", matched: true },
        { id: 3, name: "Carol", matched: true },
      ],
      right: [
        { scientist_id: 1, exp: "EXP-001", matched: true },
        { scientist_id: 2, exp: "EXP-002", matched: true },
        { scientist_id: 9, exp: "EXP-003", matched: false },
      ],
      result: [
        ["Alice", "EXP-001"],
        ["Bob", "EXP-002"],
        ["Carol", "NULL"],
      ],
      sql: "SELECT s.name, e.exp FROM scientists s LEFT JOIN experiments e ON s.id = e.scientist_id;",
    },
  } as const;

  const j = joinData[joinType];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setJoinType("inner")}
          className={`px-3 py-1.5 text-xs rounded-lg border ${joinType === "inner" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}
        >
          INNER JOIN
        </button>
        <button
          onClick={() => setJoinType("left")}
          className={`px-3 py-1.5 text-xs rounded-lg border ${joinType === "left" ? "bg-secondary text-secondary-foreground border-secondary" : "bg-card text-muted-foreground border-border"}`}
        >
          LEFT JOIN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="rounded-lg border border-primary/20 overflow-hidden">
          <div className="px-2 py-1 bg-primary/10 text-primary font-bold">scientists (left)</div>
          <div className="p-2 space-y-1">
            {j.left.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded ${r.matched ? "data-row-blue" : "bg-muted text-muted-foreground"}`}>
                {r.id} | {r.name}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-secondary/20 overflow-hidden">
          <div className="px-2 py-1 bg-secondary/10 text-secondary font-bold">experiments (right)</div>
          <div className="p-2 space-y-1">
            {j.right.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded ${r.matched ? "data-row-green" : "bg-muted text-muted-foreground"}`}>
                {r.scientist_id} | {r.exp}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-accent/20 overflow-hidden">
          <div className="px-2 py-1 bg-accent/10 text-accent font-bold">result</div>
          <div className="p-2 space-y-1">
            {j.result.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded ${r[1] === "NULL" ? "data-row-null" : "data-row-purple"}`}>
                {r[0]} | {r[1]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="code-block">{j.sql}</div>
      <div className="text-xs text-muted-foreground">{j.note}</div>
    </div>
  );
}

function GroupByVisual() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-2 py-1 bg-muted text-muted-foreground font-bold">Raw rows</div>
          <div className="p-2 space-y-1">
            <div className="data-row-blue px-2 py-1 rounded">EXP-1 | temp | 150</div>
            <div className="data-row-blue px-2 py-1 rounded">EXP-1 | pressure | 2.5</div>
            <div className="data-row-green px-2 py-1 rounded">EXP-2 | temp | 170</div>
            <div className="data-row-green px-2 py-1 rounded">EXP-2 | pressure | 3.1</div>
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-2 py-1 bg-sql-groupby/15 text-sql-groupby font-bold">After GROUP BY experiment</div>
          <div className="p-2 space-y-1">
            <div className="data-row-blue px-2 py-1 rounded">EXP-1 | COUNT=2 | AVG=76.25</div>
            <div className="data-row-green px-2 py-1 rounded">EXP-2 | COUNT=2 | AVG=86.55</div>
          </div>
        </div>
      </div>

      <div className="code-block">{`SELECT experiment, COUNT(*) AS n, AVG(value) AS avg_value
FROM data_points
GROUP BY experiment
HAVING COUNT(*) > 1;`}</div>
    </div>
  );
}

function WhereHavingVisual() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-3">
        <div className="font-bold text-secondary mb-1">WHERE</div>
        <p className="text-foreground/80 mb-2">Filters rows before grouping. Cannot use aggregates.</p>
        <div className="code-block">WHERE status = 'active'</div>
      </div>
      <div className="rounded-lg border border-sql-having/30 bg-sql-having/10 p-3">
        <div className="font-bold text-sql-having mb-1">HAVING</div>
        <p className="text-foreground/80 mb-2">Filters groups after grouping. Can use COUNT/AVG/SUM.</p>
        <div className="code-block">HAVING COUNT(*) &gt; 5</div>
      </div>
    </div>
  );
}

function CountTrapVisual() {
  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <div className="font-bold text-destructive mb-1">COUNT(*)</div>
          <p>Counts all rows, even LEFT JOIN unmatched rows.</p>
          <p className="font-semibold mt-1">Can produce wrong 1 instead of 0.</p>
        </div>
        <div className="rounded-lg border border-success/30 bg-success/10 p-3">
          <div className="font-bold text-success mb-1">COUNT(right.id)</div>
          <p>Counts only non-NULL right side matches.</p>
          <p className="font-semibold mt-1">Correctly returns 0 for no matches.</p>
        </div>
      </div>
      <div className="code-block">{`SELECT s.name, COUNT(e.id) AS experiment_count
FROM scientists s
LEFT JOIN experiments e ON s.id = e.scientist_id
GROUP BY s.name;`}</div>
    </div>
  );
}

export default function VisualGuideMode() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("execution-order");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">SQL Visual Guide</h2>
        <p className="text-sm text-muted-foreground">Concepts + examples to understand what your query is doing.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActive(section.id)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${active === section.id ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}
          >
            {section.title}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5 space-y-4"
      >
        <div>
          <h3 className="font-bold">{sections.find((s) => s.id === active)?.title}</h3>
          <p className="text-xs text-muted-foreground">{sections.find((s) => s.id === active)?.subtitle}</p>
        </div>

        {active === "execution-order" && (
          <div className="space-y-2">
            {executionSteps.map((step) => (
              <div key={step.step} className="flex items-center gap-3 text-sm">
                <span className={`w-7 h-7 rounded-full grid place-items-center font-bold text-xs ${step.color}`}>{step.step}</span>
                <span className="font-mono font-semibold">{step.cmd}</span>
                <span className="text-muted-foreground">— {step.desc}</span>
              </div>
            ))}
            <div className="rounded-lg border border-sql-groupby/30 bg-sql-groupby/10 p-3 text-xs">
              Tip: WHERE filters rows before grouping; HAVING filters groups after grouping.
            </div>
          </div>
        )}

        {active === "joins" && <JoinVisualizer />}
        {active === "groupby" && <GroupByVisual />}
        {active === "where-having" && <WhereHavingVisual />}
        {active === "count-trap" && <CountTrapVisual />}
      </motion.div>
    </div>
  );
}
