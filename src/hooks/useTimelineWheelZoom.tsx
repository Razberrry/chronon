import { useLayoutEffect, useRef } from "react";

import { isHitZoomLimitation, isZoomGesture } from "./zoomUtils";
import { useTimelineContext } from "../context/timelineContext";

const SCROLL_SENSITIVITY = 1;

interface WheelZoomQueue {
  enqueuePanEnd: (
    sourceEvent: { clientX: number; clientY: number },
    deltaX: number,
    deltaY: number
  ) => void;
}

export const useTimelineWheelZoom = ({ enqueuePanEnd }: WheelZoomQueue): void => {
  const { timelineRef, range, direction, zoomLimits } = useTimelineContext();
  const rangeRef = useRef(range);

  useLayoutEffect(() => {
    rangeRef.current = range;
  }, [range]);

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const handleWheel = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
      event.preventDefault();

      const { start, end } = rangeRef.current;
      const currentRangeSizeMilliseconds = end - start;
      if (
        isHitZoomLimitation(
          event,
          currentRangeSizeMilliseconds,
          direction,
          zoomLimits
        )
      ) {
        return;
      }

      enqueuePanEnd(event, 0, -event.deltaY * SCROLL_SENSITIVITY);
    };

    timelineElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      timelineElement.removeEventListener("wheel", handleWheel);
    };
  }, [timelineRef, direction, zoomLimits, enqueuePanEnd]);
};
