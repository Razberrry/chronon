import React, { useMemo } from "react";

import { TimeCursor } from "./components/timeCursor/TimeCursor";
import { TimeAxis } from "./components/timelineAxis/timeAxis/TimeAxis";
import { HOUR_AXIS_MARKERS, TIME_AXIS_MARKERS } from "./components/timelineAxis/timelineAxisMarkerDefinitions";
import { Item } from "./components/item/item";
import { Row } from "./components/Row/row";
import { Sidebar } from "./components/sidebar/sidebar";
import { Subrow } from "./components/subrow/subrow";
import { useTimelineBehavior } from "./hooks/useTimelineBehavior";
import { useTimelineContext } from "./hooks/useTimelineContext";
import { groupItemsToSubrows } from "./utils";
import type { ItemDefinition, RowDefinition } from "./types";

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const Timeline = (props: TimelineProps) => {
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
