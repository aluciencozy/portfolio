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
      { label: "FE Arena", fileName: "fe-arena.ts" },
      { label: "DevDoctor", fileName: "devdoctor.ts" },
      { label: "TrueFan", fileName: "truefan.ts" },
      { label: "Demonlist Ultimate", fileName: "demonlist-ultimate.ts" },
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
      "A type-safe full-stack credentialing platform consolidating 30+ Google Sheets into one database-backed application.",
    tags: ["Next.js", "tRPC", "Drizzle ORM", "Supabase", "TypeScript"],
    status: "Production · 2026",
    accent: "green",
    highlights: [
      "Role-based access control (RBAC) securing healthcare records across 10+ custom views",
      "Auditable state-machine workflows for provider privileges and licensing",
    ],
  },
  {
    title: "FE Arena",
    description:
      "A real-time multiplayer UCF Computer Science exam-prep platform with private rooms and public matchmaking.",
    tags: ["React", "TypeScript", "Node.js", "Socket.IO", "WebAssembly"],
    status: "In development · 2026",
    accent: "blue",
    href: "https://github.com/aluciencozy/fe-arena",
    image: "/projects/fe-arena.png",
    highlights: [
      "Server-authoritative match state machines, synchronized timers, secure server-side grading, and reconnect recovery",
      "In-browser C execution using WebAssembly workers",
    ],
  },
  {
    title: "DevDoctor",
    description:
      "A read-only Rust terminal app for inspecting processes, TCP listeners, and developer-tool installations in PATH order.",
    tags: ["Rust", "Ratatui", "Crossterm", "sysinfo"],
    status: "Published on crates.io · 2026",
    accent: "peach",
    href: "https://github.com/aluciencozy/devdoctor",
    packageHref: "https://crates.io/crates/devdoctor",
    image: "/projects/devdoctor.png",
    imageFit: "contain",
    highlights: [
      "PATH-ordered executable discovery and timeout-controlled version probes; install with cargo install devdoctor",
      "Interactive filtering and automated tests covering keyboard navigation, failure states, and terminal rendering",
    ],
  },
  {
    title: "TrueFan",
    description:
      "A co-developed, launched spoiler-aware anime explorer with interactive knowledge graphs filtered by episode progress.",
    tags: ["React", "TypeScript", "React Flow", "FastAPI", "Neon PostgreSQL"],
    status: "Launched · Live app",
    accent: "teal",
    href: "https://github.com/aluciencozy/truefan",
    liveHref: "https://truefan.dev",
    image: "/projects/truefan.png",
    imageFit: "contain",
    highlights: [
      "AniList GraphQL and experimental Hugging Face inference with Neon PostgreSQL caching",
      "Resumable background jobs with deployments on Vercel and Railway",
    ],
  },
  {
    title: "Demonlist Ultimate",
    description:
      "A full-stack leaderboard with REST APIs, OAuth2/JWT authentication, user-uploaded media, and an AI chatbot.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "AWS", "Docker"],
    status: "Shipped · 2025–2026",
    accent: "mauve",
    href: "https://github.com/aluciencozy/demonlist",
    image: "/projects/demonlist-ultimate.png",
    highlights: [
      "Docker-containerized Python backend on AWS EC2, RDS database hosting, and AWS Amplify frontend CI/CD",
      "AWS S3 for avatars and video submissions, plus an AI chatbot using Gemini and Groq APIs",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Software Developer",
    organization: "Vesta Teleradiology",
    location: "Lake Mary, FL",
    period: "Feb 2026 - Present",
    highlights: [
      "Migrated 50,000+ legacy records into a relational Supabase/PostgreSQL database using 10+ Python ETL scripts, with idempotent upserts and transactional integrity checks to prevent data loss.",
      "Built GitHub Actions CI/CD pipelines with automated linting and peer-reviewed pull request checks to standardize deployments to GCP Cloud Run.",
      "Helped lead GCP infrastructure planning across Compute Engine VMs, Cloud Run services/jobs, IAM, and VPC networking; evaluated PostgreSQL read replicas and CDC/logical replication.",
      "Coordinated Agile sprints using GitHub Projects, delegated engineering tickets, and presented weekly technical progress to executive leadership.",
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
    label: "407-724-6962",
    href: "tel:+14077246962",
    type: "phone",
  },
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
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "Java", "C", "Rust"],
  frameworks: [
    "Next.js", "React", "Node.js", "tRPC", "Drizzle ORM", "FastAPI",
    "Socket.IO", "React Flow", "Zod", "Vite",
  ],
  architecture: ["Supabase", "PostgreSQL", "Neon", "REST APIs", "GraphQL", "Webhooks"],
  tools: ["GCP", "AWS", "Docker", "GitHub Actions", "Git", "n8n"],
  other: [
    "Vercel", "Railway", "Hugging Face", "WebAssembly", "OAuth2", "JWT",
    "CI/CD", "Linux", "WebSockets",
  ],
};

export const sectionById = Object.fromEntries(
  sections.map((section) => [section.id, section]),
) as Record<PortfolioSectionId, PortfolioSection>;

export const isSectionId = (value: string): value is PortfolioSectionId =>
  sections.some((section) => section.id === value);
