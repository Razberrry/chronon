import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";

import type {
	GetDeltaXFromScreenX,
	GetValueFromScreenX,
	OnPanEnd,
	PixelsToValue,
	Range,
	TimelineBag,
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


export const useTimeline = (
	{
		range,
		onRangeChanged,
		rangeGridSizeDefinition,
	}: UseTimelineProps
): TimelineBag => {
	const rangeStart = range.start;
	const rangeEnd = range.end;

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

	const rangeGridSize = useMemo(() => {
		if (Array.isArray(rangeGridSizeDefinition)) {
			const gridSizes = rangeGridSizeDefinition;

			const rangeSize = rangeEnd - rangeStart;

			const sortedRangeGridSizes = [...gridSizes];
			sortedRangeGridSizes.sort((a, b) => a.value - b.value);

			return sortedRangeGridSizes.find(
				(curr) => !curr.maxRangeSize || rangeSize < curr.maxRangeSize,
			)?.value;
		}

		return rangeGridSizeDefinition;
	}, [rangeStart, rangeEnd, rangeGridSizeDefinition]);

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

	const snapValueToRangeGrid = useCallback(
		(value: number) => {
			if (!rangeGridSize) return value;

			return Math.round(value / rangeGridSize) * rangeGridSize;
		},
		[rangeGridSize],
	);

	const getValueFromScreenXInternal = useCallback(
		(screenX: number, range: Range) => {
			const deltaX = getDeltaXFromScreenX(screenX);
			const delta =
				pixelsToValueInternal(deltaX, range) * (direction === "rtl" ? -1 : 1);

			return snapValueToRangeGrid(range.start + delta);
		},
		[
			direction,
			pixelsToValueInternal,
			getDeltaXFromScreenX,
			snapValueToRangeGrid,
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

	const value = useMemo<TimelineBag>(
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
			rangeGridSize,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			onRangeChanged
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
			rangeGridSize,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			onRangeChanged
		],
	);

	return value;
};
