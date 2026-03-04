import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface SqlEditorProps {
  onRun: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SqlEditor({ onRun, disabled, placeholder }: SqlEditorProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) onRun(query.trim());
    }
    // Tab inserts spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textareaRef.current!.selectionStart;
      const end = textareaRef.current!.selectionEnd;
      const newVal = query.substring(0, start) + "  " + query.substring(end);
      setQuery(newVal);
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          SQL Editor
        </span>
        <span className="text-[10px] text-muted-foreground">Ctrl+Enter to run</span>
      </div>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || "Write your SQL query here..."}
        className="w-full bg-foreground/[0.03] text-foreground font-mono text-sm p-4 resize-none focus:outline-none min-h-[120px] placeholder:text-muted-foreground/50"
        spellCheck={false}
      />
      <div className="flex items-center justify-end px-3 py-2 border-t border-border bg-muted/30">
        <button
          onClick={() => query.trim() && onRun(query.trim())}
          disabled={disabled || !query.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-3 h-3" />
          Run Query
        </button>
      </div>
    </div>
  );
}
