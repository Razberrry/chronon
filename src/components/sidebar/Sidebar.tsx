import React from "react";
import clsx from "clsx";
import "./sidebar.base.css";
import { RowDefinition } from "../../types";
import type { TimelineSidebarClasses } from "../../types/TimelineClasses";

const TL_SIDEBAR_CLASS = "TlTimeline-sidebar";

export interface SidebarProps {
  row: RowDefinition;
  classes?: TimelineSidebarClasses;
};

export const Sidebar = ({ row, classes }: SidebarProps) => {
  return (
    <div className={clsx(TL_SIDEBAR_CLASS, classes?.sidebar)}>
      {`Row ${row.id}`}
    </div>
  );
};
