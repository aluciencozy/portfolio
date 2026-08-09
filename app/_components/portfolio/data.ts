import type {
  ExperienceEntry,
  PortfolioLink,
  PortfolioProject,
  PortfolioSection,
  PortfolioSectionId,
} from "./types";

export const sections: PortfolioSection[] = [
  {
    id: "overview",
    label: "Overview",
    fileName: "README.md",
    description: "A quick introduction and selected work",
    kind: "markdown",
    accent: "blue",
  },
  {
    id: "about",
    label: "About",
    fileName: "about.md",
    description: "Background, values, and how I work",
    kind: "markdown",
    accent: "lavender",
  },
  {
    id: "experience",
    label: "Experience",
    fileName: "experience",
    description: "Roles, responsibilities, and outcomes",
    kind: "folder",
    accent: "peach",
    children: [
      { label: "Current role", fileName: "current-role.md" },
      { label: "Previous role", fileName: "previous-role.md" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    fileName: "projects",
    description: "Selected builds and technical case studies",
    kind: "folder",
    accent: "green",
    children: [
      { label: "Vesta Credentialing", fileName: "vesta-credentialing.ts" },
      { label: "Demonlist Ultimate", fileName: "demonlist-ultimate.ts" },
      { label: "Git Janitor", fileName: "git-janitor.ts" },
      { label: "FE Arena", fileName: "fe-arena.ts" },
      { label: "AniFind", fileName: "anifind.ts" },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    fileName: "skills.json",
    description: "Languages, frameworks, and tools",
    kind: "json",
    accent: "yellow",
  },
  {
    id: "contact",
    label: "Contact",
    fileName: "contact.md",
    description: "Ways to connect",
    kind: "markdown",
    accent: "pink",
  },
];

export const projects: PortfolioProject[] = [
  {
    title: "Vesta Credentialing Application",
    description:
      "An enterprise credentialing platform replacing more than 30 legacy spreadsheets with a centralized, type-safe workflow.",
    tags: ["Next.js", "tRPC", "Drizzle ORM", "Supabase"],
    status: "Production · 2026",
    accent: "green",
    highlights: [
      "Role-based access control across more than 10 protected healthcare views",
      "State-machine workflow with strict progression blockers and complete audit logging",
    ],
  },
  {
    title: "Demonlist Ultimate",
    description:
      "A full-stack platform for community submissions, global rankings, media proof, and natural-language discovery.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "AWS"],
    status: "Shipped · 2025–2026",
    accent: "mauve",
    href: "https://github.com/aluciencozy/demonlist",
    image: "/projects/demonlist-ultimate.png",
    highlights: [
      "Containerized backend on EC2 with media storage through S3",
      "Gemini-powered assistant and a frontend deployed through AWS Amplify",
    ],
  },
  {
    title: "Git Janitor",
    description:
      "A published interactive CLI that makes local and remote Git repository maintenance safer, faster, and easier to understand.",
    tags: ["TypeScript", "Node.js", "npm", "Git"],
    status: "Published · npm package",
    accent: "teal",
    href: "https://github.com/aluciencozy/git-janitor",
    liveHref: "https://www.npmjs.com/package/@alcozy/git-janitor",
    image: "/projects/git-janitor.png",
    imageFit: "contain",
    highlights: [
      "Keyboard-navigated workflows for pruning merged branches, syncing remotes, and inspecting active branches",
      "Published globally through npm with guardrails around destructive Git operations",
    ],
  },
  {
    title: "FE Arena",
    description:
      "An unofficial UCF Foundation Exam study platform with solo practice, public matchmaking, private rooms, and browser-based C coding rounds.",
    tags: ["React", "TypeScript", "Socket.io", "Node.js", "Supabase", "WebAssembly"],
    status: "In development · 2026",
    accent: "blue",
    href: "https://github.com/aluciencozy/fe-arena",
    highlights: [
      "Server-authoritative five-round matches with queueing, rematches, chat, deadline-safe state transitions, and reconnect recovery",
      "Original multi-format question bank plus timed browser-only C execution inside prewarmed WebAssembly workers",
    ],
  },
  {
    title: "AniFind",
    description:
      "A full-stack anime discovery platform where users can search titles, explore current favorites, and manage a personal watchlist.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "AniList API"],
    status: "Shipped · Full-stack app",
    accent: "green",
    href: "https://github.com/aluciencozy/anifind-fullstack",
    liveHref: "https://anifind-fullstack.vercel.app/",
    image: "/projects/anifind.png",
    imageFit: "contain",
    highlights: [
      "Secure REST API with JWT authentication and MongoDB-backed watchlist CRUD operations",
      "Responsive React interface combining the custom backend with the AniList GraphQL API",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineering Intern",
    organization: "Vesta Teleradiology",
    location: "Lake Mary, FL",
    period: "Feb 2026 - Present",
    highlights: [
      "Migrated more than 50,000 legacy records into Supabase with zero data loss using over 10 automated Python scripts, strict upserts, and transactional integrity checks.",
      "Built GitHub Actions delivery pipelines with linting, required peer review, and deployments to GCP Cloud Run.",
      "Integrated n8n webhook workflows for automated credentialing emails and real-time system alerts.",
      "Led agile sprint execution through GitHub Projects and presented weekly technical progress to executive leadership.",
    ],
  },
  {
    role: "Food and Beverage Attendant",
    organization: "Hilton Food and Beverage",
    location: "Sanford, FL",
    period: "Jun 2024 - Present",
    highlights: [
      "Deliver high-efficiency customer service in a fast-paced environment while coordinating inventory and resolving guest issues across teams.",
    ],
  },
];

export const education = {
  institution: "University of Central Florida",
  degree: "Bachelor of Science in Computer Science",
  location: "Orlando, FL",
  period: "Aug 2024 - Present",
  gpa: "4.0 GPA",
};

export const externalLinks: PortfolioLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/aluciencozy",
    type: "github",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/alcozy/",
    type: "linkedin",
  },
  {
    label: "Resume",
    href: "/alex_cosentino_resume.pdf",
    type: "resume",
  },
  {
    label: "Email",
    href: "mailto:aluciencozy22@gmail.com",
    type: "email",
  },
];

export const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "Java", "C"],
  frameworks: [
    "Next.js",
    "React",
    "Node.js",
    "tRPC",
    "Drizzle ORM",
    "FastAPI",
    "Motion",
  ],
  architecture: [
    "Supabase",
    "PostgreSQL",
    "REST APIs",
    "Webhooks",
    "Socket.io",
  ],
  tools: [
    "GCP",
    "AWS",
    "Docker",
    "GitHub Actions",
    "Git",
    "n8n",
  ],
};

export const sectionById = Object.fromEntries(
  sections.map((section) => [section.id, section]),
) as Record<PortfolioSectionId, PortfolioSection>;

export const isSectionId = (value: string): value is PortfolioSectionId =>
  sections.some((section) => section.id === value);
