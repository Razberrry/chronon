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
  return (
    <div style={rowWrapperStyle} className={styles.rowWrapper}>
      <div ref={setSidebarRef}  className={styles.sidebar}>
        {props.sidebar}
      </div>
      <div 
      style={{
				...rowStyle,
				display: 'flex 0 0 auto',
				height:'200px',
				overflowY:'auto',
				overflowX:'hidden',
				border:'1px solid grey'
			}}>
    
        {props.children}
      </div>
    </div>
  );
};

export default Row;
