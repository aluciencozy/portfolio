"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { neovimCommandHelp } from "./neovim-commands";
import {
  explorerKeymaps,
  formatShortcutKey,
  neovimKeymaps,
} from "./neovim-keymaps";
import { terminalCommandHelp } from "./terminal-commands";
import styles from "./portfolio.module.css";

interface CommandReferenceModalProps {
  onClose: () => void;
}

function KeySequence({ keys }: { keys: string[] }) {
  return (
    <span className={styles.referenceKeys}>
      {keys.map((key, index) => (
        <kbd key={`${key}-${index}`}>{formatShortcutKey(key)}</kbd>
      ))}
    </span>
  );
}

export function CommandReferenceModal({ onClose }: CommandReferenceModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", handleEscape, true);
    return () => {
      document.removeEventListener("keydown", handleEscape, true);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    const first = focusable.at(0);
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div
      className={styles.referenceBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        className={styles.referenceModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-reference-title"
        initial={{ opacity: 0, y: 10, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onKeyDown={handleKeyDown}
      >
        <header className={styles.referenceHeader}>
          <div>
            <span>HELP.txt</span>
            <h2 id="command-reference-title">Commands and shortcuts</h2>
            <p>Everything here is optional. Mouse navigation always works.</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close command reference"
          >
            <X size={16} />
          </button>
        </header>

        <div
          className={styles.referenceContent}
          tabIndex={0}
          aria-label="Scrollable command reference"
        >
          <section>
            <h3>Normal mode</h3>
            <div className={styles.referenceList}>
              {neovimKeymaps.map((mapping) => (
                <div key={`${mapping.keys.join("-")}-${mapping.action}`}>
                  <KeySequence keys={mapping.keys} />
                  <span>{mapping.description}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3>File explorer</h3>
            <div className={styles.referenceList}>
              {explorerKeymaps.map((mapping) => (
                <div key={mapping.description}>
                  <span className={styles.referenceKeys}>
                    {mapping.keys.map((key) => (
                      <kbd key={key}>{formatShortcutKey(key)}</kbd>
                    ))}
                  </span>
                  <span>{mapping.description}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3>Neovim commands</h3>
            <div className={styles.referenceList}>
              {neovimCommandHelp.map((item) => (
                <div key={item.command}>
                  <code>{item.command}</code>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3>Terminal commands</h3>
            <div className={styles.referenceList}>
              {terminalCommandHelp.map((item) => (
                <div key={item.command}>
                  <code>{item.command}</code>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.section>
    </motion.div>
  );
}
