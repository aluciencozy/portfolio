"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BufferTabs } from "./BufferTabs";
import { ContentPanel } from "./ContentPanel";
import { FileExplorer } from "./FileExplorer";
import { NeovimCommandLine } from "./NeovimCommandLine";
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
  onTerminalCommand: (command: string) => void;
  commandLineOpen: boolean;
  commandMessage: string;
  commandMessageTone: "default" | "error";
  onCancelCommandLine: () => void;
  onNeovimCommand: (command: string) => void;
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
  onTerminalCommand,
  commandLineOpen,
  commandMessage,
  commandMessageTone,
  onCancelCommandLine,
  onNeovimCommand,
}: WorkspaceShellProps) {
  const explorerButtonRef = useRef<HTMLButtonElement>(null);
  const explorerCloseButtonRef = useRef<HTMLButtonElement>(null);
  const explorerRef = useRef<HTMLElement>(null);
  const [mobileViewport, setMobileViewport] = useState(false);
  const explorerModalOpen = state.explorerOpen && mobileViewport;
  const wasExplorerModalOpen = useRef(explorerModalOpen);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 800px)");
    const updateViewport = () => setMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (explorerModalOpen && !wasExplorerModalOpen.current) {
      explorerCloseButtonRef.current?.focus();
    } else if (!explorerModalOpen && wasExplorerModalOpen.current) {
      if (mobileViewport) {
        explorerButtonRef.current?.focus();
      } else {
        document
          .querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
          ?.focus();
      }
    }

    wasExplorerModalOpen.current = explorerModalOpen;
  }, [explorerModalOpen, mobileViewport]);

  useEffect(() => {
    if (!explorerModalOpen) return;

    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        explorerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;

      const activeElement = document.activeElement;
      if (
        event.shiftKey &&
        (activeElement === first || !explorerRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === last || !explorerRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", containFocus);
    return () => document.removeEventListener("keydown", containFocus);
  }, [explorerModalOpen]);

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
          closeButtonRef={explorerCloseButtonRef}
          explorerRef={explorerRef}
          modal={explorerModalOpen}
        />
        <AnimatePresence>
          {state.explorerOpen && (
            <motion.button
              type="button"
              className={styles.explorerScrim}
              aria-hidden="true"
              tabIndex={-1}
              onClick={onCloseExplorer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        <section
          className={styles.editorColumn}
          aria-label="Portfolio editor"
          inert={explorerModalOpen}
        >
          <BufferTabs
            activeSection={state.activeSection}
            buffers={state.openBuffers}
            onActivate={onNavigate}
            onClose={onCloseBuffer}
            onToggleExplorer={onToggleExplorer}
            explorerOpen={state.explorerOpen}
            explorerButtonRef={explorerButtonRef}
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
                  commandHistory={state.terminalCommandHistory}
                  cwd={state.terminalCwd}
                  onSubmit={onTerminalCommand}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <NeovimCommandLine
        open={commandLineOpen}
        message={commandMessage}
        messageTone={commandMessageTone}
        onCancel={onCancelCommandLine}
        onSubmit={onNeovimCommand}
      />
      <Statusline
        activeSection={state.activeSection}
        terminalOpen={state.terminalOpen}
        onToggleTerminal={onToggleTerminal}
        inert={explorerModalOpen}
        mode={commandLineOpen ? "COMMAND" : state.terminalOpen ? "TERMINAL" : "NORMAL"}
      />
    </motion.div>
  );
}
