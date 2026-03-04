import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Zap, Database, BookOpen } from "lucide-react";
import ProgressiveMode from "@/components/sql/ProgressiveMode";
import TimeAttackMode from "@/components/sql/TimeAttackMode";
import VisualGuideMode from "@/components/sql/VisualGuideMode";

type Mode = "select" | "progressive" | "timeattack" | "guide";

export default function Index() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => setMode("select")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">SQL Lab</h1>
              <p className="text-[10px] text-muted-foreground">Interactive Practice</p>
            </div>
          </button>

          {mode !== "select" && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => setMode("progressive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  mode === "progressive"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Progressive
              </button>
              <button
                onClick={() => setMode("timeattack")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  mode === "timeattack"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Time Attack
              </button>
              <button
                onClick={() => setMode("guide")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  mode === "guide"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Visual Guide
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {mode === "select" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[70vh] space-y-10"
          >
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center"
              >
                <Database className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground">SQL Lab</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Practice SQL with colorful, visual databases.
                Your queries run in a real SQL engine — no faking it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("progressive")}
                className="p-6 rounded-xl border-2 border-primary/20 bg-card hover:border-primary/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Progressive Mode</h3>
                <p className="text-xs text-muted-foreground">
                  20 questions from SELECT basics to complex JOIN+HAVING queries.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("timeattack")}
                className="p-6 rounded-xl border-2 border-destructive/20 bg-card hover:border-destructive/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Zap className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Time Attack</h3>
                <p className="text-xs text-muted-foreground">
                  Timed random SQL drills with score multipliers and streaks.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("guide")}
                className="p-6 rounded-xl border-2 border-accent/20 bg-card hover:border-accent/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Visual Guide</h3>
                <p className="text-xs text-muted-foreground">
                  Learn SQL command theory with visual examples of joins, grouping, and filtering.
                </p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === "progressive" && <ProgressiveMode />}
        {mode === "timeattack" && <TimeAttackMode />}
        {mode === "guide" && <VisualGuideMode />}
      </main>
    </div>
  );
}
