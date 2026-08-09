"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { BootSequence } from "./BootSequence";
import { isSectionId } from "./data";
import { runNeovimCommand } from "./neovim-commands";
import type { NeovimAction } from "./neovim-keymaps";
import { runTerminalCommand } from "./terminal-commands";
import { useNeovimKeymaps } from "./use-neovim-keymaps";
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

export function PortfolioExperience() {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<ExperiencePhase>("checking");
  const [state, dispatch] = useReducer(workspaceReducer, initialWorkspaceState);
  const [commandLineOpen, setCommandLineOpen] = useState(false);
  const [commandMessage, setCommandMessage] = useState("");
  const [commandMessageTone, setCommandMessageTone] = useState<"default" | "error">("default");
  const [explorerFocusRequest, setExplorerFocusRequest] = useState(0);
  const entryId = useRef(1);
  const collapseTimer = useRef<number | undefined>(undefined);
  const bootFinished = useRef(false);
  const messageTimer = useRef<number | undefined>(undefined);

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
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
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

  const cycleBuffer = useCallback(
    (direction: 1 | -1) => {
      const currentIndex = state.openBuffers.indexOf(state.activeSection);
      const nextIndex =
        (currentIndex + direction + state.openBuffers.length) % state.openBuffers.length;
      navigate(state.openBuffers[nextIndex]);
    },
    [navigate, state.activeSection, state.openBuffers],
  );

  const showCommandMessage = useCallback((message: string, tone: "default" | "error" = "default") => {
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    setCommandMessage(message);
    setCommandMessageTone(tone);
    if (message) {
      messageTimer.current = window.setTimeout(() => setCommandMessage(""), 4200);
    }
  }, []);

  const focusExplorer = useCallback(() => {
    dispatch({ type: "set-explorer", open: true });
    setExplorerFocusRequest((request) => request + 1);
  }, []);

  const handleNeovimAction = useCallback(
    (action: NeovimAction) => {
      const content = document.getElementById("portfolio-scroll-content");
      const scroll = (top: number) => content?.scrollBy({ top, behavior: reducedMotion ? "auto" : "smooth" });

      switch (action) {
        case "command-line":
          setCommandMessage("");
          setCommandLineOpen(true);
          break;
        case "document-top":
          content?.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
          break;
        case "document-bottom":
          content?.scrollTo({ top: content.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
          break;
        case "scroll-line-down":
          scroll(52);
          break;
        case "scroll-line-up":
          scroll(-52);
          break;
        case "scroll-half-down":
          scroll((content?.clientHeight ?? 0) / 2);
          break;
        case "scroll-half-up":
          scroll(-(content?.clientHeight ?? 0) / 2);
          break;
        case "next-buffer":
          cycleBuffer(1);
          break;
        case "previous-buffer":
          cycleBuffer(-1);
          break;
        case "toggle-explorer":
          focusExplorer();
          break;
        case "toggle-terminal":
          dispatch({ type: "toggle-terminal" });
          break;
      }
    },
    [cycleBuffer, focusExplorer, reducedMotion],
  );

  useNeovimKeymaps({
    enabled: phase === "ready" && !commandLineOpen,
    onAction: handleNeovimAction,
  });

  const handleNeovimCommand = useCallback(
    (command: string) => {
      const result = runNeovimCommand(command);
      setCommandLineOpen(false);

      switch (result.type) {
        case "navigate":
          navigate(result.section);
          showCommandMessage(`"${result.section}" opened`);
          break;
        case "close-buffer":
          if (state.activeSection === "overview") {
            showCommandMessage("Cannot close README.md - this buffer is pinned", "error");
          } else {
            closeBuffer(state.activeSection);
          }
          break;
        case "next-buffer":
          cycleBuffer(1);
          break;
        case "previous-buffer":
          cycleBuffer(-1);
          break;
        case "toggle-terminal":
          dispatch({ type: "set-terminal", open: true });
          break;
        case "toggle-explorer":
          focusExplorer();
          break;
        case "message":
          showCommandMessage(result.message, result.tone);
          break;
      }
    },
    [closeBuffer, cycleBuffer, focusExplorer, navigate, showCommandMessage, state.activeSection],
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
      if (command.trim()) {
        dispatch({ type: "record-terminal-command", command });
      }
      const result = runTerminalCommand(command, state.terminalCwd);
      if (result.type === "clear") {
        dispatch({ type: "clear-terminal" });
        return;
      }

      const entry: TerminalEntry = {
        id: entryId.current,
        command,
        cwd: state.terminalCwd,
        lines: result.lines,
        tone: result.type === "print" ? result.tone : "success",
      };
      entryId.current += 1;
      dispatch({ type: "append-terminal", entry });

      if ("cwd" in result && result.cwd) {
        dispatch({ type: "set-terminal-cwd", cwd: result.cwd });
      }
      if (result.type === "navigate") navigate(result.section);
      if (result.type === "print" && result.href) {
        window.open(result.href, "_blank", "noopener,noreferrer");
      }
      if (result.type === "close") {
        window.setTimeout(
          () => dispatch({ type: "set-terminal", open: false }),
          180,
        );
      }
    },
    [navigate, state.terminalCwd],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.experienceRoot}>
        <div className={styles.wallpaperShade} />
        <div className={styles.ambientGlow} aria-hidden="true" />
        <AnimatePresence mode="sync" initial={false}>
          {phase === "checking" && (
            <div className={styles.loadingStage} key="checking" aria-hidden="true">
              <div className={styles.loadingWindow} />
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
              onToggleExplorer={() => {
                if (state.explorerOpen) dispatch({ type: "set-explorer", open: false });
                else focusExplorer();
              }}
              onCloseExplorer={() => dispatch({ type: "set-explorer", open: false })}
              onToggleTerminal={() => dispatch({ type: "toggle-terminal" })}
              onTerminalCommand={handleTerminalCommand}
              commandLineOpen={commandLineOpen}
              commandMessage={commandMessage}
              commandMessageTone={commandMessageTone}
              onCancelCommandLine={() => setCommandLineOpen(false)}
              onNeovimCommand={handleNeovimCommand}
              explorerFocusRequest={explorerFocusRequest}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
