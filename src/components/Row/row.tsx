import React from "react";
import clsx from "clsx";

import "./row.base.css";
import styles from "./row.module.css";
import type { TimelineRowClasses } from "../../types/TimelineClasses";
import { useTimelineContext } from "../../context/timelineContext";
import { RowDefinition } from "../../types/row";

export interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  rowContentHeightPixels?: number;
  classes?: TimelineRowClasses;
}

export const Row = (props: RowProps): JSX.Element => {
  const { setSidebarRef, setViewportRef } = useTimelineContext();

  return (
    <div className={clsx("TlTimeline-rowWrapper", props.classes?.wrapper)}>
      <div
        ref={setSidebarRef}
        className={clsx("TlTimeline-rowSidebar", props.classes?.sidebar)}
      >
        {props.sidebar}
      </div>

      <div
        ref={setViewportRef}
        className={clsx(
          "TlTimeline-rowContent",
          props.classes?.content ?? styles.rowContentBorder
        )}
        data-tl-row-height={props.rowContentHeightPixels}
      >
        {props.children}
      </div>
    </div>
  );
};
