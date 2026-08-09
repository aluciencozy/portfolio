"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { BootSequence } from "./BootSequence";
import { isSectionId } from "./data";
import { runTerminalCommand } from "./terminal-commands";
import type { PortfolioSectionId, TerminalEntry } from "./types";
import { initialWorkspaceState, workspaceReducer } from "./workspace-state";
import { WorkspaceShell } from "./WorkspaceShell";
import styles from "./portfolio.module.css";

type ExperiencePhase = "checking" | "booting" | "morphing" | "ready";

const sessionKey = "alex-portfolio-boot-complete";

function hasCompletedBoot() {
  try {
    return window.sessionStorage.getItem(sessionKey) === "true";
  } catch {
    return false;
  }
}

function rememberCompletedBoot() {
  try {
    window.sessionStorage.setItem(sessionKey, "true");
  } catch {
    return;
  }
}

export function PortfolioExperience({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<ExperiencePhase>("checking");
  const [state, dispatch] = useReducer(workspaceReducer, initialWorkspaceState);
  const entryId = useRef(1);
  const collapseTimer = useRef<number | undefined>(undefined);
  const bootFinished = useRef(false);

  const openHashSection = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (isSectionId(hash)) {
      dispatch({ type: "navigate", section: hash });
      return;
    }

    dispatch({ type: "navigate", section: "overview" });
  }, []);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      openHashSection();
      setPhase(hasCompletedBoot() ? "ready" : "booting");
    }, 0);
    window.addEventListener("hashchange", openHashSection);

    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener("hashchange", openHashSection);
      if (collapseTimer.current) window.clearTimeout(collapseTimer.current);
    };
  }, [openHashSection]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "Backquote") {
        event.preventDefault();
        dispatch({ type: "toggle-terminal" });
      }

      if (event.key === "Escape" && state.explorerOpen) {
        dispatch({ type: "set-explorer", open: false });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.explorerOpen]);

  const navigate = useCallback((section: PortfolioSectionId) => {
    dispatch({ type: "navigate", section });
    const nextHash = `#${section}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, []);

  const closeBuffer = useCallback(
    (section: PortfolioSectionId) => {
      if (section === "overview") return;

      const nextBuffers = state.openBuffers.filter((buffer) => buffer !== section);
      const nextActive =
        state.activeSection === section
          ? (nextBuffers.at(-1) ?? "overview")
          : state.activeSection;
      dispatch({ type: "close-buffer", section });
      window.history.replaceState(null, "", `#${nextActive}`);
    },
    [state.activeSection, state.openBuffers],
  );

  const completeBoot = useCallback(() => {
    if (bootFinished.current) return;
    bootFinished.current = true;
    dispatch({ type: "set-terminal", open: true });
    setPhase("morphing");
    rememberCompletedBoot();
    collapseTimer.current = window.setTimeout(
      () => {
        dispatch({ type: "set-terminal", open: false });
        setPhase("ready");
      },
      reducedMotion ? 180 : 1150,
    );
  }, [reducedMotion]);

  const skipBoot = useCallback(() => {
    if (bootFinished.current) return;
    bootFinished.current = true;
    dispatch({ type: "set-terminal", open: false });
    setPhase("ready");
    rememberCompletedBoot();
  }, []);

  const handleTerminalCommand = useCallback(
    (command: string) => {
      const result = runTerminalCommand(command);
      if (result.type === "clear") {
        dispatch({ type: "clear-terminal" });
        return;
      }

      const entry: TerminalEntry = {
        id: entryId.current,
        command,
        lines: result.lines,
        tone: result.type === "print" ? result.tone : "success",
      };
      entryId.current += 1;
      dispatch({ type: "append-terminal", entry });

      if (result.type === "navigate") navigate(result.section);
      if (result.type === "close") {
        window.setTimeout(
          () => dispatch({ type: "set-terminal", open: false }),
          180,
        );
      }
    },
    [navigate],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.experienceRoot}>
        <div className={styles.wallpaperShade} />
        <div className={styles.ambientGlow} aria-hidden="true" />
        <AnimatePresence mode="sync" initial={false}>
          {phase === "checking" && (
            <div className={styles.fallbackStage} key="checking">
              {children}
            </div>
          )}
          {phase === "booting" && (
            <BootSequence
              key="boot"
              reducedMotion={reducedMotion}
              onComplete={completeBoot}
              onSkip={skipBoot}
            />
          )}
          {(phase === "morphing" || phase === "ready") && (
            <WorkspaceShell
              key="workspace"
              state={state}
              entering={phase === "morphing"}
              onNavigate={navigate}
              onCloseBuffer={closeBuffer}
              onToggleFolder={(section) => dispatch({ type: "toggle-folder", section })}
              onToggleExplorer={() => dispatch({ type: "toggle-explorer" })}
              onCloseExplorer={() => dispatch({ type: "set-explorer", open: false })}
              onToggleTerminal={() => dispatch({ type: "toggle-terminal" })}
              onCloseTerminal={() => dispatch({ type: "set-terminal", open: false })}
              onTerminalCommand={handleTerminalCommand}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
