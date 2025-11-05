import React, { useMemo } from "react";

import { TimeCursor } from "./components/timeCursor/timeCursor";
import { TimeAxis } from "./components/timelineAxis/timeAxis/TimeAxis";
import {
  HOUR_AXIS_MARKERS,
  TIME_AXIS_MARKERS,
} from "./components/timelineAxis/timelineAxisMarkerDefinition";
import { Item } from "./components/item/item";
import { Row } from "./components/Row/row";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Subrow } from "./components/subrow/Subrow";
import { useTimelineBehavior } from "./hooks/useTimelineBehavior";
import { groupItemsToSubrows } from "./utils";
import type { ItemDefinition, RowDefinition } from "./types";
import { useTimelineContext } from "./context/timelineContext";
import { Timeline } from "./components/timeline/timeline";

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const TimelineExample = ({ rows, items }: TimelineProps) => {
  const { range } = useTimelineContext();
  useTimelineBehavior();

  const subrowsByRow = useMemo(() => groupItemsToSubrows(items), [items]);

  const visibleSubrows = useMemo(() => {
    const rangeStart = range.start;
    const rangeEnd = range.end;

    const result: Record<
      string,
      Array<{ laneIndex: number; items: ItemDefinition[] }>
    > = {};

    for (const [rowId, lanes] of Object.entries(subrowsByRow)) {
      const visibleLanes: Array<{
        laneIndex: number;
        items: ItemDefinition[];
      }> = [];

      lanes.forEach((lane, laneIndex) => {
        const itemsInRange = lane.filter(
          (item) => item.span.start < rangeEnd && item.span.end > rangeStart
        );

        if (itemsInRange.length) {
          visibleLanes.push({ laneIndex, items: itemsInRange });
        }
      });

      if (visibleLanes.length) {
        result[rowId] = visibleLanes;
      }
    }

    return result;
  }, [subrowsByRow, range.start, range.end]);

  const now = new Date();

  return (
    <Timeline>
      <TimeCursor at={now} />
      <TimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <TimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {rows.map((row) => (
        <Row {...row} key={row.id} sidebar={<Sidebar row={row} />}>
          {visibleSubrows[row.id]?.map(({ items: subrowItems, laneIndex }) => (
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
