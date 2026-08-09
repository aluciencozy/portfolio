"use client";

import type { KeyboardEvent, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  explorerRef: RefObject<HTMLElement | null>;
  focusRequest: number;
  modal: boolean;
}

interface ExplorerItem {
  id: string;
  section: PortfolioSectionId;
  childFile?: string;
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
  explorerRef,
  focusRequest,
  modal,
}: FileExplorerProps) {
  const [selectedId, setSelectedId] = useState(`section:${activeSection}`);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const visibleItems = useMemo(
    () =>
      sections.flatMap<ExplorerItem>((section) => [
        { id: `section:${section.id}`, section: section.id },
        ...(section.children && expandedFolders.includes(section.id)
          ? section.children.map((child) => ({
              id: `child:${section.id}:${child.fileName}`,
              section: section.id,
              childFile: child.fileName,
            }))
          : []),
      ]),
    [expandedFolders],
  );

  const focusItem = (id: string) => {
    setSelectedId(id);
    window.requestAnimationFrame(() => {
      const element = itemRefs.current.get(id);
      element?.focus();
      element?.scrollIntoView({ block: "nearest" });
    });
  };

  useEffect(() => {
    if (!focusRequest) return;
    const animationFrame = window.requestAnimationFrame(() => {
      const element = itemRefs.current.get(`section:${activeSection}`);
      element?.focus();
      element?.scrollIntoView({ block: "nearest" });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeSection, focusRequest]);

  const handleTreeKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const currentIndex = visibleItems.findIndex((item) => item.id === selectedId);
    const current = visibleItems[currentIndex] ?? visibleItems[0];
    if (!current) return;

    const move = (index: number) => {
      event.preventDefault();
      event.stopPropagation();
      focusItem(visibleItems[Math.max(0, Math.min(visibleItems.length - 1, index))].id);
    };

    if (event.key === "j" || event.key === "ArrowDown") {
      move(currentIndex + 1);
      return;
    }
    if (event.key === "k" || event.key === "ArrowUp") {
      move(currentIndex - 1);
      return;
    }
    if (event.key === "Home") {
      move(0);
      return;
    }
    if (event.key === "End") {
      move(visibleItems.length - 1);
      return;
    }
    if (event.key === "h" || event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      if (current.childFile) {
        focusItem(`section:${current.section}`);
      } else {
        const section = sections.find((item) => item.id === current.section);
        if (section?.children && expandedFolders.includes(current.section)) {
          onToggleFolder(current.section);
        }
      }
      return;
    }
    if (event.key === "l" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      const section = sections.find((item) => item.id === current.section);
      if (section?.children && !expandedFolders.includes(current.section)) {
        onToggleFolder(current.section);
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      onNavigate(current.section);
      return;
    }
    if (event.key === "Escape" || event.key === "q") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };

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
      <nav
        className={styles.fileTree}
        aria-label="Portfolio sections"
        onKeyDown={handleTreeKeyDown}
      >
        {sections.map((section) => {
          const expanded = expandedFolders.includes(section.id);
          const active = activeSection === section.id;
          const sectionItemId = `section:${section.id}`;
          const selected = selectedId === sectionItemId;

          return (
            <div key={section.id}>
              <div
                className={`${styles.fileRow} ${active ? styles.fileRowActive : ""} ${selected ? styles.fileRowSelected : ""}`}
                data-accent={section.accent}
              >
                {section.children ? (
                  <button
                    type="button"
                    className={styles.folderToggle}
                    tabIndex={-1}
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
                  ref={(element) => {
                    if (element) itemRefs.current.set(sectionItemId, element);
                    else itemRefs.current.delete(sectionItemId);
                  }}
                  tabIndex={selected ? 0 : -1}
                  onFocus={() => setSelectedId(sectionItemId)}
                  onClick={() => {
                    setSelectedId(sectionItemId);
                    onNavigate(section.id);
                  }}
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
                  {section.children.map((child) => {
                    const childItemId = `child:${section.id}:${child.fileName}`;
                    const childSelected = selectedId === childItemId;
                    return <button
                      type="button"
                      key={child.fileName}
                      ref={(element) => {
                        if (element) itemRefs.current.set(childItemId, element);
                        else itemRefs.current.delete(childItemId);
                      }}
                      className={childSelected ? styles.fileChildSelected : undefined}
                      tabIndex={childSelected ? 0 : -1}
                      onFocus={() => setSelectedId(childItemId)}
                      onClick={() => {
                        setSelectedId(childItemId);
                        onNavigate(section.id);
                      }}
                      title={`Open ${child.label}`}
                    >
                      {child.fileName.endsWith(".ts") ? (
                        <span className={styles.typeScriptIcon} aria-hidden="true" />
                      ) : (
                        <FileText size={13} aria-hidden="true" />
                      )}
                      <span>{child.fileName}</span>
                    </button>;
                  })}
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
