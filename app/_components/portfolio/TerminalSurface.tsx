"use client";

import type { FormEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Square, Terminal as TerminalIcon, X } from "lucide-react";
import { CustomScrollbar } from "./CustomScrollbar";
import type { TerminalDirectory, TerminalEntry } from "./types";
import styles from "./portfolio.module.css";

interface TerminalSurfaceProps {
  children: ReactNode;
  className?: string;
  title?: string;
  pane?: boolean;
}

export function TerminalSurface({
  children,
  className = "",
  title = "alex@portfolio: ~",
  pane = false,
}: TerminalSurfaceProps) {
  return (
    <motion.section
      layoutId="terminal-surface"
      className={`${styles.terminalSurface} ${pane ? styles.terminalPaneSurface : ""} ${className}`}
      aria-label={pane ? "Portfolio terminal" : "Startup terminal"}
      transition={{ type: "spring", stiffness: 105, damping: 22, mass: 0.9 }}
    >
      {!pane && (
        <div className={styles.terminalTitlebar}>
          <div className={styles.terminalTitle}>
            <TerminalIcon aria-hidden="true" size={14} strokeWidth={1.8} />
            <span>{title}</span>
          </div>
          <div className={styles.windowControls} aria-hidden="true">
            <span><Minus size={11} /></span>
            <span><Square size={9} /></span>
            <span className={styles.closeControl}><X size={11} /></span>
          </div>
        </div>
      )}
      {children}
    </motion.section>
  );
}

interface InteractiveTerminalProps {
  history: TerminalEntry[];
  commandHistory: string[];
  cwd: TerminalDirectory;
  onSubmit: (command: string) => void;
}

export function InteractiveTerminal({
  history,
  commandHistory,
  cwd,
  onSubmit,
}: InteractiveTerminalProps) {
  const [value, setValue] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [history, reducedMotion]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
    setValue("");
    setCursorPosition(0);
    setHistoryIndex(null);
  };

  const focusInput = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[role="scrollbar"]')) return;
    inputRef.current?.focus();
    if (target !== inputRef.current) {
      inputRef.current?.setSelectionRange(value.length, value.length);
      setCursorPosition(value.length);
    }
  };

  const recallCommand = (nextIndex: number | null) => {
    const nextValue = nextIndex === null ? "" : (commandHistory[nextIndex] ?? "");
    setHistoryIndex(nextIndex);
    setValue(nextValue);
    setCursorPosition(nextValue.length);
    window.requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(nextValue.length, nextValue.length);
    });
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && commandHistory.length) {
      event.preventDefault();
      recallCommand(historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1));
    } else if (event.key === "ArrowDown" && historyIndex !== null) {
      event.preventDefault();
      recallCommand(historyIndex >= commandHistory.length - 1 ? null : historyIndex + 1);
    }
  };

  return (
    <TerminalSurface pane>
      <div className={styles.terminalScrollArea} onClick={focusInput}>
      <div ref={scrollRef} id="portfolio-terminal-history" className={styles.terminalHistory}>
        {history.map((entry) => (
          <div
            className={`${styles.terminalEntry} ${
              entry.tone === "error"
                ? styles.terminalError
                : entry.tone === "success"
                  ? styles.terminalSuccess
                  : ""
            }`}
            key={entry.id}
          >
            {entry.command !== undefined && (
              <>
                <div className={styles.terminalPath}>{entry.cwd ?? "~/portfolio"}</div>
                <div className={styles.commandLine}>
                  <span className={styles.promptArrow}>❯</span>
                  <span>{entry.command}</span>
                </div>
              </>
            )}
            {entry.lines.map((line, index) => (
              <div key={`${entry.id}-${index}`}>{line || "\u00a0"}</div>
            ))}
          </div>
        ))}
        <div className={styles.terminalPath}>{cwd}</div>
        <form className={styles.terminalForm} onSubmit={handleSubmit}>
          <label className={styles.srOnly} htmlFor="portfolio-terminal-input">
            Terminal command
          </label>
          <span className={styles.promptArrow} aria-hidden="true">❯</span>
          <span className={styles.terminalInputShell}>
            <span className={styles.terminalInputMirror} aria-hidden="true">
              <span>{value.slice(0, cursorPosition)}</span>
              <span className={styles.terminalBlockCursor}>
                {value[cursorPosition] ?? "\u00a0"}
              </span>
              <span>{value.slice(cursorPosition + 1)}</span>
            </span>
            <input
              ref={inputRef}
              id="portfolio-terminal-input"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setCursorPosition(event.target.selectionStart ?? event.target.value.length);
              }}
              onSelect={(event) => setCursorPosition(event.currentTarget.selectionStart ?? value.length)}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </span>
        </form>
      </div>
      <CustomScrollbar
        contentKey={history.length}
        controlsId="portfolio-terminal-history"
        label="Terminal scroll position"
        scrollRef={scrollRef}
      />
      </div>
      <div className={styles.srOnly} aria-live="polite">
        {history.at(-1)?.lines.join(" ")}
      </div>
    </TerminalSurface>
  );
}
