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

// Keep defaults and portfolio mappings declarative so new shortcuts can be
// layered on without changing the keyboard controller.
export const neovimKeymaps: NeovimKeymap[] = [
  { keys: ["j"], action: "scroll-line-down", description: "Scroll down", source: "vim" },
  { keys: ["ArrowDown"], action: "scroll-line-down", description: "Scroll down", source: "vim" },
  { keys: ["k"], action: "scroll-line-up", description: "Scroll up", source: "vim" },
  { keys: ["ArrowUp"], action: "scroll-line-up", description: "Scroll up", source: "vim" },
  { keys: ["g", "g"], action: "document-top", description: "Go to the first line", source: "vim" },
  { keys: ["G"], action: "document-bottom", description: "Go to the last line", source: "vim" },
  { keys: ["Ctrl+d"], action: "scroll-half-down", description: "Scroll half a page down", source: "vim" },
  { keys: ["Ctrl+u"], action: "scroll-half-up", description: "Scroll half a page up", source: "vim" },
  { keys: ["g", "t"], action: "next-buffer", description: "Go to the next tab", source: "vim" },
  { keys: ["g", "T"], action: "previous-buffer", description: "Go to the previous tab", source: "vim" },
  { keys: [":"], action: "command-line", description: "Enter command-line mode", source: "vim" },
  { keys: [" ", "e"], action: "toggle-explorer", description: "Toggle file explorer", source: "portfolio" },
  { keys: [" ", "t"], action: "toggle-terminal", description: "Toggle terminal", source: "portfolio" },
];

export function normalizeNeovimKey(event: KeyboardEvent) {
  if (event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
    return `Ctrl+${event.key.toLowerCase()}`;
  }
  return event.key;
}

export function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}
