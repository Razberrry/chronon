import React, { useMemo } from "react";
import clsx from "clsx";

import "./timeAxis.base.css";
import styles from "./TimeAxis.module.css";
import { Marker, MarkerDefinition } from "../timelineAxisTypes";
import AxisLabel from "../axisLabel/AxisLabel";
import { computeMarkers } from "../timelineAxisHelpers";
import { useTimelineContext } from "../../../context/timelineContext";
import type { TimelineAxisClasses } from "../../../types/TimelineClasses";

export interface TimeAxisProps {
  timeAxisMarkers: MarkerDefinition[];
  classes?: TimelineAxisClasses;
}

export const TimeAxis: React.FC<TimeAxisProps> = ({ timeAxisMarkers, classes }) => {
  const { range, direction, sidebarWidth, spanToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";
  const marginAttributeKey =
    side === "right"
      ? "data-tl-time-axis-margin-right"
      : "data-tl-time-axis-margin-left";
      
  const marginAttribute = {
    [marginAttributeKey]: `${sidebarWidth}`,
  };

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
      className={clsx("TlTimeline-timeAxis", styles.timeAxis, classes?.timeAxis)}
      {...marginAttribute}
    >
      {markers.map((marker, i) => (
        <AxisLabel side={side} marker={marker} key={`${marker.sideDelta}-${i}`} />
      ))}
    </div>
  );
};
