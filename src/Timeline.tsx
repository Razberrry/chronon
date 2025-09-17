import type { ItemDefinition, OnPanEnd, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext, useWheelStrategy } from "dnd-timeline";
import React, { useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import TimeCursor from "./TimeCursor";
import TimeAxis from "./timelineAxis/timeAxis/TimeAxis";
import { HOUR_AXIS_MARKERS, TIME_AXIS_MARKERS } from "./timelineAxis/timelineAxisMarkerDefinitions";
import Item from "./item/item";
import { useTimelineBehavior } from "./useTimelineBehavior";
import Row from "./Row/Row";

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

const Timeline = (props: TimelineProps) => {
  const { setTimelineRef, style, range} = useTimelineContext();
  useTimelineBehavior();
 
  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, range),
    [props.items, range]
  );
  const now = new Date();

  return (
    <div ref={setTimelineRef} style={style} dir="rtl">
      <TimeCursor at={now} />
      <TimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <TimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {props.rows.map((row) => (
        <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <Subrow key={`${row.id}-${index}`}>
              {subrow.map((item) => (
                <Item id={item.id} key={item.id} span={item.span}>
                 גזרת שדרה
                </Item>
              ))}
            </Subrow>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default Timeline;
