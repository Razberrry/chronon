import { useMemo } from "react";
import type { MutableRefObject } from "react";

import type {
  GetDeltaXFromScreenX,
  PixelsToSpan,
  Range,
  SpanToPixels,
} from "../types";

export type GetSpanFromScreenXForRange = (
  screenX: number,
  customRange: Range,
) => number;

export interface TimelineConversions {
  spanToPixels: SpanToPixels;
  pixelsToSpan: PixelsToSpan;
  getDeltaXFromScreenX: GetDeltaXFromScreenX;
  getSpanFromScreenX: (screenX: number) => number;
  getSpanFromScreenXForRange: GetSpanFromScreenXForRange;
}

interface UseTimelineConversionsParams {
  range: Range;
  direction: CanvasDirection;
  directionSign: number;
  timelineRef: MutableRefObject<HTMLElement | null>;
  sidebarWidth: number;
  viewportWidth: number;
}

export const useTimelineConversions = ({
  range,
  direction,
  directionSign,
  timelineRef,
  sidebarWidth,
  viewportWidth,
}: UseTimelineConversionsParams): TimelineConversions =>
  useMemo(() => {
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

    const getSpanFromScreenX = (screenX: number) =>
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
    sidebarWidth,
    viewportWidth,
  ]);
