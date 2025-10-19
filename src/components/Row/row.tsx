import React from "react";
import clsx from "clsx";

import "./row.base.css";
import styles from "./row.module.css";
import { TimelineRowClasses, TL_ROW_CONTENT_CLASS, TL_ROW_SIDEBAR_CLASS, TL_ROW_WRAPPER_CLASS } from "./rowClasses";
import { RowDefinition } from "../../types";
import useTimelineContext from "../../hooks/useTimelineContext";

interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  rowContentHeightPixels?: number;
  classes?: TimelineRowClasses;
}

const Row = (props: RowProps): JSX.Element => {
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

export default Row;
