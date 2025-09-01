import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext, useWheelStrategy } from "dnd-timeline";
import React, { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import TimeCursor from "./TimeCursor";
import TimeAxis from "./timelineAxis/timeAxis/TimeAxis";

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
      <TimeAxis />
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
}

export default Timeline;
