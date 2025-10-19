import { hoursToMilliseconds } from "date-fns";

export const isZoomGesture = (event: WheelEvent): boolean => event.ctrlKey || event.metaKey;
export const isZoomInAttempt = (event: WheelEvent): boolean => event.deltaY < 0;
export const isZoomOutAttempt = (event: WheelEvent): boolean => event.deltaY > 0;
export type Direction = 'rtl' | 'ltr';

const MIN_ZOOM_RANGE_MILLISECONDS = hoursToMilliseconds(1);
const MAX_ZOOM_RANGE_MILLISECONDS = hoursToMilliseconds(24 * 7);

export const isHitZoomLimitation = (
  event: WheelEvent,
  currentRangeSizeMilliseconds: number,
  direction: CanvasDirection = 'rtl',
): boolean => {
  if (direction === 'rtl') {
    if (isZoomInAttempt(event) && currentRangeSizeMilliseconds < MIN_ZOOM_RANGE_MILLISECONDS) {
      return true;
    }
    if (isZoomOutAttempt(event) && currentRangeSizeMilliseconds > MAX_ZOOM_RANGE_MILLISECONDS) {
      return true;
    }
  } else {
    if (!isZoomInAttempt(event) && currentRangeSizeMilliseconds < MIN_ZOOM_RANGE_MILLISECONDS) {
      return true;
    }
    if (!isZoomOutAttempt(event) && currentRangeSizeMilliseconds > MAX_ZOOM_RANGE_MILLISECONDS) {
      return true;
    }
  }

  return false;
};