import React, { memo, useLayoutEffect, useRef } from "react";
import clsx from "clsx";

import "./timeCursor.base.css";
import { TimelineCursorClasses, TL_CURSOR_CLASS } from "./timeCursorClasses";
import { useTimelineContext } from "../../hooks/useTimelineContext";

export interface TimeCursorProps {
	at?: Date;
	classes?: TimelineCursorClasses;
}

export const TimeCursor = ({ at, classes }: TimeCursorProps) => {
	const timeCursorRef = useRef<HTMLDivElement>(null);
	const { range, direction, sidebarWidth, valueToPixels } =
		useTimelineContext();


	const isVisible = at.getTime() > range.start && at.getTime() < range.end;

	const side = direction === "rtl" ? "right" : "left";

	useLayoutEffect(() => {
		const element = timeCursorRef.current;
		if (!element) return;

		const timeDelta = at.getTime() - range.start;
		const timeDeltaInPixels = valueToPixels(timeDelta);
		const sideDelta = sidebarWidth + timeDeltaInPixels;
		element.style[side] = `${sideDelta}px`;
		element.style[side === "left" ? "right" : "left"] = "";
	}, [
		side,
		sidebarWidth,
		at,
		range.start,
		valueToPixels,
	]);

	return isVisible && at ? (
  <div
    ref={timeCursorRef}
    className={clsx(TL_CURSOR_CLASS, classes?.cursor)}
  />
) : null
};


