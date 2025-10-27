import React, { memo, useLayoutEffect, useRef } from "react";
import clsx from "clsx";

import "./timeCursor.base.css";
import { useTimelineContext } from "../../context/timelineContext";
import type { TimelineCursorClasses } from "../../types/TimelineClasses";


export interface TimeCursorProps {
	at?: Date;
	classes?: TimelineCursorClasses;
}

export const TimeCursor = ({ at, classes }: TimeCursorProps) => {
	const timeCursorRef = useRef<HTMLDivElement>(null);
	const { range, direction, sidebarWidth, spanToPixels } = useTimelineContext();


	const isVisible = at.getTime() > range.start && at.getTime() < range.end;

	const side = direction === "rtl" ? "right" : "left";

	useLayoutEffect(() => {
		const element = timeCursorRef.current;
		if (!element) return;

		const timeDelta = at.getTime() - range.start;
		const timeDeltaInPixels = spanToPixels(timeDelta);
		const sideDelta = sidebarWidth + timeDeltaInPixels;
		element.style[side] = `${sideDelta}px`;
		element.style[side === "left" ? "right" : "left"] = "";
	}, [
		side,
		sidebarWidth,
		at,
		range.start,
		spanToPixels,
	]);

	return isVisible && at ? (
  <div
    ref={timeCursorRef}
    className={clsx("TlTimeline-cursor", classes?.cursor)}
  />
) : null
};
