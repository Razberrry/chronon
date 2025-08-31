import { format, hoursToMilliseconds, minutesToMilliseconds, setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext, useWheelStrategy } from "dnd-timeline";
import React, { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import TimeCursor from "./TimeCursor";
import { MarkerDefinition } from "./timelineAxis/timelineAxisTypes";
import TimeAxis from "./timelineAxis/timeAxis/TimeAxis";
import TickWithLineLabel from "./timelineAxis/tickWithLineLabel/tickWithLineLabel";

const timeAxisMarkers: MarkerDefinition[] = [
	{
		value: minutesToMilliseconds(5),
		maxRangeSize: hoursToMilliseconds(1),
    minRangeSize:hoursToMilliseconds(1),
		getLabel: (date: Date) => format(date, "m"),
    overrideComponent:TickWithLineLabel
	},
	{
		value: minutesToMilliseconds(1),
		maxRangeSize: hoursToMilliseconds(1),
	},
];


// const timeAxisMarker2s: MarkerDefinition[] = [
// { intervalMs: minutesToMilliseconds(5), maxRangeSize: hoursToMilliseconds(3),
//   component: 



// }];



interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
  const { setTimelineRef, style, range } = useTimelineContext();
	
  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, range),
    [props.items, range]
  );

  const now = new Date();
 

  return (
    <div ref={setTimelineRef} style={style} dir="rtl">
      <TimeCursor at={now} />
      <TimeAxis markers={timeAxisMarkers} />
      {props.rows.map((row) => (
        <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <Subrow key={`${row.id}-${index}`}>
              {subrow.map((item) => (
                <Item id={item.id} key={item.id} span={item.span}>
                  גזרת שדירה.
                </Item>
              ))}
            </Subrow>
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Timeline;
