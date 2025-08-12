import React from "react";

interface SubrowProps {
	children: React.ReactNode;
}

function Subrow(props: SubrowProps) {
	return (
		<div style={{ height: 100, position: "relative" }}>{props.children}</div>
	);
}

export default Subrow;
