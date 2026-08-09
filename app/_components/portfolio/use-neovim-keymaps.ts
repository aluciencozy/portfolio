"use client";

import { useEffect, useRef } from "react";
import {
  isEditableTarget,
  neovimKeymaps,
  normalizeNeovimKey,
  type NeovimAction,
} from "./neovim-keymaps";

interface UseNeovimKeymapsOptions {
  enabled: boolean;
  onAction: (action: NeovimAction) => void;
}

const sequenceTimeout = 850;

export function useNeovimKeymaps({ enabled, onAction }: UseNeovimKeymapsOptions) {
  const sequence = useRef<string[]>([]);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const resetSequence = () => {
      sequence.current = [];
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target) || event.metaKey || event.altKey) return;
      const key = normalizeNeovimKey(event);
      if (!key) return;
      let candidate = [...sequence.current, key];
      let matches = neovimKeymaps.filter((mapping) =>
        candidate.every((part, index) => mapping.keys[index] === part),
      );

      if (!matches.length) {
        candidate = [key];
        matches = neovimKeymaps.filter((mapping) => mapping.keys[0] === key);
      }
      if (!matches.length) {
        resetSequence();
        return;
      }

      event.preventDefault();
      sequence.current = candidate;
      const exact = matches.find((mapping) => mapping.keys.length === candidate.length);
      const hasLongerMatch = matches.some((mapping) => mapping.keys.length > candidate.length);
      if (exact && !hasLongerMatch) {
        resetSequence();
        onAction(exact.action);
        return;
      }

      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(resetSequence, sequenceTimeout);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      resetSequence();
    };
  }, [enabled, onAction]);
}
