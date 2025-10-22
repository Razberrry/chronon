import React, { useMemo } from "react";

import { TimeCursor } from "./components/timeCursor/timeCursor";
import { TimeAxis } from "./components/timelineAxis/timeAxis/TimeAxis";
import { HOUR_AXIS_MARKERS, TIME_AXIS_MARKERS } from "./components/timelineAxis/timelineAxisMarkerDefinitions";
import { Item } from "./components/item/item";
import { Timeline } from "./components/timeline/Timeline";
import { Row } from "./components/Row/row";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Subrow } from "./components/subrow/Subrow";
import { useTimelineBehavior } from "./hooks/useTimelineBehavior";
import { groupItemsToSubrows } from "./utils";
import type { ItemDefinition, RowDefinition } from "./types";
import { useTimelineContext } from "./context/timelineContext";

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const TimelineExample = ({ rows, items }: TimelineProps) => {
  const { range } = useTimelineContext();
  useTimelineBehavior();
 
  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, range),
    [items, range]
  );
  const now = new Date();

  return (
    <Timeline>
      <TimeCursor at={now} />
      <TimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <TimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {rows.map((row) => (
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
    </Timeline>
  );
};
