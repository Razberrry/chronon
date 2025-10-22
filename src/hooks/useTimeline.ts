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
    direction,
    timelineRef,
    setTimelineRef,
    sidebarRef,
    setSidebarRef,
    sidebarWidth,
    spanToPixels,
    pixelsToSpan,
    getSpanFromScreenX,
    getDeltaXFromScreenX,
    onPanEnd,
    onRangeChanged,
  };
};
