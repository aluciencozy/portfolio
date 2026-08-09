import { externalLinks, projects, sectionById } from "./data";
import type {
  PortfolioSectionId,
  TerminalCommandResult,
  TerminalDirectory,
} from "./types";

const rootDirectory: TerminalDirectory = "~/portfolio";

const directorySections: Record<string, PortfolioSectionId> = {
  about: "about",
  contact: "contact",
  experience: "experience",
  projects: "projects",
  skills: "skills",
};

const rootFiles = [
  "README.md",
  "about.md",
  "experience/",
  "projects/",
  "skills.json",
  "contact.md",
];

const helpLines = [
  "Available commands:",
  "  help                 show this command list",
  "  pwd                  print the virtual working directory",
  "  ls [path]            list portfolio files",
  "  cd [path]            change directory and open its buffer",
  "  cat <file>           preview a portfolio file",
  "  about | projects     open a portfolio buffer",
  "  experience | skills open a portfolio buffer",
  "  contact              open contact.md",
  "  resume | github      open an external portfolio link",
  "  linkedin             open LinkedIn",
  "  whoami               print a short introduction",
  "  clear                clear terminal history",
  "  exit                 close the terminal split",
  "",
  "Tip: use Arrow Up and Arrow Down to recall commands.",
];

function resolveDirectory(
  rawPath: string | undefined,
  cwd: TerminalDirectory,
): TerminalDirectory | null {
  if (!rawPath || rawPath === "~" || rawPath === "/" || rawPath === "~/portfolio") {
    return rootDirectory;
  }

  const path = rawPath.replace(/\/$/, "");
  if (path === ".") return cwd;
  if (path === "..") return rootDirectory;
  if (path === "experience" || path === "./experience" || path.endsWith("/experience")) {
    return "~/portfolio/experience";
  }
  if (path === "projects" || path === "./projects" || path.endsWith("/projects")) {
    return "~/portfolio/projects";
  }

  return null;
}

function directoryListing(path: TerminalDirectory): string[] {
  if (path === "~/portfolio/experience") {
    return ["current-role.md  previous-role.md"];
  }
  if (path === "~/portfolio/projects") {
    return [sectionById.projects.children?.map((project) => project.fileName).join("  ") ?? ""];
  }
  return [rootFiles.join("  ")];
}

function resolveFileName(rawFile: string, cwd: TerminalDirectory) {
  const normalized = rawFile.replace(/^\.\//, "").toLowerCase();
  if (normalized.includes("/")) return normalized.split("/").at(-1) ?? normalized;
  if (cwd === "~/portfolio/projects" && !normalized.endsWith(".ts")) {
    return `${normalized}.ts`;
  }
  return normalized;
}

function catFile(rawFile: string, cwd: TerminalDirectory): TerminalCommandResult {
  const file = resolveFileName(rawFile, cwd);
  const staticFiles: Record<string, string[]> = {
    "readme.md": ["Alex Cosentino", "Software developer building reliable full-stack systems with product-minded detail."],
    "about.md": ["CS student at UCF and Software Developer Intern at Vesta Teleradiology.", "Terminal-first workflow, Catppuccin Mocha enthusiast."],
    "skills.json": ["{ TypeScript, React, Next.js, Node.js, Python, SQL, PostgreSQL, AWS, GCP }"],
    "contact.md": ["GitHub: github.com/aluciencozy", "LinkedIn: linkedin.com/in/alcozy", "Email: aluciencozy22@gmail.com"],
    "current-role.md": ["Software Developer Intern - Vesta Teleradiology", "Feb 2026 - Present"],
    "previous-role.md": ["Food and Beverage Attendant - Hilton", "Jun 2024 - Aug 2026"],
  };

  if (staticFiles[file]) return { type: "print", lines: staticFiles[file] };

  const projectIndex = sectionById.projects.children?.findIndex(
    (item) => item.fileName.toLowerCase() === file,
  ) ?? -1;
  const project = projects[projectIndex];
  if (project) {
    return {
      type: "print",
      lines: [project.title, project.description, `Stack: ${project.tags.join(", ")}`],
    };
  }

  return {
    type: "print",
    tone: "error",
    lines: [`cat: ${rawFile}: No such file`],
  };
}

function openSection(section: PortfolioSectionId, cwd?: TerminalDirectory): TerminalCommandResult {
  return {
    type: "navigate",
    section,
    cwd,
    lines: [`Opening ${section === "overview" ? "README.md" : section}`],
  };
}

export function runTerminalCommand(
  rawCommand: string,
  cwd: TerminalDirectory,
): TerminalCommandResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) return { type: "print", lines: [] };

  const [rawName, ...args] = trimmed.split(/\s+/);
  const command = rawName.toLowerCase();

  if (command === "help") return { type: "print", lines: helpLines };
  if (command === "pwd") return { type: "print", lines: [cwd] };
  if (command === "whoami") {
    return {
      type: "print",
      tone: "success",
      lines: [
        "Alex Cosentino - Software Developer",
        "I build thoughtful, reliable software with a sharp eye for developer experience.",
      ],
    };
  }
  if (command === "clear") return { type: "clear" };
  if (command === "exit") return { type: "close", lines: ["Closing terminal split."] };
  if (command === "nvim" && args.join(" ") === ".") {
    return { type: "print", lines: ["portfolio workspace is already open"] };
  }

  if (command === "ls") {
    const target = resolveDirectory(args[0], cwd);
    if (!target) {
      return { type: "print", tone: "error", lines: [`ls: ${args[0]}: No such directory`] };
    }
    return { type: "print", lines: directoryListing(target) };
  }

  if (command === "cd") {
    const target = resolveDirectory(args[0], cwd);
    if (!target) {
      return { type: "print", tone: "error", lines: [`cd: no such file or directory: ${args[0]}`] };
    }
    if (target === rootDirectory) return openSection("overview", target);
    return openSection(target === "~/portfolio/experience" ? "experience" : "projects", target);
  }

  if (command === "cat") {
    if (!args[0]) return { type: "print", tone: "error", lines: ["cat: missing file operand"] };
    return catFile(args.join(" "), cwd);
  }

  if (command === "open" && args[0]) {
    const section = args[0].replace(/\.(md|json|ts)$/i, "").toLowerCase();
    if (section === "readme") return openSection("overview");
    if (directorySections[section]) return openSection(directorySections[section]);
  }

  if (command === "overview" || command === "home") return openSection("overview");
  if (directorySections[command]) return openSection(directorySections[command]);

  if (["resume", "github", "linkedin"].includes(command)) {
    const link = externalLinks.find((item) => item.type === command);
    if (link?.href) {
      return { type: "print", tone: "success", href: link.href, lines: [`Opening ${link.label}...`] };
    }
  }

  return {
    type: "print",
    tone: "error",
    lines: [`zsh: command not found: ${rawName}`, "Type 'help' to get oriented."],
  };
}
