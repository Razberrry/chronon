import { useCallback } from "react";

import type { OnPanEnd, TimelinePanOptions } from "../types";

export const useTimelinePan = ({
  directionSign,
  pixelsToSpan,
  getSpanFromScreenXForRange,
  onRangeChanged,
}: TimelinePanOptions): OnPanEnd =>
  useCallback<OnPanEnd>(
    (event) => {
      onRangeChanged((prevRange) => {
        const applyDirection = (delta: number) =>
          pixelsToSpan(delta, prevRange) * directionSign;

        const deltaX = applyDirection(event.deltaX);
        const deltaY = applyDirection(event.deltaY);

        const rangeDuration = Math.max(1, prevRange.end - prevRange.start);

        const pointerValue =
          event.clientX !== undefined
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

        return {
          start: prevRange.start + startDelta,
          end: prevRange.end + endDelta,
        };
      });
    },
    [directionSign, pixelsToSpan, getSpanFromScreenXForRange, onRangeChanged],
  );
