"use client";

import type { RefObject } from "react";
import { FileText, PanelLeft, X } from "lucide-react";
import { sectionById } from "./data";
import type { PortfolioSectionId } from "./types";
import styles from "./portfolio.module.css";

interface BufferTabsProps {
  activeSection: PortfolioSectionId;
  buffers: PortfolioSectionId[];
  onActivate: (section: PortfolioSectionId) => void;
  onClose: (section: PortfolioSectionId) => void;
  onToggleExplorer: () => void;
  explorerOpen: boolean;
  explorerButtonRef: RefObject<HTMLButtonElement | null>;
}

export function BufferTabs({
  activeSection,
  buffers,
  onActivate,
  onClose,
  onToggleExplorer,
  explorerOpen,
  explorerButtonRef,
}: BufferTabsProps) {
  return (
    <div className={styles.tabBar} role="tablist" aria-label="Open portfolio buffers">
      <button
        type="button"
        ref={explorerButtonRef}
        className={styles.mobileExplorerButton}
        onClick={onToggleExplorer}
        aria-label={explorerOpen ? "Close file explorer" : "Open file explorer"}
        aria-controls="portfolio-file-explorer"
        aria-expanded={explorerOpen}
      >
        <PanelLeft size={17} />
      </button>
      <div className={styles.tabScroller}>
        {buffers.map((buffer) => {
          const section = sectionById[buffer];
          const active = activeSection === buffer;

          return (
            <div
              key={buffer}
              className={`${styles.bufferTab} ${active ? styles.bufferTabActive : ""}`}
              data-accent={section.accent}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onActivate(buffer)}
              >
                <FileText size={13} aria-hidden="true" />
                <span>{section.fileName}</span>
              </button>
              {buffer !== "overview" && (
                <button
                  type="button"
                  className={styles.closeTab}
                  onClick={() => onClose(buffer)}
                  aria-label={`Close ${section.fileName}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.tabWindowControls} aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}
