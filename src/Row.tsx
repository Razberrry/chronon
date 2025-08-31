import type { RowDefinition } from "dnd-timeline";
import { useRow } from "dnd-timeline";
import React from "react";

interface RowProps extends RowDefinition {
	children: React.ReactNode;
	sidebar: React.ReactNode;
}

function Row(props: RowProps) {
	const {
		setNodeRef,
		setSidebarRef,
		rowWrapperStyle,
		rowStyle,
		rowSidebarStyle,
	} = useRow({ id: props.id });


	return (
		<div style={rowWrapperStyle}>
			<div ref={setSidebarRef} style={rowSidebarStyle}>
				{props.sidebar}
			</div>
			<div ref={setNodeRef} style={{
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
}

export default Row;
