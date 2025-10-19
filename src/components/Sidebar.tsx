import React from "react";
import { RowDefinition } from "../types";

interface SidebarProps {
	row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
	return (
		<div
			style={{ width: 150, border: "1px solid grey" }}
		>{`Row ${props.row.id}`}</div>
	);
}

export default Sidebar;
