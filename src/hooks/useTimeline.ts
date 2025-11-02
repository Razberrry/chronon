import { useMemo } from "react";

import type { TimelineContext, UseTimelineProps, ZoomLimits } from "../types";

import { useTimelineConversions } from "./useTimelineConversions";
import { useTimelineGeometry } from "./useTimelineGeometry";
import { useTimelinePan } from "./useTimelinePan";
import { DEFAULT_ZOOM_LIMITS } from "./zoomUtils";

export const useTimeline = ({
  range,
  onRangeChanged,
  zoomLimits: zoomLimitsConfig,
}: UseTimelineProps): TimelineContext => {
  const {
    timelineRef,
    setTimelineRef,
    viewportRef,
    setViewportRef,
    sidebarRef,
    setSidebarRef,
    sidebarWidth,
    direction,
    directionSign,
    viewportWidth,
  } = useTimelineGeometry();

  const {
    spanToPixels,
    pixelsToSpan,
    getDeltaXFromScreenX,
    getSpanFromScreenX,
    getSpanFromScreenXForRange,
  } = useTimelineConversions({
    range,
    direction,
    directionSign,
    timelineRef,
    viewportRef,
    sidebarWidth,
    viewportWidth,
  });

  const zoomLimits = useMemo<ZoomLimits>(() => {
    const min =
      zoomLimitsConfig?.minRangeMilliseconds ??
      DEFAULT_ZOOM_LIMITS.minRangeMilliseconds;
    const max =
      zoomLimitsConfig?.maxRangeMilliseconds ??
      DEFAULT_ZOOM_LIMITS.maxRangeMilliseconds;

    const safeMin = Math.max(1, min);
    const safeMax = Math.max(safeMin, max);

    return {
      minRangeMilliseconds: safeMin,
      maxRangeMilliseconds: safeMax,
    };
  }, [
    zoomLimitsConfig?.minRangeMilliseconds,
    zoomLimitsConfig?.maxRangeMilliseconds,
  ]);

  const onPanEnd = useTimelinePan({
    directionSign,
    pixelsToSpan,
    getSpanFromScreenXForRange,
    onRangeChanged,
    zoomLimits,
  });

  return {
    range,
    direction,
    timelineRef,
    setTimelineRef,
    viewportRef,
    setViewportRef,
    viewportWidth,
    sidebarRef,
    setSidebarRef,
    sidebarWidth,
    spanToPixels,
    pixelsToSpan,
    getSpanFromScreenX,
    getDeltaXFromScreenX,
    onPanEnd,
    onRangeChanged,
    zoomLimits,
  };
};
