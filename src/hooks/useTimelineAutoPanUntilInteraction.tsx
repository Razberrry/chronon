import { useLayoutEffect, useRef } from "react";
import { isZoomGesture} from "./zoomUtils";
import { useTimelineContext } from "./useTimelineContext";




const AUTOPAN_INTERVAL_MILLISECONDS = 1000;


export const useTimelineAutoPanUntilInteraction = (): void => {
  const { timelineRef, onRangeChanged } = useTimelineContext();

  const hasUserInteractedRef = useRef(false);
  const autopanTimerIdRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const stopAutopan = (): void => {
      if (autopanTimerIdRef.current !== null) {
        window.clearInterval(autopanTimerIdRef.current);
        autopanTimerIdRef.current = null;
      }
      hasUserInteractedRef.current = true;
    };

    const startAutopanIfNeeded = (): void => {
      if (hasUserInteractedRef.current) return;
      if (autopanTimerIdRef.current !== null) return;

      autopanTimerIdRef.current = window.setInterval(() => {
        onRangeChanged((previousRange) => {
          const newRange = {
            start: previousRange.start + AUTOPAN_INTERVAL_MILLISECONDS,
            end: previousRange.end + AUTOPAN_INTERVAL_MILLISECONDS,
          };
          return newRange;
        });
      }, AUTOPAN_INTERVAL_MILLISECONDS);
    };

    startAutopanIfNeeded();

    const handlePointerDown = (): void => {
      stopAutopan();
    };

    const handleWheelToStopOnZoomOut = (event: WheelEvent): void => {
      if (!isZoomGesture(event)) return;
        stopAutopan();
    };

    timelineElement.addEventListener("pointerdown", handlePointerDown, { passive: true });
    timelineElement.addEventListener("wheel", handleWheelToStopOnZoomOut, { passive: true });

    return () => {
      timelineElement.removeEventListener("pointerdown", handlePointerDown);
      timelineElement.removeEventListener("wheel", handleWheelToStopOnZoomOut);
      if (autopanTimerIdRef.current !== null) {
        window.clearInterval(autopanTimerIdRef.current);
        autopanTimerIdRef.current = null;
      }
    };
  }, [timelineRef, onRangeChanged]);
};