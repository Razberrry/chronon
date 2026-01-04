import { useRef, useLayoutEffect } from "react";

import { isHitZoomLimitation, isZoomGesture } from "./zoomUtils";
import { PanEndEvent } from "../types";
import { useTimelineContext } from "../context/timelineContext";

const SCROLL_SENSITIVITY = 1;
const DRAG_THRESHOLD_PX = 3;

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
  const { timelineRef, range, onPanEnd, direction, zoomLimits } =
    useTimelineContext();
  const onPanEndRef = useRef(onPanEnd);
  const rangeRef = useRef({ start: range.start, end: range.end });
  const pendingPanEndRef = useRef<PanEndEvent | null>(null);
  const frameRequestIdRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    onPanEndRef.current = onPanEnd;
  }, [onPanEnd]);

  useLayoutEffect(() => {
    rangeRef.current = { start: range.start, end: range.end };
  }, [range.start, range.end]);

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    let isPointerActive = false;
    let dragStarted = false;
    let lastKnownClientX = 0;
    let activePointerId: number | null = null;
    let pointerDownClientX = 0;
    let hasPointerCapture = false;
    let shouldSuppressNextClick = false;
    let hasGlobalPointerListeners = false;

    const enableDragStyles = (): void => {
      timelineElement.style.cursor = "grabbing";
      timelineElement.style.userSelect = "none";
    };

    const disableDragStyles = (): void => {
      timelineElement.style.cursor = "";
      timelineElement.style.userSelect = "";
    };

    const flushPendingPanEvent = () => {
      if (frameRequestIdRef.current !== null) {
        window.cancelAnimationFrame(frameRequestIdRef.current);
        frameRequestIdRef.current = null;
      }
      const pendingEvent = pendingPanEndRef.current;
      if (!pendingEvent) return;
      pendingPanEndRef.current = null;
      onPanEndRef.current(pendingEvent);
    };

    const queuePanEnd = (
      sourceEvent: { clientX: number; clientY: number },
      deltaX: number,
      deltaY: number
    ) => {
      const pending = pendingPanEndRef.current;
      if (pending) {
        pending.deltaX += deltaX;
        pending.deltaY += deltaY;
        pending.clientX = sourceEvent.clientX;
        pending.clientY = sourceEvent.clientY;
      } else {
        pendingPanEndRef.current = buildPanEndEvent(sourceEvent, deltaX, deltaY);
      }

      if (frameRequestIdRef.current !== null) return;

      frameRequestIdRef.current = window.requestAnimationFrame(() => {
        frameRequestIdRef.current = null;
        const nextEvent = pendingPanEndRef.current;
        if (!nextEvent) return;
        pendingPanEndRef.current = null;
        onPanEndRef.current(nextEvent);
      });
    };

    const detachGlobalPointerListeners = (): void => {
      if (!hasGlobalPointerListeners) return;
      hasGlobalPointerListeners = false;
      window.removeEventListener("pointerup", handleWindowPointerUp, true);
      window.removeEventListener(
        "pointercancel",
        handleWindowPointerCancel,
        true
      );
      window.removeEventListener("pointermove", handleWindowPointerMove, true);
      window.removeEventListener("blur", handleWindowBlur);
    };

    const attachGlobalPointerListeners = (): void => {
      if (hasGlobalPointerListeners) return;
      hasGlobalPointerListeners = true;
      window.addEventListener("pointerup", handleWindowPointerUp, true);
      window.addEventListener(
        "pointercancel",
        handleWindowPointerCancel,
        true
      );
      window.addEventListener("pointermove", handleWindowPointerMove, true);
      window.addEventListener("blur", handleWindowBlur);
    };

    const beginDragging = () => {
      if (dragStarted || activePointerId === null) return;
      dragStarted = true;
      if (!hasPointerCapture) {
        try {
          timelineElement.setPointerCapture?.(activePointerId);
          hasPointerCapture = true;
        } catch {
          hasPointerCapture = false;
        }
      }
      enableDragStyles();
    };

    const handlePointerEnd = (): void => {
      if (!isPointerActive) return;
      const wasDragging = dragStarted;
      isPointerActive = false;
      dragStarted = false;
      flushPendingPanEvent();
      detachGlobalPointerListeners();
      if (hasPointerCapture && activePointerId !== null) {
        try {
          timelineElement.releasePointerCapture?.(activePointerId);
        } catch {
          // ignore
        }
      }
      hasPointerCapture = false;
      activePointerId = null;
      disableDragStyles();
      if (wasDragging) {
        shouldSuppressNextClick = true;
      }
    };

    const handleLostPointerCapture = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      handlePointerEnd();
    };

    const handleWindowPointerUp = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      handlePointerEnd();
    };

    const handleWindowPointerCancel = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      handlePointerEnd();
    };

    const handleWindowPointerMove = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        handlePointerEnd();
      }
    };

    const handleWindowBlur = (): void => {
      handlePointerEnd();
    };

    // pointer down when drag starts
    const handlePointerDown = (event: PointerEvent): void => {
      if (event.button !== 0) return;
      shouldSuppressNextClick = false;
      activePointerId = event.pointerId;
      isPointerActive = true;
      dragStarted = false;
      hasPointerCapture = false;
      lastKnownClientX = event.clientX;
      pointerDownClientX = event.clientX;
      attachGlobalPointerListeners();
    };

    const handlePointerEnter = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        handlePointerEnd();
      }
    };

    // pointer moves when dragging , move left/right
    const handlePointerMove = (event: PointerEvent): void => {
      if (!isPointerActive) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
        handlePointerEnd();
        return;
      }
      const nextClientX = event.clientX;
      const horizontalClientMovement = nextClientX - lastKnownClientX;

      if (!dragStarted) {
        const movementFromOrigin = nextClientX - pointerDownClientX;
        if (Math.abs(movementFromOrigin) < DRAG_THRESHOLD_PX) {
          lastKnownClientX = nextClientX;
          return;
        }
        beginDragging();
      }

      lastKnownClientX = nextClientX;
      queuePanEnd(event, -horizontalClientMovement, 0);
      event.preventDefault();
    };

    const handleClickCapture = (event: MouseEvent): void => {
      if (!shouldSuppressNextClick) return;
      shouldSuppressNextClick = false;
      event.stopPropagation();
      event.preventDefault();
    };

    // when zooming in/out
    const handleWheel = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
      event.preventDefault();

      const { start, end } = rangeRef.current;
      const currentRangeSizeMilliseconds = end - start;
      if (isHitZoomLimitation(event, currentRangeSizeMilliseconds, direction, zoomLimits )) return;
      queuePanEnd(event, 0, -event.deltaY * SCROLL_SENSITIVITY);
    };

    timelineElement.addEventListener("pointerdown", handlePointerDown, { passive: false });
    timelineElement.addEventListener("pointerenter", handlePointerEnter);
    timelineElement.addEventListener("pointermove", handlePointerMove, { passive: false });
    timelineElement.addEventListener("pointerup", handlePointerEnd, { passive: false });
    timelineElement.addEventListener("pointercancel", handlePointerEnd, { passive: false });
    timelineElement.addEventListener("lostpointercapture", handleLostPointerCapture);
    timelineElement.addEventListener("wheel", handleWheel, { passive: false });
    timelineElement.addEventListener("click", handleClickCapture, true);

    return () => {
      timelineElement.removeEventListener("pointerdown", handlePointerDown);
      timelineElement.removeEventListener("pointerenter", handlePointerEnter);
      timelineElement.removeEventListener("pointermove", handlePointerMove);
      timelineElement.removeEventListener("pointerup", handlePointerEnd);
      timelineElement.removeEventListener("pointercancel", handlePointerEnd);
      timelineElement.removeEventListener("lostpointercapture", handleLostPointerCapture);
      timelineElement.removeEventListener("wheel", handleWheel);
      timelineElement.removeEventListener("click", handleClickCapture, true);
      timelineElement.style.cursor = "";
      timelineElement.style.userSelect = "";
      detachGlobalPointerListeners();
      flushPendingPanEvent();
    };
  }, [timelineRef, direction, zoomLimits]);
};
