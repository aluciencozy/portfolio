"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Square, Terminal as TerminalIcon, X } from "lucide-react";
import type { TerminalEntry } from "./types";
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
      {children}
    </motion.section>
  );
}

interface InteractiveTerminalProps {
  history: TerminalEntry[];
  onSubmit: (command: string) => void;
  onClose: () => void;
}

export function InteractiveTerminal({
  history,
  onSubmit,
  onClose,
}: InteractiveTerminalProps) {
  const [value, setValue] = useState("");
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
  };

  return (
    <TerminalSurface pane title="zsh · ~/portfolio">
      <button
        type="button"
        className={styles.terminalCloseButton}
        onClick={onClose}
        aria-label="Close terminal"
      >
        <X size={14} />
      </button>
      <div ref={scrollRef} className={styles.terminalHistory}>
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
              <div className={styles.commandLine}>
                <span className={styles.promptArrow}>❯</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.lines.map((line, index) => (
              <div key={`${entry.id}-${index}`}>{line || "\u00a0"}</div>
            ))}
          </div>
        ))}
        <form className={styles.terminalForm} onSubmit={handleSubmit}>
          <label className={styles.srOnly} htmlFor="portfolio-terminal-input">
            Terminal command
          </label>
          <span className={styles.promptArrow} aria-hidden="true">❯</span>
          <input
            ref={inputRef}
            id="portfolio-terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>
      <div className={styles.srOnly} aria-live="polite">
        {history.at(-1)?.lines.join(" ")}
      </div>
    </TerminalSurface>
  );
}
