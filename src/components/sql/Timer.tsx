import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  duration: number; // seconds
  running: boolean;
  onTimeUp: () => void;
}

export default function Timer({ duration, running, onTimeUp }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            onTimeUp();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onTimeUp]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / duration) * 100;

  const colorClass =
    pct > 50 ? "text-success" : pct > 20 ? "text-sql-groupby" : "text-destructive";

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-4 h-4 ${colorClass}`} />
      <span className={`font-mono font-bold text-lg ${colorClass}`}>
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            pct > 50 ? "bg-success" : pct > 20 ? "bg-sql-groupby" : "bg-destructive"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
