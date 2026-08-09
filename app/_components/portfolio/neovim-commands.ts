import { sectionById, sections } from "./data";
import type { PortfolioSectionId } from "./types";

export type NeovimCommandResult =
  | { type: "close-buffer" }
  | { type: "message"; message: string; tone?: "error" }
  | { type: "navigate"; section: PortfolioSectionId }
  | { type: "next-buffer" }
  | { type: "previous-buffer" }
  | { type: "toggle-explorer" }
  | { type: "toggle-terminal" };

function resolveSection(rawPath: string): PortfolioSectionId | null {
  const path = rawPath.trim().replace(/^\.\//, "").replace(/\/$/, "").toLowerCase();
  const file = path.split("/").at(-1) ?? path;

  if (["readme", "readme.md", "."].includes(file)) return "overview";

  const direct = sections.find(
    (section) =>
      section.id === file ||
      section.fileName.toLowerCase() === file ||
      section.children?.some((child) => child.fileName.toLowerCase() === file),
  );
  if (direct) return direct.id;

  if (path.startsWith("projects/") || file.endsWith(".ts")) return "projects";
  if (path.startsWith("experience/")) return "experience";
  return null;
}

export function runNeovimCommand(rawCommand: string): NeovimCommandResult {
  const commandLine = rawCommand.trim().replace(/^:/, "");
  const [rawName = "", ...args] = commandLine.split(/\s+/);
  const command = rawName.toLowerCase();

  if (!command) return { type: "message", message: "" };
  if (["q", "quit", "bd", "bdelete"].includes(command)) return { type: "close-buffer" };
  if (["bn", "bnext", "tabnext"].includes(command)) return { type: "next-buffer" };
  if (["bp", "bprevious", "bprev", "tabprevious"].includes(command)) {
    return { type: "previous-buffer" };
  }
  if (["term", "terminal"].includes(command)) return { type: "toggle-terminal" };
  if (["explore", "ex", "nvimtreetoggle"].includes(command)) return { type: "toggle-explorer" };
  if (["e", "edit"].includes(command)) {
    if (!args.length) return { type: "message", message: "E471: Argument required", tone: "error" };
    const section = resolveSection(args.join(" "));
    if (section) return { type: "navigate", section };
    return { type: "message", message: `E484: Can't open file ${args.join(" ")}`, tone: "error" };
  }
  if (["buffers", "ls"].includes(command)) {
    return {
      type: "message",
      message: sections.map((section) => sectionById[section.id].fileName).join("  "),
    };
  }
  if (["help", "h"].includes(command)) {
    return {
      type: "message",
      message: ":e {file}  :q  :bnext  :bprevious  :terminal  :Explore  :buffers",
    };
  }

  return { type: "message", message: `E492: Not an editor command: ${commandLine}`, tone: "error" };
}
