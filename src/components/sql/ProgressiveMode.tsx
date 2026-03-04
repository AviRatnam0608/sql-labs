import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { getDb, resetDb, executeQuery, compareResults, type QueryResult } from "@/lib/sqlEngine";
import { progressiveQuestions, type SQLQuestion } from "@/lib/questions";
import VisualTable from "@/components/sql/VisualTable";
import ResultTable from "@/components/sql/ResultTable";
import ConceptPanel from "@/components/sql/ConceptPanel";
import SqlEditor from "@/components/sql/SqlEditor";
import ProgressBar from "@/components/sql/ProgressBar";
import DifficultyBadge from "@/components/sql/DifficultyBadge";

export default function ProgressiveMode() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<{ match: boolean; message: string } | null>(null);
  const [userResult, setUserResult] = useState<QueryResult | null>(null);
  const [expectedResult, setExpectedResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const dbRef = useRef<any>(null);

  const question = progressiveQuestions[questionIndex];

  const setupQuestion = useCallback(async (q: SQLQuestion) => {
    resetDb();
    const db = await getDb();
    dbRef.current = db;
    db.run(q.setupSQL);
    // Pre-compute expected result
    const expRes = await executeQuery(db, q.expectedSQL);
    if (expRes.success) {
      setExpectedResult(expRes.result);
    }
  }, []);

  useEffect(() => {
    if (question) {
      setFeedback(null);
      setUserResult(null);
      setShowHints(false);
      setupQuestion(question);
    }
  }, [questionIndex, question, setupQuestion]);

  const handleRun = async (query: string) => {
    if (!dbRef.current || !expectedResult) return;
    setLoading(true);

    // Re-setup the DB fresh for each run to prevent state pollution
    resetDb();
    const db = await getDb();
    dbRef.current = db;
    db.run(question.setupSQL);

    const result = await executeQuery(db, query);
    setLoading(false);

    if (!result.success) {
      setFeedback({ match: false, message: (result as { success: false; error: string }).error });
      setUserResult(null);
      return;
    }

    setUserResult(result.result);
    const comparison = compareResults(result.result, expectedResult, question.orderMatters);
    setFeedback(comparison);

    if (comparison.match) {
      setCorrect((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (questionIndex < progressiveQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setCorrect(0);
    setFinished(false);
    setFeedback(null);
    setUserResult(null);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Challenge Complete!</h2>
          <p className="text-muted-foreground">
            You got <span className="font-bold text-success">{correct}</span> out of{" "}
            <span className="font-bold">{progressiveQuestions.length}</span> correct.
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressBar current={questionIndex + 1} total={progressiveQuestions.length} correct={correct} />

      <div className="flex items-center gap-3 flex-wrap">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
          {question.topic}
        </span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">{question.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tables + Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.tables.map((t, i) => (
              <VisualTable key={t.name} table={t} delay={i * 0.1} />
            ))}
          </div>

          <SqlEditor onRun={handleRun} disabled={loading} />

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  feedback.match
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                {feedback.match ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{feedback.message}</p>
                  {feedback.match && (
                    <button
                      onClick={handleNext}
                      className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
                    >
                      {questionIndex < progressiveQuestions.length - 1 ? (
                        <>
                          Next Question <ArrowRight className="w-3 h-3" />
                        </>
                      ) : (
                        "See Results"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {userResult && (
            <ResultTable
              result={userResult}
              isCorrect={feedback?.match}
              label="Your Result"
            />
          )}

          {feedback && !feedback.match && expectedResult && (
            <ResultTable result={expectedResult} label="Expected Result" />
          )}
        </div>

        {/* Right: Concept panel */}
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
