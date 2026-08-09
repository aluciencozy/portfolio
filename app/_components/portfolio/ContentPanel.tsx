"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  GitBranch,
  Mail,
  MapPin,
} from "lucide-react";
import { EditorScrollbar } from "./EditorScrollbar";
import {
  education,
  experience,
  externalLinks,
  projects,
  sectionById,
  skills,
} from "./data";
import type { PortfolioProject, PortfolioSectionId } from "./types";
import styles from "./portfolio.module.css";

interface ContentPanelProps {
  activeSection: PortfolioSectionId;
  onNavigate: (section: PortfolioSectionId) => void;
}

function ProfileVisual() {
  return (
    <div
      className={`${styles.mediaSlot} ${styles.profileVisual}`}
      role="img"
      aria-label="Visual profile card for Alex Cosentino, a software developer in Orlando"
    >
      <div className={styles.visualTitlebar} aria-hidden="true">
        <span />
        <span />
        <span />
        <small>profile.ts</small>
      </div>
      <div className={styles.profilePortrait} aria-hidden="true">
        <Image
          src="/pfp.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="(max-width: 800px) 96px, 126px"
        />
      </div>
      <div className={styles.profileCode} aria-hidden="true">
        <span>
          <i>const</i> developer = {"{"}
        </span>
        <span>
          name: <strong>&quot;Alex Cosentino&quot;</strong>,
        </span>
        <span>
          focus: <strong>&quot;full-stack systems&quot;</strong>,
        </span>
        <span>
          location: <strong>&quot;Orlando, FL&quot;</strong>
        </span>
        <span>{"}"};</span>
      </div>
    </div>
  );
}

function ProjectVisual({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  if (project.image) {
    return (
      <div
        className={`${styles.mediaSlot} ${styles.mediaSlotCompact} ${styles.projectScreenshot}`}
      >
        <Image
          src={project.image}
          alt={`${project.title} project screenshot`}
          fill
          sizes="(max-width: 800px) 100vw, 38vw"
          className={
            project.imageFit === "contain"
              ? styles.projectImageContain
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.mediaSlot} ${styles.mediaSlotCompact} ${styles.projectVisual}`}
      data-accent={project.accent}
      role="img"
      aria-label={`${project.title} project visual summary`}
    >
      <div className={styles.visualTitlebar} aria-hidden="true">
        <span />
        <span />
        <span />
        <small>project-0{index + 1}.tsx</small>
      </div>
      <div className={styles.projectVisualBody} aria-hidden="true">
        <div className={styles.projectVisualHeading}>
          <span>
            <GitBranch size={12} /> main
          </span>
          <strong>{project.title}</strong>
        </div>
        <div className={styles.projectVisualPanels}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.projectVisualStack}>
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className={styles.sectionHeading}>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function Overview({ onNavigate }: Pick<ContentPanelProps, "onNavigate">) {
  const github = externalLinks.find((link) => link.type === "github");
  const resume = externalLinks.find((link) => link.type === "resume");

  return (
    <div className={styles.overview}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <div className={styles.availabilityPill}>
            <span />
            Software Developer Intern · CS at UCF
          </div>
          <p className={styles.editorComment}>{"// README.md"}</p>
          <h1>
            Alex Cosentino<span>.</span>
          </h1>
          <h2>
            I build reliable full-stack systems with product-minded detail.
          </h2>
          <p className={styles.heroDescription}>
            Software developer and computer science student focused on type-safe
            web applications, data systems, cloud delivery, and developer
            experience. Currently building healthcare credentialing software at
            Vesta Teleradiology.
          </p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => onNavigate("projects")}>
              View projects <ArrowRight size={15} />
            </button>
            {github?.href && (
              <a href={github.href} target="_blank" rel="noreferrer">
                <Code2 size={15} /> GitHub
              </a>
            )}
            {resume?.href && (
              <a href={resume.href} target="_blank" rel="noreferrer">
                <Download size={15} /> Resume
              </a>
            )}
          </div>
        </div>
        <div className={styles.profileColumn}>
          <ProfileVisual />
          <div className={styles.profileCaption}>
            <span className={styles.promptArrow}>❯</span>
            <span>based in Orlando, FL</span>
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid} aria-label="Career highlights">
        <div>
          <strong>50K+</strong>
          <span>records migrated with zero data loss</span>
        </div>
        <div>
          <strong>10+</strong>
          <span>automated migration scripts</span>
        </div>
        <div>
          <strong>{projects.length}</strong>
          <span>featured software projects</span>
        </div>
        <div>
          <strong>4.0</strong>
          <span>computer science GPA</span>
        </div>
      </div>

      <section className={styles.featuredSection}>
        <div className={styles.sectionLabelRow}>
          <div>
            <span>SELECTED WORK</span>
            <h3>Projects with real systems behind them</h3>
          </div>
          <button type="button" onClick={() => onNavigate("projects")}>
            All projects <ArrowRight size={14} />
          </button>
        </div>
        <div className={styles.projectPreviewGrid}>
          {projects.map((project, index) => (
            <button
              type="button"
              className={styles.projectPreview}
              data-accent={project.accent}
              onClick={() => onNavigate("projects")}
              key={project.title}
            >
              <span>0{index + 1}</span>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <small>{project.tags.slice(0, 3).join(" · ")}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function About() {
  return (
    <div className={styles.standardPage}>
      <SectionHeading
        eyebrow="ABOUT.MD"
        title="Developer, student, and relentless systems improver."
        description="I care about making complex software feel clear, dependable, and genuinely useful to the people operating it."
      />
      <div className={styles.aboutGrid}>
        <div className={styles.proseCard}>
          <p>
            I&apos;m Alex, a software developer pursuing a B.S. in Computer
            Science at the University of Central Florida while working on
            production healthcare software at Vesta Teleradiology.
          </p>
          <p>
            My recent work spans large data migrations, type-safe full-stack
            applications, role-based authorization, state-machine workflows,
            CI/CD pipelines, cloud deployment, and operational automation.
          </p>
          <p>
            I bring the same attention to my tools and interfaces that I bring
            to architecture. My development environment is built around a
            carefully tuned terminal workflow and Catppuccin Mocha, a theme I
            genuinely love and use everywhere I can.
          </p>
        </div>
        <div className={styles.educationCard}>
          <div className={styles.cardIcon}>
            <GraduationCap size={19} />
          </div>
          <span>EDUCATION</span>
          <h3>{education.institution}</h3>
          <p>{education.degree}</p>
          <div>
            <BookOpen size={14} /> {education.gpa}
          </div>
          <div>
            <MapPin size={14} /> {education.location}
          </div>
          <small>{education.period}</small>
        </div>
      </div>
      <div className={styles.valueGrid}>
        <article>
          <span>01</span>
          <h3>Robust by default</h3>
          <p>
            Data integrity, useful types, clear boundaries, and failure modes
            designed before launch.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Product-aware development</h3>
          <p>
            Technical decisions grounded in how people actually use and maintain
            the system.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Always improving</h3>
          <p>
            Curiosity applied equally to systems, tooling, visual polish, and
            team communication.
          </p>
        </article>
      </div>
    </div>
  );
}

function Experience() {
  return (
    <div className={styles.standardPage}>
      <SectionHeading
        eyebrow="EXPERIENCE/"
        title="Production work and measurable outcomes."
        description="Experience across healthcare systems, delivery automation, technical leadership, and customer-facing operations."
      />
      <div className={styles.timeline}>
        {experience.map((entry, index) => (
          <article key={`${entry.organization}-${entry.role}`}>
            <div className={styles.timelineRail}>
              <span>{index + 1}</span>
              <i />
            </div>
            <div className={styles.experienceCard}>
              <div className={styles.experienceTopline}>
                <div>
                  <span>{entry.organization}</span>
                  <h2>{entry.role}</h2>
                </div>
                <div>
                  <strong>{entry.period}</strong>
                  <small>{entry.location}</small>
                </div>
              </div>
              <ul>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  return (
    <article className={styles.projectCard} data-accent={project.accent}>
      <div className={styles.projectMedia}>
        <ProjectVisual project={project} index={index} />
        <span className={styles.projectNumber}>0{index + 1}</span>
      </div>
      <div className={styles.projectBody}>
        <div className={styles.projectTopline}>
          <span>{project.status}</span>
          <div className={styles.projectLinks}>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                title="View source code"
              >
                <Code2 size={15} />
              </a>
            )}
            {project.liveHref && (
              <a
                href={project.liveHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
                title="Open live project"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <ul>
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className={styles.tagList}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <div className={styles.standardPage}>
      <SectionHeading
        eyebrow="PROJECTS/"
        title="Selected systems I’ve designed and built."
        description="A mix of production healthcare tooling, cloud architecture, real-time experiences, and AI-assisted interfaces."
      />
      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.title} />
        ))}
      </div>
    </div>
  );
}

function Skills() {
  const categories = [
    ["languages", skills.languages],
    ["frameworks & libraries", skills.frameworks],
    ["databases & architecture", skills.architecture],
    ["cloud, devops & tools", skills.tools],
  ] as const;

  return (
    <div className={styles.standardPage}>
      <SectionHeading
        eyebrow="SKILLS.JSON"
        title="A practical full-stack toolkit."
        description="Technologies I use across product interfaces, backend services, data systems, deployment, and automation."
      />
      <div className={styles.skillsEditor}>
        <div className={styles.codeGutter} aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <div className={styles.skillsCode}>
          <span className={styles.syntaxPunctuation}>{"{"}</span>
          {categories.map(([label, items], categoryIndex) => (
            <div className={styles.skillCodeBlock} key={label}>
              <div>
                <span className={styles.syntaxKey}>&quot;{label}&quot;</span>
                <span className={styles.syntaxPunctuation}>: [</span>
              </div>
              <div className={styles.skillTokens}>
                {items.map((item, index) => (
                  <span key={item}>
                    <i>&quot;{item}&quot;</i>
                    {index < items.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
              <div className={styles.syntaxPunctuation}>
                ]{categoryIndex < categories.length - 1 ? "," : ""}
              </div>
            </div>
          ))}
          <span className={styles.syntaxPunctuation}>{"}"}</span>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const iconByType = {
    github: Code2,
    linkedin: BriefcaseBusiness,
    resume: Download,
    email: Mail,
  };

  return (
    <div className={`${styles.standardPage} ${styles.contactPage}`}>
      <div className={styles.contactIntro}>
        <span>CONTACT.MD</span>
        <h1>Let&apos;s build something thoughtful.</h1>
        <p>
          I&apos;m always happy to talk about software development
          opportunities, ambitious products, developer tooling, or a
          particularly good terminal setup.
        </p>
      </div>
      <div className={styles.contactGrid}>
        {externalLinks.map((link) => {
          const Icon = iconByType[link.type];
          return (
            <a
              href={link.href}
              key={link.type}
              target={link.type === "email" ? undefined : "_blank"}
              rel={link.type === "email" ? undefined : "noreferrer"}
            >
              <span>
                <Icon size={18} />
              </span>
              <div>
                <small>{link.type}</small>
                <strong>{link.label}</strong>
              </div>
              <ExternalLink size={14} />
            </a>
          );
        })}
      </div>
      <div className={styles.contactCommand}>
        <span className={styles.promptArrow}>❯</span>
        <span>echo &quot;Thanks for stopping by.&quot;</span>
        <i />
      </div>
    </div>
  );
}

export function ContentPanel({ activeSection, onNavigate }: ContentPanelProps) {
  const section = sectionById[activeSection];
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <main className={styles.editorViewport} id="portfolio-content">
      <motion.article
        ref={scrollRef}
        id="portfolio-scroll-content"
        key={activeSection}
        className={styles.editorScroll}
        aria-label={section.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {activeSection === "overview" && <Overview onNavigate={onNavigate} />}
        {activeSection === "about" && <About />}
        {activeSection === "experience" && <Experience />}
        {activeSection === "projects" && <Projects />}
        {activeSection === "skills" && <Skills />}
        {activeSection === "contact" && <Contact />}
      </motion.article>
      <EditorScrollbar contentKey={activeSection} scrollRef={scrollRef} />
    </main>
  );
}
