import { useCallback } from "react";

import type { OnPanEnd, TimelinePanOptions } from "../types";

export const useTimelinePan = ({
  directionSign,
  pixelsToSpan,
  getSpanFromScreenXForRange,
  setRange,
  zoomLimits,
}: TimelinePanOptions): OnPanEnd =>
  useCallback<OnPanEnd>(
    (event) => {
      setRange((prevRange) => {
        const applyDirection = (delta: number) =>
          pixelsToSpan(delta, prevRange) * directionSign;

        const deltaX = applyDirection(event.deltaX);
        let deltaY = applyDirection(event.deltaY);

        const rangeDuration = Math.max(1, prevRange.end - prevRange.start);

        if (event.deltaY !== 0) {
          const unclampedDuration = rangeDuration + deltaY;
          const clampedDuration = Math.min(
            Math.max(unclampedDuration, zoomLimits.minRangeMilliseconds),
            zoomLimits.maxRangeMilliseconds
          );
          deltaY += clampedDuration - unclampedDuration;
        }

        const pointerValue =
          event.deltaY !== 0 && event.clientX !== undefined
            ? getSpanFromScreenXForRange(event.clientX, prevRange)
            : undefined;

        const startBias =
          pointerValue !== undefined
            ? (prevRange.start - pointerValue) / rangeDuration
            : 1;
        const endBias =
          pointerValue !== undefined
            ? (pointerValue - prevRange.end) / rangeDuration
            : 1;

        const startDelta = deltaY * startBias + deltaX;
        const endDelta = -deltaY * endBias + deltaX;

        const nextRange = {
          start: prevRange.start + startDelta,
          end: prevRange.end + endDelta,
        };

        if (
          nextRange.start === prevRange.start &&
          nextRange.end === prevRange.end
        ) {
          return prevRange;
        }

        const nextDuration = nextRange.end - nextRange.start;

        if (nextDuration < zoomLimits.minRangeMilliseconds) {
          const adjustment = zoomLimits.minRangeMilliseconds - nextDuration;
          const halfAdjustment = adjustment / 2;
          return {
            start: nextRange.start - halfAdjustment,
            end: nextRange.end + halfAdjustment,
          };
        }

        if (nextDuration > zoomLimits.maxRangeMilliseconds) {
          const adjustment = nextDuration - zoomLimits.maxRangeMilliseconds;
          const halfAdjustment = adjustment / 2;
          return {
            start: nextRange.start + halfAdjustment,
            end: nextRange.end - halfAdjustment,
          };
        }

        return nextRange;
      });
    },
    [
      directionSign,
      pixelsToSpan,
      getSpanFromScreenXForRange,
      setRange,
      zoomLimits,
    ]
  );
