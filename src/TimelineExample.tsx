import React from "react";

import { TimeCursor } from "./components/timeCursor/timeCursor";
import { TimeAxis } from "./components/timelineAxis/timeAxis/timeAxis";
import {
  HOUR_AXIS_MARKERS,
  TIME_AXIS_MARKERS,
} from "./components/timelineAxis/timelineAxisMarkerDefinition";
import { Item } from "./components/item/item";
import { Row } from "./components/Row/row";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Subrow } from "./components/subrow/Subrow";
import { useTimelineBehavior } from "./hooks/useTimelineBehavior";
import { useVisibleTimelineItems } from "./hooks/useVisibleTimelineItems";
import type { ItemDefinition, RowDefinition } from "./types";
import { Timeline } from "./components/timeline/timeline";

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const TimelineExample = ({ rows, items }: TimelineProps) => {
  useTimelineBehavior();
  const { subrowsByRow, rowIdWithMostVisibleLanes } = useVisibleTimelineItems({
    rows,
    items,
  });

  const now = new Date();

  return (
    <Timeline>
      <TimeCursor at={now} />
      <TimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <TimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {rows.map((row) => (
        <Row
          {...row}
          key={row.id}
          sidebar={<Sidebar row={row} />}
          ignoreRefs={row.id === rowIdWithMostVisibleLanes}
          subrowHeight={60}
        >
          {subrowsByRow[row.id]?.map((subrowItems, laneIndex) => (
            <Subrow key={`${row.id}-lane-${laneIndex}`}>
              {subrowItems.map((item) => (
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
