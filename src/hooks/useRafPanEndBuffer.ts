import { useCallback, useLayoutEffect, useRef } from "react";

import type { OnPanEnd, PanEndEvent } from "../types";

type PanSourceEvent = { clientX: number; clientY: number };

export const buildPanEndEvent = (
  sourceEvent: PanSourceEvent,
  deltaX: number,
  deltaY: number
): PanEndEvent => ({
  clientX: sourceEvent.clientX,
  clientY: sourceEvent.clientY,
  deltaX,
  deltaY,
});

interface RafPanEndBuffer {
  enqueuePanEnd: (
    sourceEvent: PanSourceEvent,
    deltaX: number,
    deltaY: number
  ) => void;
  flushPanEnd: () => void;
}

export const useRafPanEndBuffer = (
  onPanEnd: OnPanEnd
): RafPanEndBuffer => {
  const latestOnPanEndRef = useRef(onPanEnd);
  const pendingPanEndEventRef = useRef<PanEndEvent | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    latestOnPanEndRef.current = onPanEnd;
  }, [onPanEnd]);

  const dispatchPendingPanEnd = useCallback((): void => {
    const pendingEvent = pendingPanEndEventRef.current;
    if (!pendingEvent) return;

    pendingPanEndEventRef.current = null;
    latestOnPanEndRef.current(pendingEvent);
  }, []);

  const flushPanEnd = useCallback((): void => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    dispatchPendingPanEnd();
  }, [dispatchPendingPanEnd]);

  const schedulePanEndDispatch = useCallback((): void => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      dispatchPendingPanEnd();
    });
  }, [dispatchPendingPanEnd]);

  const enqueuePanEnd = useCallback(
    (sourceEvent: PanSourceEvent, deltaX: number, deltaY: number): void => {
      const pendingEvent = pendingPanEndEventRef.current;
      if (pendingEvent) {
        pendingEvent.deltaX += deltaX;
        pendingEvent.deltaY += deltaY;
        pendingEvent.clientX = sourceEvent.clientX;
        pendingEvent.clientY = sourceEvent.clientY;
      } else {
        pendingPanEndEventRef.current = buildPanEndEvent(sourceEvent, deltaX, deltaY);
      }

      schedulePanEndDispatch();
    },
    [schedulePanEndDispatch]
  );

  useLayoutEffect(() => {
    return () => {
      flushPanEnd();
    };
  }, [flushPanEnd]);

  return { enqueuePanEnd, flushPanEnd };
};
