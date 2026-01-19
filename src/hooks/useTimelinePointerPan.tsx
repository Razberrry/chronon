import { useLayoutEffect } from "react";

import { useTimelineContext } from "../context/timelineContext";

const DRAG_THRESHOLD_PX = 3;

type DragPhase = "idle" | "pressed" | "dragging";

interface PointerPanQueue {
  enqueuePanEnd: (
    sourceEvent: { clientX: number; clientY: number },
    deltaX: number,
    deltaY: number
  ) => void;
  flushPanEnd: () => void;
}

export const useTimelinePointerPan = ({
  enqueuePanEnd,
  flushPanEnd,
}: PointerPanQueue): void => {
  const { timelineRef } = useTimelineContext();

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    let phase: DragPhase = "idle";
    let activePointerId: number | null = null;
    let pointerDownClientX = 0;
    let lastKnownClientX = 0;
    let suppressNextClick = false;

    const setDraggingStyles = (enabled: boolean): void => {
      timelineElement.style.cursor = enabled ? "grabbing" : "";
      timelineElement.style.userSelect = enabled ? "none" : "";
    };

    const isActivePointerEvent = (event: PointerEvent): boolean =>
      activePointerId === null || event.pointerId === activePointerId;

    const isMousePrimaryButtonDown = (event: PointerEvent): boolean =>
      event.pointerType !== "mouse" || (event.buttons & 1) !== 0;

    const detachWindowListeners = (): void => {
      window.removeEventListener("pointerup", handlePointerEndEvent, true);
      window.removeEventListener("pointercancel", handlePointerEndEvent, true);
      window.removeEventListener("pointermove", handleWindowPointerMove, true);
      window.removeEventListener("mouseout", handleWindowMouseOut, true);
      window.removeEventListener("blur", handleWindowBlur);
    };

    const attachWindowListeners = (): void => {
      window.addEventListener("pointerup", handlePointerEndEvent, true);
      window.addEventListener("pointercancel", handlePointerEndEvent, true);
      window.addEventListener("pointermove", handleWindowPointerMove, true);
      window.addEventListener("mouseout", handleWindowMouseOut, true);
      window.addEventListener("blur", handleWindowBlur);
    };

    const endPointerSession = (): void => {
      if (phase === "idle") return;

      const wasDragging = phase === "dragging";
      phase = "idle";

      flushPanEnd();
      detachWindowListeners();

      if (activePointerId !== null) {
        try {
          timelineElement.releasePointerCapture?.(activePointerId);
        } catch {}
      }

      activePointerId = null;
      setDraggingStyles(false);

      if (wasDragging) {
        suppressNextClick = true;
      }
    };

    const endSessionIfMouseReleased = (event: PointerEvent): boolean => {
      if (phase === "idle") return false;
      if (!isActivePointerEvent(event)) return false;
      if (isMousePrimaryButtonDown(event)) return false;
      endPointerSession();
      return true;
    };

    function handlePointerDown(event: PointerEvent): void {
      if (event.button !== 0) return;
      if (phase !== "idle") return;

      suppressNextClick = false;
      phase = "pressed";
      activePointerId = event.pointerId;
      pointerDownClientX = event.clientX;
      lastKnownClientX = event.clientX;

      attachWindowListeners();
    }

    function handlePointerEnter(event: PointerEvent): void {
      endSessionIfMouseReleased(event);
    }

    function handlePointerMove(event: PointerEvent): void {
      if (phase === "idle") return;
      if (!isActivePointerEvent(event)) return;
      if (endSessionIfMouseReleased(event)) return;

      const nextClientX = event.clientX;
      const deltaX = nextClientX - lastKnownClientX;

      if (phase === "pressed") {
        const movementFromPress = nextClientX - pointerDownClientX;
        if (Math.abs(movementFromPress) < DRAG_THRESHOLD_PX) {
          lastKnownClientX = nextClientX;
          return;
        }

        phase = "dragging";
        try {
          timelineElement.setPointerCapture?.(event.pointerId);
        } catch {
          // ignore
        }
        setDraggingStyles(true);
      }

      lastKnownClientX = nextClientX;
      enqueuePanEnd(event, -deltaX, 0);
      event.preventDefault();
    }

    function handlePointerEndEvent(event: PointerEvent): void {
      if (phase === "idle") return;
      if (!isActivePointerEvent(event)) return;
      endPointerSession();
    }

    function handleWindowPointerMove(event: PointerEvent): void {
      endSessionIfMouseReleased(event);
    }

    function handleWindowMouseOut(event: MouseEvent): void {
      if (phase === "idle") return;
      if (event.relatedTarget !== null) return;
      endPointerSession();
    }

    function handleWindowBlur(): void {
      endPointerSession();
    }

    function handleClickCapture(event: MouseEvent): void {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      event.stopPropagation();
      event.preventDefault();
    }

    timelineElement.addEventListener("pointerdown", handlePointerDown, {
      passive: false,
    });
    timelineElement.addEventListener("pointerenter", handlePointerEnter);
    timelineElement.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    timelineElement.addEventListener("pointerup", handlePointerEndEvent);
    timelineElement.addEventListener("pointercancel", handlePointerEndEvent);
    timelineElement.addEventListener(
      "lostpointercapture",
      handlePointerEndEvent
    );
    timelineElement.addEventListener("click", handleClickCapture, true);

    return () => {
      endPointerSession();
      timelineElement.removeEventListener("pointerdown", handlePointerDown);
      timelineElement.removeEventListener("pointerenter", handlePointerEnter);
      timelineElement.removeEventListener("pointermove", handlePointerMove);
      timelineElement.removeEventListener("pointerup", handlePointerEndEvent);
      timelineElement.removeEventListener(
        "pointercancel",
        handlePointerEndEvent
      );
      timelineElement.removeEventListener(
        "lostpointercapture",
        handlePointerEndEvent
      );
      timelineElement.removeEventListener("click", handleClickCapture, true);
      setDraggingStyles(false);
    };
  }, [timelineRef, enqueuePanEnd, flushPanEnd]);
};
