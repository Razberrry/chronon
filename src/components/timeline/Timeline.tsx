import React, { type PropsWithChildren } from "react";

import { useTimelineContext } from "../../context/timelineContext";

import "./timeline.base.css";

const TL_TIMELINE_CLASS = "TlTimeline-timeline";
export interface TimelineContainerProps extends PropsWithChildren {
  dir?: "ltr" | "rtl";
}


export const Timeline = ({
  children,
  dir = "rtl",
}: TimelineContainerProps) => {
  const { setTimelineRef } = useTimelineContext();

  return (
    <div ref={setTimelineRef} className={TL_TIMELINE_CLASS} dir={dir}>
      {children}
    </div>
  );
};
