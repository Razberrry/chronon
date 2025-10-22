import React, { useMemo } from "react";
import clsx from "clsx";

import "./timeAxis.base.css";
import styles from "./TimeAxis.module.css";
import { Marker, MarkerDefinition } from "../timelineAxisTypes";
import AxisLabel from "../axisLabel/AxisLabel";
import { computeMarkers } from "../timelineAxisHelpers";
import { useTimelineContext } from "../../../context/timelineContext";
import type { TimelineAxisClasses } from "../../../types/TimelineClasses";

export const TL_TIME_AXIS_CLASS = "TlTimeline-timeAxis";

export interface TimeAxisProps{
  timeAxisMarkers: MarkerDefinition[];
  classes?: TimelineAxisClasses;
};

export const TimeAxis: React.FC<TimeAxisProps> = ({ timeAxisMarkers, classes }) => {
  const { range, direction, sidebarWidth, spanToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";
  const markers: Marker[] = useMemo(
    () =>
      computeMarkers(
        timeAxisMarkers,
        range.start,
        range.end,
        spanToPixels,
      ),
    [timeAxisMarkers, range.start, range.end, spanToPixels]
  );

  return (
    <div
      className={clsx(TL_TIME_AXIS_CLASS,  classes?.timeAxis ?? styles.timeAxis )}
      style={{
        [side === "right" ? "marginRight" : "marginLeft"]: `${sidebarWidth}px`,
      } as React.CSSProperties}
    >
      {markers.map((marker, i) => (
        <AxisLabel side={side} marker={marker} key={`${marker.sideDelta}-${i}`} />
      ))}
    </div>
  );
};
