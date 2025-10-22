import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";

import type {
	GetDeltaXFromScreenX,
	GetValueFromScreenX,
	OnPanEnd,
	PixelsToValue,
	Range,
	TimelineContext,
	UseTimelineProps,
	ValueToPixels,
} from "../types";

import { useElementRef } from "./useElementRef";

const style: CSSProperties = {
	display: "flex",
	overflow: "hidden",
	position: "relative",
	flexDirection: "column",
};


export const useTimeline = ({
		range,
		onRangeChanged,
}: UseTimelineProps): TimelineContext => {

	const {
		ref: timelineRef,
		setRef: setTimelineRef,
		width: timelineWidth,
		direction,
	} = useElementRef();

	const {
		ref: sidebarRef,
		setRef: setSidebarRef,
		width: sidebarWidth,
	} = useElementRef();

	const timelineViewportWidth = timelineWidth - sidebarWidth;

	const valueToPixelsInternal = useCallback(
		(value: number, range: Range) => {
			const start = range.start;
			const end = range.end;

			const valueToPixel = timelineViewportWidth / (end - start);
			return value * valueToPixel;
		},
		[timelineViewportWidth],
	);

	const valueToPixels = useCallback<ValueToPixels>(
		(value: number, customRange?: Range) =>
			valueToPixelsInternal(value, customRange ?? range),
		[valueToPixelsInternal, range],
	);

	const pixelsToValueInternal = useCallback(
		(pixels: number, range: Range) => {
			const start = range.start;
			const end = range.end;

			const pixelToMs = (end - start) / timelineViewportWidth;
			return pixels * pixelToMs;
		},
		[timelineViewportWidth],
	);

	const pixelsToValue = useCallback<PixelsToValue>(
		(pixels: number, customRange?: Range) =>
			pixelsToValueInternal(pixels, customRange ?? range),
		[range, pixelsToValueInternal],
	);

	const getDeltaXFromScreenX = useCallback<GetDeltaXFromScreenX>(
		(screenX) => {
			const side = direction === "rtl" ? "right" : "left";

			const timelineSideX =
				(timelineRef.current?.getBoundingClientRect()[side] || 0) +
				sidebarWidth * (direction === "rtl" ? -1 : 1);

			const deltaX = screenX - timelineSideX;

			return deltaX;
		},
		[timelineRef, sidebarWidth, direction],
	);

	const getValueFromScreenXInternal = useCallback(
		(screenX: number, range: Range) => {
			const deltaX = getDeltaXFromScreenX(screenX);
			const delta =
				pixelsToValueInternal(deltaX, range) * (direction === "rtl" ? -1 : 1);

			return range.start + delta;
		},
		[
			direction,
			pixelsToValueInternal,
			getDeltaXFromScreenX,
		],
	);

	const getValueFromScreenX = useCallback<GetValueFromScreenX>(
		(screenX: number) => getValueFromScreenXInternal(screenX, range),
		[range, getValueFromScreenXInternal],
	);

	const onPanEnd = useCallback<OnPanEnd>(
		(event) => {
			onRangeChanged((prevRange) => {
				const deltaX =
					pixelsToValueInternal(event.deltaX, prevRange) *
					(direction === "rtl" ? -1 : 1);
				const deltaY =
					pixelsToValueInternal(event.deltaY, prevRange) *
					(direction === "rtl" ? -1 : 1);

				const rangeDuration = prevRange.end - prevRange.start;

				const startBias = event.clientX
					? (prevRange.start -
							getValueFromScreenXInternal(event.clientX, prevRange)) /
						rangeDuration
					: 1;
				const endBias = event.clientX
					? (getValueFromScreenXInternal(event.clientX, prevRange) -
							prevRange.end) /
						rangeDuration
					: 1;

				const startDelta = deltaY * startBias + deltaX;
				const endDelta = -deltaY * endBias + deltaX;

				return {
					start: prevRange.start + startDelta,
					end: prevRange.end + endDelta,
				};
			});
		},
		[
			direction,
			pixelsToValueInternal,
			getValueFromScreenXInternal,
			onRangeChanged,
		],
	);

	const value = useMemo<TimelineContext>(
		() => ({
			style,
			range,
			onPanEnd,
			sidebarRef,
			setSidebarRef,
			sidebarWidth,
			pixelsToValue,
			valueToPixels,
			timelineRef,
			setTimelineRef,
			direction,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			onRangeChanged,
		}),
		[
			range,
			onPanEnd,
			sidebarRef,
			setSidebarRef,
			sidebarWidth,
			pixelsToValue,
			valueToPixels,
			timelineRef,
			setTimelineRef,
			direction,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			onRangeChanged
		],
	);

	return value;
};
