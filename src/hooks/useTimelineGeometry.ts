import { useElementRef } from "./useElementRef";
import type { TimelineGeometry } from "../types";

export const useTimelineGeometry = (): TimelineGeometry => {
  const {
    ref: timelineRef,
    setRef: setTimelineRef,
    width: timelineWidth,
    direction,
  } = useElementRef();

  const {
    ref: sidebarRef,
    setRef: setSidebarRef,
    width: sidebarWidth,
  } = useElementRef();

  const viewportWidth = Math.max(1, timelineWidth - sidebarWidth);
  const directionSign = direction === "rtl" ? -1 : 1;

  return {
    timelineRef,
    setTimelineRef,
    sidebarRef,
    setSidebarRef,
    sidebarWidth,
    direction,
    directionSign,
    viewportWidth,
  };
};
