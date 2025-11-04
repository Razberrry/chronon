import React from "react";
import clsx from "clsx";

import "./row.base.css";
import styles from "./row.module.css";
import type { TimelineRowClasses } from "../../types/TimelineClasses";
import { useTimelineContext } from "../../context/timelineContext";
import { RowDefinition } from "../../types/row";

export interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  classes?: TimelineRowClasses;
  ignoreRefs?: boolean;
}

export const Row = (props: RowProps): JSX.Element => {
  const {
    setSidebarRef,
    setViewportRef,
    sidebarWidth,
  } = useTimelineContext();
  const hasSidebar = props.sidebar !== undefined && props.sidebar !== null;

  const contentStyle =
    props.subrowHeight !== undefined
      ? ({
          "--tl-subrow-height": `${props.subrowHeight}px`,
        } as React.CSSProperties)
      : undefined;

  return (
    <div className={clsx("TlTimeline-rowWrapper", props.classes?.wrapper)}>
      <div
        ref={props?.ignoreRefs ? undefined : setSidebarRef}
        className={clsx(
          "TlTimeline-rowSidebar",
          !hasSidebar && "TlTimeline-rowSidebarSpacer",
          props.classes?.sidebar
        )}
        style={
          !hasSidebar
            ? ({
                "--tl-row-sidebar-width": `${sidebarWidth ?? 0}px`,
              } as React.CSSProperties)
            : undefined
        }
        aria-hidden={hasSidebar ? undefined : true}
      >
        {hasSidebar ? props.sidebar : null}
      </div>

      <div
        ref={props?.ignoreRefs ? undefined : setViewportRef}
        className={clsx(
          "TlTimeline-rowContent",
          props.classes?.content ?? styles.rowContentBorder
        )}
        style={contentStyle}
      >
        {props.children}
      </div>
    </div>
  );
};
