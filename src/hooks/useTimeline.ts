import type { TimelineContext, UseTimelineProps } from "../types";

import { useTimelineConversions } from "./useTimelineConversions";
import { useTimelineGeometry } from "./useTimelineGeometry";
import { useTimelinePan } from "./useTimelinePan";

export const useTimeline = ({
  range,
  onRangeChanged,
}: UseTimelineProps): TimelineContext => {
  const {
    timelineRef,
    setTimelineRef,
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
    sidebarWidth,
    viewportWidth,
  });

  const onPanEnd = useTimelinePan({
    directionSign,
    pixelsToSpan,
    getSpanFromScreenXForRange,
    onRangeChanged,
  });

  return {
    range,
    onPanEnd,
    sidebarRef,
    setSidebarRef,
    sidebarWidth,
    pixelsToSpan,
    spanToPixels,
    timelineRef,
    setTimelineRef,
    direction,
    getSpanFromScreenX,
    getDeltaXFromScreenX,
    onRangeChanged,
  };
};
