import { useMemo } from "react";
import type { MutableRefObject } from "react";

import type {
  GetDeltaXFromScreenX,
  GetSpanFromScreenX,
  GetSpanFromScreenXForRange,
  PixelsToSpan,
  Range,
  SpanToPixels,
  TimelineConversions,
} from "../types";

interface UseTimelineConversionsParams {
  range: Range;
  direction: CanvasDirection;
  directionSign: number;
  timelineRef: MutableRefObject<HTMLElement | null>;
  viewportRef: MutableRefObject<HTMLElement | null>;
  sidebarWidth: number;
  viewportWidth: number;
}

export const useTimelineConversions = ({
  range,
  direction,
  directionSign,
  timelineRef,
  viewportRef,
  sidebarWidth,
  viewportWidth,
}: UseTimelineConversionsParams): TimelineConversions =>
  useMemo<TimelineConversions>(() => {
    const safeViewport = Math.max(1, viewportWidth);
    const sideName = direction === "rtl" ? "right" : "left";
    const sidebarOffset = sidebarWidth * directionSign;

    const duration = (targetRange: Range) =>
      Math.max(1, targetRange.end - targetRange.start);

    const spanToPixels: SpanToPixels = (span, customRange = range) =>
      span * (safeViewport / duration(customRange));

    const pixelsToSpan: PixelsToSpan = (pixels, customRange = range) =>
      pixels * (duration(customRange) / safeViewport);

    const getDeltaXFromScreenX: GetDeltaXFromScreenX = (screenX) => {
      const viewportElement = viewportRef.current;
      if (viewportElement) {
        const viewportRect = viewportElement.getBoundingClientRect();
        return screenX - viewportRect[sideName];
      }

      const base =
        timelineRef.current?.getBoundingClientRect()[sideName] ?? 0;
      return screenX - (base + sidebarOffset);
    };

    const getSpanFromScreenXForRange: GetSpanFromScreenXForRange = (
      screenX,
      customRange,
    ) => {
      const deltaX = getDeltaXFromScreenX(screenX);
      const delta = pixelsToSpan(deltaX, customRange) * directionSign;
      return customRange.start + delta;
    };

    const getSpanFromScreenX: GetSpanFromScreenX = (screenX: number) =>
      getSpanFromScreenXForRange(screenX, range);

    return {
      spanToPixels,
      pixelsToSpan,
      getDeltaXFromScreenX,
      getSpanFromScreenX,
      getSpanFromScreenXForRange,
    };
  }, [
    range,
    direction,
    directionSign,
    timelineRef,
    viewportRef,
    sidebarWidth,
    viewportWidth,
  ]);
