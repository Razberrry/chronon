import React from "react";
import clsx from "clsx";
import "./sidebar.base.css";
import { TimelineSidebarClasses, TL_SIDEBAR_CLASS } from "./sidebarClasses";
import { RowDefinition } from "../../types";

interface SidebarProps {
  row: RowDefinition;
  classes?: TimelineSidebarClasses;
}

const Sidebar = ({ row, classes }: SidebarProps) => {
  return (
    <div className={clsx(TL_SIDEBAR_CLASS, classes?.sidebar)}>
      {`Row ${row.id}`}
    </div>
  );
};

export default Sidebar;