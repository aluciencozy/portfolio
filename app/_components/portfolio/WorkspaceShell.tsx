"use client";

import { AnimatePresence, motion } from "motion/react";
import { BufferTabs } from "./BufferTabs";
import { ContentPanel } from "./ContentPanel";
import { FileExplorer } from "./FileExplorer";
import { Statusline } from "./Statusline";
import { InteractiveTerminal } from "./TerminalSurface";
import type { PortfolioSectionId, WorkspaceState } from "./types";
import styles from "./portfolio.module.css";

interface WorkspaceShellProps {
  state: WorkspaceState;
  entering: boolean;
  onNavigate: (section: PortfolioSectionId) => void;
  onCloseBuffer: (section: PortfolioSectionId) => void;
  onToggleFolder: (section: PortfolioSectionId) => void;
  onToggleExplorer: () => void;
  onCloseExplorer: () => void;
  onToggleTerminal: () => void;
  onCloseTerminal: () => void;
  onTerminalCommand: (command: string) => void;
}

export function WorkspaceShell({
  state,
  entering,
  onNavigate,
  onCloseBuffer,
  onToggleFolder,
  onToggleExplorer,
  onCloseExplorer,
  onToggleTerminal,
  onCloseTerminal,
  onTerminalCommand,
}: WorkspaceShellProps) {
  return (
    <motion.div
      className={styles.workspace}
      initial={{ opacity: 0, scale: entering ? 0.992 : 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.workspaceContent}>
        <FileExplorer
          activeSection={state.activeSection}
          expandedFolders={state.expandedFolders}
          open={state.explorerOpen}
          onNavigate={onNavigate}
          onToggleFolder={onToggleFolder}
          onClose={onCloseExplorer}
        />
        <AnimatePresence>
          {state.explorerOpen && (
            <motion.button
              type="button"
              className={styles.explorerScrim}
              aria-label="Close file explorer"
              onClick={onCloseExplorer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        <section className={styles.editorColumn} aria-label="Portfolio editor">
          <BufferTabs
            activeSection={state.activeSection}
            buffers={state.openBuffers}
            onActivate={onNavigate}
            onClose={onCloseBuffer}
            onToggleExplorer={onToggleExplorer}
          />
          <ContentPanel
            activeSection={state.activeSection}
            onNavigate={onNavigate}
          />
          <AnimatePresence initial={false}>
            {state.terminalOpen && (
              <motion.div
                className={styles.terminalPaneWrap}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "clamp(190px, 29vh, 290px)", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <InteractiveTerminal
                  history={state.terminalHistory}
                  onSubmit={onTerminalCommand}
                  onClose={onCloseTerminal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <Statusline
        activeSection={state.activeSection}
        terminalOpen={state.terminalOpen}
        onToggleTerminal={onToggleTerminal}
      />
    </motion.div>
  );
}

