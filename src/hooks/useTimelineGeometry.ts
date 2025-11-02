import { TimelineGeometry } from "../types/index";
import { useElementRef } from "./useElementRef";

export const useTimelineGeometry = (): TimelineGeometry => {
  const {
    ref: timelineRef,
    setRef: setTimelineRef,
    direction,
  } = useElementRef();

  const {
    ref: viewportRef,
    setRef: setViewportRef,
    width: viewportWidth,
  } = useElementRef();

  const {
    ref: sidebarRef,
    setRef: setSidebarRef,
    width: sidebarWidth,
  } = useElementRef();

  const directionSign = direction === "rtl" ? -1 : 1;

  return {
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
  };
};
