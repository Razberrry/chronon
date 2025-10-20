import React, { useEffect, useMemo } from "react";
import TimeCursor from "./components/TimeCursor";
import TimeAxis from "./components/timelineAxis/timeAxis/TimeAxis";
import { HOUR_AXIS_MARKERS, TIME_AXIS_MARKERS } from "./components/timelineAxis/timelineAxisMarkerDefinitions";
import Item from "./components/item/item";
import { useTimelineBehavior } from "./hooks/useTimelineBehavior";
import Row from "./components/Row/row";
import { ItemDefinition, RowDefinition } from "./types";
import useTimelineContext from "./hooks/useTimelineContext";
import { groupItemsToSubrows } from "./utils";
import Sidebar from "./components/sidebar/Sidebar";
import Subrow from "./components/subrow/Subrow";

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
                 גזרת שדרה {item.id}
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
