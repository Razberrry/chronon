import React from "react";
import clsx from "clsx";

import "./row.base.css";
import styles from "./row.module.css";
import { RowDefinition } from "../../types";
import { useTimelineContext } from "../../hooks/useTimelineContext";
import { TimelineRowClasses } from "../../types/TimelineClasses";

const TL_ROW_WRAPPER_CLASS = "TlTimeline-rowWrapper";
const TL_ROW_SIDEBAR_CLASS = "TlTimeline-rowSidebar";
const TL_ROW_CONTENT_CLASS = "TlTimeline-rowContent";

export interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  rowContentHeightPixels?: number;
  classes?: TimelineRowClasses;
}

export const Row = (props: RowProps): JSX.Element => {
  const { setSidebarRef } = useTimelineContext();

  return (
    <div className={clsx(TL_ROW_WRAPPER_CLASS, props.classes?.wrapper)}>
      <div ref={setSidebarRef} className={clsx(TL_ROW_SIDEBAR_CLASS, props.classes?.sidebar)}>
        {props.sidebar}
      </div>

      <div
        className={clsx(TL_ROW_CONTENT_CLASS, props.classes?.content ?? styles.rowContentBorder,)}
        data-tl-row-height={props.rowContentHeightPixels}
      >
        {props.children}
      </div>
    </div>
  );
};
