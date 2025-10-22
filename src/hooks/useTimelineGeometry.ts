import type { MutableRefObject } from "react";

import { useElementRef } from "./useElementRef";

export interface TimelineGeometry {
  timelineRef: MutableRefObject<HTMLElement | null>;
  setTimelineRef: (element: HTMLElement | null) => void;
  sidebarRef: MutableRefObject<HTMLElement | null>;
  setSidebarRef: (element: HTMLElement | null) => void;
  sidebarWidth: number;
  direction: CanvasDirection;
  directionSign: number;
  viewportWidth: number;
}

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
