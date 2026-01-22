import React from "react";
import clsx from "clsx";

import "./row.base.css";
import styles from "./row.module.css";

import { useTimelineContext } from "../../context/timelineContext";
import type { RowDefinition } from "../../types/row";
import type { TimelineRowClasses } from "../../types/TimelineClasses";

export interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  classes?: TimelineRowClasses;
  ignoreRefs?: boolean;
  subrowHeight?: number;
}

export const Row: React.FC<RowProps> = ({
  id,
  children,
  sidebar,
  classes,
  ignoreRefs = false,
  subrowHeight,
}) => {
  const { direction, setSidebarRef, setViewportRef, sidebarWidth } =
    useTimelineContext();

  const hasSidebar = !!sidebar;

  const contentStyle: React.CSSProperties | undefined = subrowHeight
    ? ({
        "--tl-subrow-height": `${subrowHeight}px`,
      } as React.CSSProperties)
    : undefined;

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
          {children}
        </div>
      </div>
    </div>
  );
};
