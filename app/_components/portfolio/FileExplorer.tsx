"use client";

import type { RefObject } from "react";
import {
  Braces,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Folder,
  FolderOpen,
  Mail,
  X,
} from "lucide-react";
import { externalLinks, sections } from "./data";
import type { PortfolioSectionId } from "./types";
import styles from "./portfolio.module.css";

interface FileExplorerProps {
  activeSection: PortfolioSectionId;
  expandedFolders: PortfolioSectionId[];
  open: boolean;
  onNavigate: (section: PortfolioSectionId) => void;
  onToggleFolder: (section: PortfolioSectionId) => void;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  explorerRef: RefObject<HTMLElement | null>;
  modal: boolean;
}

function FileIcon({ kind }: { kind: "markdown" | "folder" | "json" }) {
  if (kind === "json") return <Braces size={15} aria-hidden="true" />;
  if (kind === "folder") return <Folder size={15} aria-hidden="true" />;
  return <FileText size={15} aria-hidden="true" />;
}

export function FileExplorer({
  activeSection,
  expandedFolders,
  open,
  onNavigate,
  onToggleFolder,
  onClose,
  closeButtonRef,
  explorerRef,
  modal,
}: FileExplorerProps) {
  return (
    <aside
      ref={explorerRef}
      id="portfolio-file-explorer"
      className={`${styles.explorer} ${open ? styles.explorerOpen : ""}`}
      role={modal ? "dialog" : undefined}
      aria-modal={modal || undefined}
      aria-label="Portfolio file explorer"
    >
      <div className={styles.explorerHeader}>
        <span>EXPLORER</span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close explorer"
        >
          <X size={15} />
        </button>
      </div>
      <div className={styles.repositoryHeading}>
        <ChevronDown size={14} aria-hidden="true" />
        <span>ALEXCOSENTINO</span>
      </div>
      <nav className={styles.fileTree} aria-label="Portfolio sections">
        {sections.map((section) => {
          const expanded = expandedFolders.includes(section.id);
          const active = activeSection === section.id;

          return (
            <div key={section.id}>
              <div
                className={`${styles.fileRow} ${active ? styles.fileRowActive : ""}`}
                data-accent={section.accent}
              >
                {section.children ? (
                  <button
                    type="button"
                    className={styles.folderToggle}
                    onClick={() => onToggleFolder(section.id)}
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${section.label}`}
                    aria-expanded={expanded}
                  >
                    {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                ) : (
                  <span className={styles.fileIndent} />
                )}
                <button
                  type="button"
                  className={styles.fileButton}
                  onClick={() => onNavigate(section.id)}
                  title={section.description}
                  aria-current={active ? "page" : undefined}
                >
                  {section.children && expanded ? (
                    <FolderOpen size={15} aria-hidden="true" />
                  ) : (
                    <FileIcon kind={section.kind} />
                  )}
                  <span>{section.fileName}</span>
                  <small>{section.label}</small>
                </button>
              </div>
              {section.children && expanded && (
                <div className={styles.fileChildren}>
                  {section.children.map((child) => (
                    <button
                      type="button"
                      key={child.fileName}
                      onClick={() => onNavigate(section.id)}
                      title={`Open ${child.label}`}
                    >
                      <FileText size={13} aria-hidden="true" />
                      <span>{child.fileName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={styles.explorerFooter}>
        <span>CONNECT</span>
        <div>
          {externalLinks
            .filter((link) => link.type === "github" || link.type === "email")
            .map((link) => (
              <a
                href={link.href}
                key={link.type}
                target={link.type === "github" ? "_blank" : undefined}
                rel={link.type === "github" ? "noreferrer" : undefined}
                aria-label={link.label}
              >
                {link.type === "github" ? <Code2 size={15} /> : <Mail size={15} />}
                <span>{link.label}</span>
              </a>
            ))}
        </div>
      </div>
    </aside>
  );
}
