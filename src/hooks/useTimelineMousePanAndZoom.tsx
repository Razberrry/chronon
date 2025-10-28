import { useRef, useLayoutEffect } from "react";

import { isHitZoomLimitation, isZoomGesture } from "./zoomUtils";
import { PanEndEvent } from "../types";
import { useTimelineContext } from "../context/timelineContext";

const SCROLL_SENSITIVITY = 1;


export const buildPanEndEvent = (
  sourceEvent: { clientX: number; clientY: number },
  deltaX: number,
  deltaY: number
): PanEndEvent => ({
  clientX: sourceEvent.clientX,
  clientY: sourceEvent.clientY,
  deltaX,
  deltaY,
});

export const useTimelineMousePanAndZoom = (): void => {
  const { timelineRef, range, onPanEnd, direction, zoomLimits } = useTimelineContext();
  const onPanEndRef = useRef(onPanEnd);
  const rangeRef = useRef({ start: range.start, end: range.end });

  useLayoutEffect(() => {
    onPanEndRef.current = onPanEnd;
  }, [onPanEnd]);

  useLayoutEffect(() => {
    rangeRef.current = { start: range.start, end: range.end };
  }, [range.start, range.end]);

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    let isDragging = false;
    let lastKnownClientX = 0;
    let activePointerId: number | null = null;

    // pointer down when drag starts
    const handlePointerDown = (event: PointerEvent): void => {
      if (event.button !== 0) return;
      timelineElement.setPointerCapture?.(event.pointerId);
      activePointerId = event.pointerId;
      isDragging = true;
      lastKnownClientX = event.clientX;
      timelineElement.style.cursor = "grabbing";
      timelineElement.style.userSelect = "none";
      event.preventDefault();
    };


    // pointer moves when dragging , move left/right
    const handlePointerMove = (event: PointerEvent): void => {
      if (!isDragging) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      const horizontalClientMovement = event.clientX - lastKnownClientX;
      lastKnownClientX = event.clientX;
      onPanEndRef.current(buildPanEndEvent(event, -horizontalClientMovement, 0));
      event.preventDefault();
    };

    // when finish dragging
    const handlePointerEnd = (): void => {
      if (!isDragging) return;
      isDragging = false;
      if (activePointerId !== null) {
        timelineElement.releasePointerCapture?.(activePointerId);
      }
      activePointerId = null;
      timelineElement.style.cursor = "";
      timelineElement.style.userSelect = "";
    };

    // when zooming in/out
    const handleWheel = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
      event.preventDefault();

      const { start, end } = rangeRef.current;
      const currentRangeSizeMilliseconds = end - start;
      if (isHitZoomLimitation(event, currentRangeSizeMilliseconds, direction, zoomLimits )) return;
      onPanEndRef.current(buildPanEndEvent(event, 0, -event.deltaY * SCROLL_SENSITIVITY));
    };

    timelineElement.addEventListener("pointerdown", handlePointerDown, { passive: false });
    timelineElement.addEventListener("pointermove", handlePointerMove, { passive: false });
    timelineElement.addEventListener("pointerup", handlePointerEnd, { passive: false });
    timelineElement.addEventListener("pointercancel", handlePointerEnd, { passive: false });
    timelineElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      timelineElement.removeEventListener("pointerdown", handlePointerDown);
      timelineElement.removeEventListener("pointermove", handlePointerMove);
      timelineElement.removeEventListener("pointerup", handlePointerEnd);
      timelineElement.removeEventListener("pointercancel", handlePointerEnd);
      timelineElement.removeEventListener("wheel", handleWheel);
      timelineElement.style.cursor = "";
      timelineElement.style.userSelect = "";
    };
  }, [timelineRef, direction, zoomLimits]);
};
