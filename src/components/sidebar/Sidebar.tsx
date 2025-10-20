import React from "react";
import clsx from "clsx";
import "./sidebar.base.css";
import { RowDefinition } from "../../types";
import { TimelineSidebarClasses } from "../../types/TimelineClasses";

export const TL_SIDEBAR_CLASS = "TlTimeline-sidebar";

interface SidebarProps {
  row: RowDefinition;
  classes?: TimelineSidebarClasses;
};

const Sidebar = ({ row, classes }: SidebarProps) => {
  return (
    <div className={clsx(TL_SIDEBAR_CLASS, classes?.sidebar)}>
      {`Row ${row.id}`}
    </div>
  );
};

export default Sidebar;