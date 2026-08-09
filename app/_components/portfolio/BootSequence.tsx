"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FastForward } from "lucide-react";
import { TerminalSurface } from "./TerminalSurface";
import styles from "./portfolio.module.css";

const command = "nvim .";

const asciiMark = String.raw`       .--.
      |o_o |
      |:_/ |
     //   \ \
    (|     | )
   /'\_   _/\
   \___)=(___/`;

interface BootSequenceProps {
  reducedMotion: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function BootSequence({
  reducedMotion,
  onComplete,
  onSkip,
}: BootSequenceProps) {
  const [typedCommand, setTypedCommand] = useState(
    reducedMotion ? command : "",
  );

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(onComplete, 240);
      return () => window.clearTimeout(timer);
    }

    let interval = 0;
    const startTimer = window.setTimeout(() => {
      let index = 0;
      interval = window.setInterval(() => {
        index += 1;
        setTypedCommand(command.slice(0, index));
        if (index >= command.length) {
          window.clearInterval(interval);
          window.setTimeout(onComplete, 520);
        }
      }, 82);
    }, 780);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [onComplete, reducedMotion]);

  return (
    <motion.div
      className={styles.bootStage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.34 }}
    >
      <button type="button" className={styles.skipButton} onClick={onSkip}>
        Skip intro
        <FastForward size={14} />
      </button>
      <TerminalSurface className={styles.bootTerminal}>
        <div className={styles.bootContent}>
          <motion.div
            className={styles.fastfetch}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <pre className={styles.asciiMark} aria-hidden="true">{asciiMark}</pre>
            <div className={styles.fastfetchDetails}>
              <div className={styles.fastfetchHeading}>
                <span>alex</span>@portfolio
              </div>
              <div className={styles.fastfetchRule} />
              <dl>
                <div><dt>role</dt><dd>Software Engineering Intern</dd></div>
                <div><dt>education</dt><dd>Computer Science · UCF</dd></div>
                <div><dt>gpa</dt><dd>4.0</dd></div>
                <div><dt>focus</dt><dd>Full-stack systems &amp; developer experience</dd></div>
                <div><dt>stack</dt><dd>TypeScript · React · Python · SQL</dd></div>
                <div><dt>theme</dt><dd>Catppuccin Mocha</dd></div>
              </dl>
              <div className={styles.paletteDots} aria-label="Catppuccin Mocha palette">
                {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
              </div>
            </div>
          </motion.div>
          <div className={styles.bootPrompt}>
            <div>
              <span className={styles.promptUser}>alex@portfolio</span>{" "}
              <span className={styles.promptPath}>~</span>
            </div>
            <div className={styles.commandLine}>
              <span className={styles.promptArrow}>❯</span>
              <span>{typedCommand}</span>
              <span className={styles.cursor} aria-hidden="true" />
            </div>
          </div>
        </div>
      </TerminalSurface>
    </motion.div>
  );
}

