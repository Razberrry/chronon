import React, { memo, useMemo } from "react";
import { useTimelineContext } from "dnd-timeline";
import styles from "./TimeAxis.module.css";
import { Marker, MarkerDefinition, TimeAxisProps } from "../timelineAxisTypes";
import AxisLabel from "../axisLabel/AxisLabel";
import { format, hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import TickWithLineLabel from "../tickWithLineLabel/tickWithLineLabel";
import SimpleTickLabel from "../justTick/SimpleTickLabel";
import { computeMarkers } from "../timelineAxisHelpers";

const TIME_AXIS_MARKERS: MarkerDefinition[] = [
	{
		value: minutesToMilliseconds(5),
		maxRangeSize: hoursToMilliseconds(1),
		getLabel: (date: Date) => format(date, "m"),
    overrideComponent:TickWithLineLabel
	},
	{
		value: minutesToMilliseconds(1),
		maxRangeSize: hoursToMilliseconds(1),
    overrideComponent:SimpleTickLabel
	},
];


const TimeAxis: React.FC = () => {
  const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();
  const side: "left" | "right" = direction === "rtl" ? "right" : "left";

  const markers: Marker[] = useMemo(
  () =>
    computeMarkers(
      TIME_AXIS_MARKERS,         
      range.start,                
      range.end,                 
      valueToPixels,           
    ),
  [range.start, range.end, valueToPixels]
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

export default memo(TimeAxis);
