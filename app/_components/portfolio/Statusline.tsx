"use client";

import { CircleHelp, GitBranch, PanelBottom, Terminal } from "lucide-react";
import { sectionById } from "./data";
import type { PortfolioSectionId } from "./types";
import styles from "./portfolio.module.css";

interface StatuslineProps {
  activeSection: PortfolioSectionId;
  terminalOpen: boolean;
  onToggleTerminal: () => void;
  inert?: boolean;
  mode: "NORMAL" | "COMMAND" | "TERMINAL";
  onOpenHelp: () => void;
}

export function Statusline({
  activeSection,
  terminalOpen,
  onToggleTerminal,
  inert = false,
  mode,
  onOpenHelp,
}: StatuslineProps) {
  const section = sectionById[activeSection];

  return (
    <footer className={styles.statusline} inert={inert}>
      <div className={styles.statusLeft}>
        <span className={styles.modeBadge} data-mode={mode}>{mode}</span>
        <span className={styles.statusFile}>{section.fileName}</span>
        <span className={styles.gitStatus}>
          <GitBranch size={13} aria-hidden="true" />
          main
        </span>
      </div>
      <div className={styles.statusRight}>
        <span className={styles.statusEncoding}>UTF-8</span>
        <button
          type="button"
          className={styles.helpButton}
          onClick={onOpenHelp}
          aria-label="Open commands and shortcuts"
          title="Commands and shortcuts"
        >
          <CircleHelp size={14} />
        </button>
        <button
          type="button"
          className={terminalOpen ? styles.statusButtonActive : ""}
          onClick={onToggleTerminal}
          aria-pressed={terminalOpen}
          title="Toggle terminal (Ctrl + `)"
        >
          {terminalOpen ? <PanelBottom size={14} /> : <Terminal size={14} />}
          <span>Terminal</span>
          <kbd>Ctrl `</kbd>
        </button>
        <span className={styles.statusPosition}>1:1</span>
      </div>
    </footer>
  );
}
