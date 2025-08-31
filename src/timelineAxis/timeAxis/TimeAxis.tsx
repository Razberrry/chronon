import React, { memo, useMemo } from "react";
import { useTimelineContext } from "dnd-timeline";
import styles from "./TimeAxis.module.css";
import { Marker, TimeAxisProps } from "../timelineAxisTypes";
import { sortMarkerDefinitionsByValueDescending, getSmallestStepFromDefinitions, floorTimestampToStep, getTimezoneOffsetMilliseconds, generateTimestampsBetweenRangeInclusive, findActiveMarkerDefinitionForTime, createMarkerFromDefinition } from "../timelineAxisHelpers";
import AxisLabel from "../axisLabel/AxisLabel";



const TimeAxis: React.FC<TimeAxisProps> = ({ markers: definitions }) => {
  const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";

  const markers = useMemo<Marker[]>(() => {
    const sorted = sortMarkerDefinitionsByValueDescending(definitions);
    if (!sorted.length) return [];

    const smallestStep = getSmallestStepFromDefinitions(sorted);
    if (!smallestStep) return [];

    const rangeSizeMs = range.end - range.start;
    const startAligned = floorTimestampToStep(range.start, smallestStep);
    const timezoneOffsetMs = getTimezoneOffsetMilliseconds();

    const timestamps = generateTimestampsBetweenRangeInclusive(
      startAligned,
      range.end,
      smallestStep,
    );

    const out: Marker[] = [];
    for (const t of timestamps) {
      const active = findActiveMarkerDefinitionForTime(
        sorted,
        t,
        rangeSizeMs,
        timezoneOffsetMs,
      );
      if (!active) continue;
      out.push(createMarkerFromDefinition(active, t, range.start, valueToPixels));
    }
    return out;
  }, [definitions, range, valueToPixels]);

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

export default memo(TimeAxis);
