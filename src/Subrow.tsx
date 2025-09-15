import React from "react";

interface SubrowProps {
	children: React.ReactNode;
}

function Subrow(props: SubrowProps) {
	return (
		<div style={{ height: 90, margin:'2px 0px', position: "relative" }}>{props.children}</div>
	);
}

export default Subrow;
