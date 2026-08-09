import type { WorkspaceAction, WorkspaceState } from "./types";

export const initialWorkspaceState: WorkspaceState = {
  activeSection: "overview",
  openBuffers: ["overview"],
  expandedFolders: ["projects"],
  explorerOpen: false,
  terminalOpen: false,
  terminalCwd: "~/portfolio",
  terminalCommandHistory: [],
  terminalHistory: [
    {
      id: 0,
      lines: ["Portfolio terminal ready. Type 'help' for available commands."],
      tone: "success",
    },
  ],
};

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "navigate":
      return {
        ...state,
        activeSection: action.section,
        openBuffers: state.openBuffers.includes(action.section)
          ? state.openBuffers
          : [...state.openBuffers, action.section],
        explorerOpen: false,
      };
    case "close-buffer": {
      if (action.section === "overview") return state;

      const nextBuffers = state.openBuffers.filter(
        (buffer) => buffer !== action.section,
      );
      const activeSection =
        state.activeSection === action.section
          ? (nextBuffers.at(-1) ?? "overview")
          : state.activeSection;

      return { ...state, openBuffers: nextBuffers, activeSection };
    }
    case "toggle-folder":
      return {
        ...state,
        expandedFolders: state.expandedFolders.includes(action.section)
          ? state.expandedFolders.filter((item) => item !== action.section)
          : [...state.expandedFolders, action.section],
      };
    case "toggle-explorer":
      return { ...state, explorerOpen: !state.explorerOpen };
    case "set-explorer":
      return { ...state, explorerOpen: action.open };
    case "toggle-terminal":
      return { ...state, terminalOpen: !state.terminalOpen };
    case "set-terminal":
      return { ...state, terminalOpen: action.open };
    case "set-terminal-cwd":
      return { ...state, terminalCwd: action.cwd };
    case "record-terminal-command":
      return {
        ...state,
        terminalCommandHistory: [...state.terminalCommandHistory, action.command],
      };
    case "append-terminal":
      return {
        ...state,
        terminalHistory: [...state.terminalHistory, action.entry],
      };
    case "clear-terminal":
      return { ...state, terminalHistory: [] };
  }
}
