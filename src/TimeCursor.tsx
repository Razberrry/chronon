import React, { memo, useRef, useLayoutEffect } from "react";

import { useTimelineContext } from "dnd-timeline";

interface TimeCursorProps {
	at?: Date;

}

function TimeCursor({at}: TimeCursorProps) {
	const timeCursorRef = useRef<HTMLDivElement>(null);

	const { range, direction, sidebarWidth, valueToPixels } =
		useTimelineContext();

	const side = direction === "rtl" ? "right" : "left";

	const isVisible =
		at.getTime() > range.start && at.getTime() < range.end;

	useLayoutEffect(() => {
		if (!isVisible) return;

		const offsetCursor = () => {
			if (!timeCursorRef.current) return;
			const timeDelta = at.getTime() - range.start;
			const timeDeltaInPixels = valueToPixels(timeDelta);

			const sideDelta = sidebarWidth + timeDeltaInPixels;
			timeCursorRef.current.style[side] = `${sideDelta}px`;
		};

		offsetCursor();

	}, [
		side,
		sidebarWidth,
		at,
		range.start,
		valueToPixels,
		isVisible,
	]);

	if (!isVisible) return null;

	return (
		<div
			ref={timeCursorRef}
			style={{
				height: "100%",
				width: "2px",
				zIndex: 3,
				backgroundColor: "white",
				position: "absolute",
			}}
		/>
	);
}

export default memo(TimeCursor);
