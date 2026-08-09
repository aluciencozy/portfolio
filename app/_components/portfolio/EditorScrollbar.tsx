"use client";

import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

interface EditorScrollbarProps {
  contentKey: string;
  scrollRef: RefObject<HTMLElement | null>;
}

interface ScrollbarMetrics {
  maximum: number;
  offset: number;
  size: number;
  value: number;
  visible: boolean;
}

const minimumThumbSize = 36;

const initialMetrics: ScrollbarMetrics = {
  maximum: 0,
  offset: 0,
  size: minimumThumbSize,
  value: 0,
  visible: false,
};

export function EditorScrollbar({ contentKey, scrollRef }: EditorScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    pointerId: number;
    startScrollTop: number;
    startY: number;
  } | null>(null);
  const [metrics, setMetrics] = useState(initialMetrics);

  const sync = useCallback(() => {
    const scrollElement = scrollRef.current;
    const trackElement = trackRef.current;

    if (!scrollElement || !trackElement) return;

    const maximum = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
    const trackHeight = trackElement.clientHeight;
    const visible = maximum > 1 && trackHeight > 0;
    const size = visible
      ? Math.min(
          trackHeight,
          Math.max(
            minimumThumbSize,
            trackHeight * (scrollElement.clientHeight / scrollElement.scrollHeight),
          ),
        )
      : trackHeight;
    const travel = Math.max(0, trackHeight - size);
    const offset = maximum > 0 ? (scrollElement.scrollTop / maximum) * travel : 0;

    setMetrics({
      maximum,
      offset,
      size,
      value: scrollElement.scrollTop,
      visible,
    });
  }, [scrollRef]);

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    const trackElement = trackRef.current;

    if (!scrollElement || !trackElement) return;

    let animationFrame = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(sync);
    };
    const resizeObserver = new ResizeObserver(scheduleSync);

    scrollElement.addEventListener("scroll", scheduleSync, { passive: true });
    resizeObserver.observe(scrollElement);
    resizeObserver.observe(trackElement);
    Array.from(scrollElement.children).forEach((child) => resizeObserver.observe(child));
    scheduleSync();

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollElement.removeEventListener("scroll", scheduleSync);
      resizeObserver.disconnect();
    };
  }, [contentKey, scrollRef, sync]);

  const scrollToTrackPosition = (clientY: number) => {
    const scrollElement = scrollRef.current;
    const trackElement = trackRef.current;
    if (!scrollElement || !trackElement || !metrics.visible) return;

    const trackBox = trackElement.getBoundingClientRect();
    const travel = Math.max(1, trackBox.height - metrics.size);
    const offset = Math.min(
      travel,
      Math.max(0, clientY - trackBox.top - metrics.size / 2),
    );

    scrollElement.scrollTo({
      top: (offset / travel) * metrics.maximum,
      behavior: "smooth",
    });
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    scrollToTrackPosition(event.clientY);
  };

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startScrollTop: scrollElement.scrollTop,
      startY: event.clientY,
    };
  };

  const handleThumbPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollElement = scrollRef.current;
    const trackElement = trackRef.current;
    const drag = dragState.current;
    if (!scrollElement || !trackElement || !drag || drag.pointerId !== event.pointerId) return;

    const travel = Math.max(1, trackElement.clientHeight - metrics.size);
    scrollElement.scrollTop =
      drag.startScrollTop + ((event.clientY - drag.startY) / travel) * metrics.maximum;
  };

  const endThumbDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const pageDistance = scrollElement.clientHeight * 0.85;
    const actions: Partial<Record<string, number>> = {
      ArrowDown: scrollElement.scrollTop + 48,
      ArrowUp: scrollElement.scrollTop - 48,
      End: metrics.maximum,
      Home: 0,
      PageDown: scrollElement.scrollTop + pageDistance,
      PageUp: scrollElement.scrollTop - pageDistance,
    };
    const nextPosition = actions[event.key];
    if (nextPosition === undefined) return;

    event.preventDefault();
    scrollElement.scrollTo({ top: nextPosition, behavior: "smooth" });
  };

  return (
    <div
      ref={trackRef}
      className={`${styles.editorScrollRail} ${metrics.visible ? styles.editorScrollRailVisible : ""}`}
      role="scrollbar"
      aria-controls="portfolio-scroll-content"
      aria-label="Portfolio content scroll position"
      aria-orientation="vertical"
      aria-valuemax={Math.round(metrics.maximum)}
      aria-valuemin={0}
      aria-valuenow={Math.round(metrics.value)}
      tabIndex={metrics.visible ? 0 : -1}
      onKeyDown={handleKeyDown}
      onPointerDown={handleTrackPointerDown}
    >
      <div
        className={styles.editorScrollThumb}
        style={{ height: metrics.size, transform: `translateY(${metrics.offset}px)` }}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={endThumbDrag}
        onPointerCancel={endThumbDrag}
      />
    </div>
  );
}
