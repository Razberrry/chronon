import { hoursToMilliseconds } from "date-fns";
import type { ZoomLimits } from "../types";

export const isZoomGesture = (event: WheelEvent): boolean =>
	event.ctrlKey || event.metaKey;
export const isZoomInAttempt = (event: WheelEvent): boolean =>
	event.deltaY < 0;
export const isZoomOutAttempt = (event: WheelEvent): boolean =>
	event.deltaY > 0;
export type Direction = "rtl" | "ltr";

export const DEFAULT_ZOOM_LIMITS: ZoomLimits = {
	minRangeMilliseconds: hoursToMilliseconds(1),
	maxRangeMilliseconds: hoursToMilliseconds(24 * 7),
};

export const isHitZoomLimitation = (
	event: WheelEvent,
	currentRangeSizeMilliseconds: number,
	direction: CanvasDirection = "rtl",
	limits: ZoomLimits = DEFAULT_ZOOM_LIMITS,
): boolean => {
	const { minRangeMilliseconds, maxRangeMilliseconds } = limits;

	if (direction === "rtl") {
		if (
			isZoomInAttempt(event) &&
			currentRangeSizeMilliseconds < minRangeMilliseconds
		) {
			return true;
		}
		if (
			isZoomOutAttempt(event) &&
			currentRangeSizeMilliseconds > maxRangeMilliseconds
		) {
			return true;
		}
	} else {
		if (
			!isZoomInAttempt(event) &&
			currentRangeSizeMilliseconds < minRangeMilliseconds
		) {
			return true;
		}
		if (
			!isZoomOutAttempt(event) &&
			currentRangeSizeMilliseconds > maxRangeMilliseconds
		) {
			return true;
		}
	}

	return false;
};
