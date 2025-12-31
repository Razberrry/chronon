import React from "react";
import clsx from "clsx";
import { Virtuoso } from "react-virtuoso";

import "./row.base.css";
import styles from "./row.module.css";

import { useTimelineContext } from "../../context/timelineContext";
import type { RowProps } from "./row";

export interface VirtualizedRowProps extends RowProps {
  virtualizeSubrows?: boolean;
  virtualSubrowOverscan?: number; // rows
}

export const VirtualizedRow: React.FC<VirtualizedRowProps> = ({
  id,
  children,
  sidebar,
  classes,
  ignoreRefs = false,
  subrowHeight,
  virtualizeSubrows = false,
  virtualSubrowOverscan = 6,
}) => {
  const { direction, setSidebarRef, setViewportRef, sidebarWidth } =
    useTimelineContext();

  const hasSidebar = !!sidebar;

  const contentStyle: React.CSSProperties | undefined = subrowHeight
    ? ({
        "--tl-subrow-height": `${subrowHeight}px`,
      } as React.CSSProperties)
    : undefined;

  const subrows = React.Children.toArray(children);

  const overscanPixels = subrowHeight * virtualSubrowOverscan;

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={clsx("TlTimeline-rowWrapper", classes?.wrapper)}
      data-row-id={id}
    >
      <div
        ref={ignoreRefs ? undefined : setSidebarRef}
        className={clsx(
          "TlTimeline-rowSidebar",
          !hasSidebar && "TlTimeline-rowSidebarSpacer",
          classes?.sidebar
        )}
        style={
          !hasSidebar
            ? ({
                "--tl-row-sidebar-width": `${sidebarWidth ?? 0}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {hasSidebar ? sidebar : null}
      </div>

      <div
        ref={scrollContainerRef}
        className={clsx(
          "TlTimeline-rowContent",
          classes?.content ?? styles.rowContentBorder
        )}
      >
        <div
          ref={ignoreRefs ? undefined : setViewportRef}
          className="TlTimeline-rowContentInner"
          style={contentStyle}
          dir={direction}
        >
          {virtualizeSubrows ? (
            <Virtuoso
              totalCount={subrows.length}
              customScrollParent={scrollContainerRef.current ?? undefined}
              increaseViewportBy={{
                top: overscanPixels,
                bottom: overscanPixels,
              }}
              defaultItemHeight={subrowHeight}
              itemContent={(index) => (
                <div data-index={index}>{subrows[index]}</div>
              )}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
