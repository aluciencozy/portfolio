"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

interface NeovimCommandLineProps {
  message: string;
  messageTone: "default" | "error";
  open: boolean;
  onCancel: () => void;
  onSubmit: (command: string) => void;
}

export function NeovimCommandLine({
  message,
  messageTone,
  open,
  onCancel,
  onSubmit,
}: NeovimCommandLineProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  if (!open && !message) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue("");
    onSubmit(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    setValue("");
    onCancel();
  };

  return (
    <div
      className={`${styles.neovimCommandBar} ${messageTone === "error" ? styles.neovimCommandError : ""}`}
      aria-live="polite"
    >
      {open ? (
        <form onSubmit={handleSubmit}>
          <span aria-hidden="true">:</span>
          <label className={styles.srOnly} htmlFor="neovim-command-input">
            Neovim command
          </label>
          <input
            ref={inputRef}
            id="neovim-command-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      ) : (
        <span>{message}</span>
      )}
    </div>
  );
}
