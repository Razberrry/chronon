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
  startElement?: React.ReactNode;
  classes?: TimelineAxisClasses;
}

export const TimeAxis: React.FC<TimeAxisProps> = ({
  timeAxisMarkers,
  startElement,
  classes,
}) => {
  const { range, direction, sidebarWidth, spanToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";

  const markers: Marker[] = useMemo(
    () => computeMarkers(timeAxisMarkers, range.start, range.end, spanToPixels),
    [timeAxisMarkers, range.start, range.end, spanToPixels]
  );

  return (
    <div className={clsx("TlTimeline-timeAxisWrapper", styles.timeAxisWrapper)}>
      <div
        className={clsx(
          "TlTimeline-timeAxisStartElement",
          styles.timeAxisStartElement
        )}
        style={
          {
            "--tl-time-axis-startElement-width": `${sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {startElement}
      </div>
      <div
        className={clsx(
          "TlTimeline-timeAxis",
          styles.timeAxis,
          classes?.timeAxis
        )}
      >
        {markers.map((marker, i) => (
          <AxisLabel
            side={side}
            marker={marker}
            key={`${marker.sideDelta}-${i}`}
          />
        ))}
      </div>
    </div>
  );
};
