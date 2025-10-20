import React, { memo, useMemo } from "react";
import styles from "./TimeAxis.module.css";
import { Marker, MarkerDefinition } from "../timelineAxisTypes";
import AxisLabel from "../axisLabel/AxisLabel";
import { computeMarkers } from "../timelineAxisHelpers";
import { useTimelineContext } from "../../../hooks/useTimelineContext";

export interface TimeAxisProps{
  timeAxisMarkers: MarkerDefinition[];
};

export const TimeAxis: React.FC<TimeAxisProps> = ({ timeAxisMarkers }) => {
  const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";
  const markers: Marker[] = useMemo(
    () =>
      computeMarkers(
        timeAxisMarkers,
        range.start,
        range.end,
        valueToPixels,
      ),
    [timeAxisMarkers, range.start, range.end, valueToPixels]
  );

  return (
    <div
      className={styles.root}
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
