import type { TerminalCommandResult } from "./types";

const helpLines = [
  "Available commands:",
  "  help        show this command list",
  "  ls          list portfolio files",
  "  whoami      print a short introduction",
  "  projects    open the projects buffer",
  "  experience  open the experience buffer",
  "  skills      open the skills buffer",
  "  clear       clear terminal history",
  "  exit        close the terminal split",
];

export function runTerminalCommand(rawCommand: string): TerminalCommandResult {
  const command = rawCommand.trim().toLowerCase();

  if (!command) {
    return { type: "print", lines: [] };
  }

  switch (command) {
    case "help":
      return { type: "print", lines: helpLines };
    case "ls":
      return {
        type: "print",
        lines: [
          "README.md  about.md  experience/  projects/  skills.json  contact.md",
        ],
      };
    case "whoami":
      return {
        type: "print",
        tone: "success",
        lines: [
          "Alex Cosentino - Software Engineer",
          "I build thoughtful, reliable software with a sharp eye for developer experience.",
        ],
      };
    case "projects":
      return {
        type: "navigate",
        section: "projects",
        lines: ["Opening projects/"],
      };
    case "experience":
      return {
        type: "navigate",
        section: "experience",
        lines: ["Opening experience/"],
      };
    case "skills":
      return {
        type: "navigate",
        section: "skills",
        lines: ["Opening skills.json"],
      };
    case "clear":
      return { type: "clear" };
    case "exit":
      return { type: "close", lines: ["Closing terminal split."] };
    case "nvim .":
      return {
        type: "print",
        lines: ["portfolio workspace is already open"],
      };
    default:
      return {
        type: "print",
        tone: "error",
        lines: [`zsh: command not found: ${rawCommand.trim()}`, "Type 'help' to get oriented."],
      };
  }
}

