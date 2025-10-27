import React from "react";
import clsx from "clsx";
import "./sidebar.base.css";
import { RowDefinition } from "../../types";
import type { TimelineSidebarClasses } from "../../types/TimelineClasses";

export interface SidebarProps {
  row: RowDefinition;
  classes?: TimelineSidebarClasses;
};

export const Sidebar = ({ row, classes }: SidebarProps) => {
  return (
    <div className={clsx("TlTimeline-sidebar", classes?.sidebar)}>
      {`Row ${row.id}`}
    </div>
  );
};
