import React, { type PropsWithChildren } from "react";

import { useTimelineContext } from "../../context/timelineContext";

import "./timeline.base.css";
export interface TimelineContainerProps extends PropsWithChildren {
  dir?: "ltr" | "rtl";
}


export const Timeline = ({
  children,
  dir = "rtl",
}: TimelineContainerProps) => {
  const { setTimelineRef } = useTimelineContext();

  return (
    <div ref={setTimelineRef} className="TlTimeline-timeline" dir={dir}>
      {children}
    </div>
  );
};
