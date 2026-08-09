export type PortfolioSectionId =
  | "overview"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

export type SectionKind = "markdown" | "folder" | "json";

export type AccentColor =
  | "blue"
  | "green"
  | "lavender"
  | "mauve"
  | "peach"
  | "pink"
  | "teal"
  | "yellow";

export interface PortfolioSection {
  id: PortfolioSectionId;
  label: string;
  fileName: string;
  description: string;
  kind: SectionKind;
  accent: AccentColor;
  children?: Array<{
    label: string;
    fileName: string;
  }>;
}

export interface PortfolioProject {
  title: string;
  description: string;
  tags: string[];
  status: string;
  accent: AccentColor;
  href?: string;
  liveHref?: string;
  image?: string;
  imageFit?: "cover" | "contain";
  highlights: string[];
}

export interface PortfolioLink {
  label: string;
  href?: string;
  type: "github" | "linkedin" | "resume" | "email";
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface TerminalEntry {
  id: number;
  command?: string;
  cwd?: TerminalDirectory;
  lines: string[];
  tone?: "default" | "error" | "success";
}

export type TerminalDirectory =
  | "~/portfolio"
  | "~/portfolio/experience"
  | "~/portfolio/projects";

export type TerminalCommandResult =
  | {
      type: "print";
      lines: string[];
      tone?: TerminalEntry["tone"];
      cwd?: TerminalDirectory;
      href?: string;
    }
  | {
      type: "navigate";
      section: PortfolioSectionId;
      lines: string[];
      cwd?: TerminalDirectory;
    }
  | { type: "clear" }
  | { type: "close"; lines: string[] };

export interface WorkspaceState {
  activeSection: PortfolioSectionId;
  openBuffers: PortfolioSectionId[];
  expandedFolders: PortfolioSectionId[];
  explorerOpen: boolean;
  terminalOpen: boolean;
  terminalCwd: TerminalDirectory;
  terminalCommandHistory: string[];
  terminalHistory: TerminalEntry[];
}

export type WorkspaceAction =
  | { type: "navigate"; section: PortfolioSectionId }
  | { type: "close-buffer"; section: PortfolioSectionId }
  | { type: "toggle-folder"; section: PortfolioSectionId }
  | { type: "toggle-explorer" }
  | { type: "set-explorer"; open: boolean }
  | { type: "toggle-terminal" }
  | { type: "set-terminal"; open: boolean }
  | { type: "set-terminal-cwd"; cwd: TerminalDirectory }
  | { type: "record-terminal-command"; command: string }
  | { type: "append-terminal"; entry: TerminalEntry }
  | { type: "clear-terminal" };
