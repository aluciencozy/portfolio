export type NeovimAction =
  | "command-line"
  | "document-bottom"
  | "document-top"
  | "next-buffer"
  | "previous-buffer"
  | "scroll-half-down"
  | "scroll-half-up"
  | "scroll-line-down"
  | "scroll-line-up"
  | "toggle-explorer"
  | "toggle-terminal";

export interface NeovimKeymap {
  keys: string[];
  action: NeovimAction;
  description: string;
  source: "vim" | "portfolio";
}

export interface ShortcutReference {
  keys: string[];
  description: string;
}

// Keep defaults and portfolio mappings declarative so new shortcuts can be
// layered on without changing the keyboard controller.
export const neovimKeymaps: NeovimKeymap[] = [
  { keys: ["j"], action: "scroll-line-down", description: "Scroll down", source: "vim" },
  { keys: ["ArrowDown"], action: "scroll-line-down", description: "Scroll down", source: "vim" },
  { keys: ["k"], action: "scroll-line-up", description: "Scroll up", source: "vim" },
  { keys: ["ArrowUp"], action: "scroll-line-up", description: "Scroll up", source: "vim" },
  { keys: ["g", "g"], action: "document-top", description: "Go to the first line", source: "vim" },
  { keys: ["Shift+g"], action: "document-bottom", description: "Go to the last line", source: "vim" },
  { keys: ["Ctrl+d"], action: "scroll-half-down", description: "Scroll half a page down", source: "vim" },
  { keys: ["Ctrl+u"], action: "scroll-half-up", description: "Scroll half a page up", source: "vim" },
  { keys: ["g", "t"], action: "next-buffer", description: "Go to the next tab", source: "vim" },
  { keys: ["g", "Shift+t"], action: "previous-buffer", description: "Go to the previous tab", source: "vim" },
  { keys: [":"], action: "command-line", description: "Enter command-line mode", source: "vim" },
  { keys: [" ", "e"], action: "toggle-explorer", description: "Focus file explorer", source: "portfolio" },
  { keys: [" ", "t"], action: "toggle-terminal", description: "Toggle terminal", source: "portfolio" },
];

export const explorerKeymaps: ShortcutReference[] = [
  { keys: ["j", "ArrowDown"], description: "Select the next entry" },
  { keys: ["k", "ArrowUp"], description: "Select the previous entry" },
  { keys: ["h", "ArrowLeft"], description: "Collapse a folder or select its parent" },
  { keys: ["l", "ArrowRight"], description: "Expand a folder" },
  { keys: ["Enter"], description: "Open the selected file" },
  { keys: ["Escape", "q"], description: "Return to the editor" },
];

export function formatShortcutKey(key: string) {
  if (key === " ") return "Space";
  return key.replace("Arrow", "");
}

export function normalizeNeovimKey(event: KeyboardEvent) {
  if (["Alt", "Control", "Meta", "Shift"].includes(event.key)) return null;
  if (event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
    return `Ctrl+${event.key.toLowerCase()}`;
  }
  if (event.shiftKey && !event.altKey && !event.metaKey && event.key.length === 1) {
    return `Shift+${event.key.toLowerCase()}`;
  }
  return event.key;
}

export function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}
