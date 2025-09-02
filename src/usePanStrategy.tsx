import { PanEndEvent, UsePanStrategy } from "dnd-timeline";
import { useLayoutEffect, useRef } from "react";
import { hoursToMilliseconds, minutesToMilliseconds } from "date-fns";

const buildPanEndEvent = (
  sourceEvent: { clientX: number; clientY: number },
  deltaX: number,
  deltaY: number
): PanEndEvent => ({
  clientX: sourceEvent.clientX,
  clientY: sourceEvent.clientY,
  deltaX,
  deltaY,
});

const isZoomGesture = (event: WheelEvent): boolean => event.ctrlKey || event.metaKey;
const isZoomInAttempt = (event: WheelEvent): boolean => event.deltaY < 0;
const MINIMUM_RANGE_MILLISECONDS = minutesToMilliseconds(60);

export const usePanStrategy: UsePanStrategy = (timelineBag, onPanEnd) => {
  const onPanEndRef = useRef(onPanEnd);
  const rangeRef = useRef({ start: timelineBag.range.start, end: timelineBag.range.end });

  useLayoutEffect(() => {
    onPanEndRef.current = onPanEnd;
  }, [onPanEnd]);

  useLayoutEffect(() => {
    rangeRef.current = { start: timelineBag.range.start, end: timelineBag.range.end };
  }, [timelineBag.range.start, timelineBag.range.end]);

  useLayoutEffect(() => {
    const timelineElement = timelineBag.timelineRef.current;
    if (!timelineElement) return;

    let isDragging = false;
    let lastKnownClientX = 0;
    let activePointerId: number | null = null;

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

    const handlePointerMove = (event: PointerEvent): void => {
      if (!isDragging) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      const horizontalClientMovement = event.clientX - lastKnownClientX;
      lastKnownClientX = event.clientX;
      onPanEndRef.current(buildPanEndEvent(event, -horizontalClientMovement, 0));
      event.preventDefault();
    };

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

    const handleWheel = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
      event.preventDefault();
      const { start, end } = rangeRef.current;
      const currentRangeSizeMilliseconds = end - start;
      if (isZoomInAttempt(event) && currentRangeSizeMilliseconds < MINIMUM_RANGE_MILLISECONDS) return;
      onPanEndRef.current(buildPanEndEvent(event, 0, -event.deltaY*SCROLL_SENSITIVITY));
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
  }, [timelineBag.timelineRef]);
};
