import { education, experience, externalLinks, projects, skills } from "./data";
import styles from "./portfolio.module.css";

export function StaticPortfolio() {
  return (
    <main className={styles.fallbackDocument}>
      <header className={styles.fallbackHero}>
        <span>Software Engineer · Orlando, Florida</span>
        <h1>Alex Cosentino</h1>
        <p>
          I build reliable full-stack systems with product-minded detail,
          spanning type-safe web applications, data systems, cloud delivery,
          and developer experience.
        </p>
        <nav aria-label="Professional links">
          {externalLinks.map((link) => (
            <a href={link.href} key={link.type}>{link.label}</a>
          ))}
        </nav>
      </header>

      <section>
        <h2>Experience</h2>
        {experience.map((entry) => (
          <article key={`${entry.organization}-${entry.role}`}>
            <div className={styles.fallbackTopline}>
              <h3>{entry.role} · {entry.organization}</h3>
              <span>{entry.period}</span>
            </div>
            <p>{entry.location}</p>
            <ul>
              {entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        <div className={styles.fallbackGrid}>
          {projects.map((project) => (
            <article key={project.title}>
              <span>{project.status}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.tags.join(" · ")}</small>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Skills &amp; education</h2>
        <div className={styles.fallbackGrid}>
          <article>
            <h3>{education.institution}</h3>
            <p>{education.degree}</p>
            <small>{education.gpa} · {education.period}</small>
          </article>
          {Object.entries(skills).map(([category, items]) => (
            <article key={category}>
              <h3>{category}</h3>
              <p>{items.join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
