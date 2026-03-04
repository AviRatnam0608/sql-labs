import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Zap, Trophy } from "lucide-react";
import { getDb, resetDb, executeQuery, compareResults, type QueryResult } from "@/lib/sqlEngine";
import { progressiveQuestions, type SQLQuestion } from "@/lib/questions";
import VisualTable from "@/components/sql/VisualTable";
import ResultTable from "@/components/sql/ResultTable";
import ConceptPanel from "@/components/sql/ConceptPanel";
import SqlEditor from "@/components/sql/SqlEditor";
import Timer from "@/components/sql/Timer";
import DifficultyBadge from "@/components/sql/DifficultyBadge";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TimeAttackMode() {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState<SQLQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<{ match: boolean; message: string } | null>(null);
  const [userResult, setUserResult] = useState<QueryResult | null>(null);
  const [expectedResult, setExpectedResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const dbRef = useRef<any>(null);

  const DURATION = 300; // 5 minutes

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(progressiveQuestions);
    // Repeat if needed for infinite feel
    const pool = [...shuffled, ...shuffleArray(progressiveQuestions), ...shuffleArray(progressiveQuestions)];
    setQuestions(pool);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setUserResult(null);
    setGameOver(false);
    setRunning(true);
  }, []);

  const question = questions[qIndex];

  const setupQuestion = useCallback(async (q: SQLQuestion) => {
    resetDb();
    const db = await getDb();
    dbRef.current = db;
    db.run(q.setupSQL);
    const expRes = await executeQuery(db, q.expectedSQL);
    if (expRes.success) setExpectedResult(expRes.result);
  }, []);

  useEffect(() => {
    if (question && running) {
      setFeedback(null);
      setUserResult(null);
      setShowHints(false);
      setupQuestion(question);
    }
  }, [qIndex, question, running, setupQuestion]);

  const handleRun = async (query: string) => {
    if (!dbRef.current || !expectedResult || !running) return;
    setLoading(true);

    resetDb();
    const db = await getDb();
    dbRef.current = db;
    db.run(question.setupSQL);

    const result = await executeQuery(db, query);
    setLoading(false);

    if (!result.success) {
      setFeedback({ match: false, message: (result as { success: false; error: string }).error });
      setUserResult(null);
      setStreak(0);
      return;
    }

    setUserResult(result.result);
    const comparison = compareResults(result.result, expectedResult, question.orderMatters);
    setFeedback(comparison);

    if (comparison.match) {
      const bonus = streak >= 3 ? 2 : 1;
      setScore((s) => s + (question.difficulty === "advanced" ? 3 * bonus : question.difficulty === "intermediate" ? 2 * bonus : 1 * bonus));
      setStreak((s) => s + 1);
      // Auto-advance after short delay
      setTimeout(() => {
        if (qIndex < questions.length - 1) {
          setQIndex((i) => i + 1);
        }
      }, 1200);
    } else {
      setStreak(0);
    }
  };

  const handleTimeUp = useCallback(() => {
    setRunning(false);
    setGameOver(true);
  }, []);

  // Start screen
  if (!running && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-destructive/15 flex items-center justify-center">
            <Zap className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Time Attack</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Solve as many SQL questions as you can in 5 minutes. Harder questions earn more points. 
            Build a streak for bonus multipliers!
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/20">
              Beginner = 1pt
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-sql-groupby/10 text-sql-groupby border border-sql-groupby/20">
              Intermediate = 2pt
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
              Advanced = 3pt
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20">
              3+ streak = 2× bonus
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-lg bg-destructive text-destructive-foreground font-bold text-sm hover:bg-destructive/90 transition-colors"
          >
            Start Challenge
          </button>
        </motion.div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Trophy className="w-16 h-16 text-sql-groupby mx-auto" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Time's Up!</h2>
          <p className="text-4xl font-bold text-primary mb-1">{score} points</p>
          <p className="text-muted-foreground text-sm">
            {qIndex} questions attempted • Best streak: {streak}
          </p>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Timer duration={DURATION} running={running} onTimeUp={handleTimeUp} />
          {streak >= 3 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full"
            >
              🔥 {streak} streak (2×)
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-foreground">{score} pts</span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">{question.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.tables.map((t, i) => (
              <VisualTable key={t.name + qIndex} table={t} delay={i * 0.05} />
            ))}
          </div>

          <SqlEditor onRun={handleRun} disabled={loading || !running} />

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={`fb-${qIndex}-${feedback.match}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium ${
                  feedback.match
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                {feedback.match ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {userResult && <ResultTable result={userResult} isCorrect={feedback?.match} label="Your Result" />}
          {feedback && !feedback.match && expectedResult && (
            <ResultTable result={expectedResult} label="Expected Result" />
          )}
        </div>

        <div>
          <ConceptPanel
            concept={question.concept}
            detail={question.conceptDetail}
            hints={question.hints}
            showHints={showHints}
            onToggleHints={() => setShowHints(!showHints)}
          />
        </div>
      </div>
    </div>
  );
}
