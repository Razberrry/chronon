import type { RowDefinition } from "dnd-timeline";
import { useRow } from "dnd-timeline";
import React from "react";
import styles from "./Row.module.css";

interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const Row = (props: RowProps) => {
  const { setSidebarRef, rowWrapperStyle, rowStyle, rowSidebarStyle } = useRow();
  console.log('rowSidebarStyle:', rowWrapperStyle);
  return (
    <div style={rowWrapperStyle} className={styles.rowWrapper}>
      <div ref={setSidebarRef}  className={styles.sidebar}>
        {props.sidebar}
      </div>
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
};

export default Row;
