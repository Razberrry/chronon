import "./index.css";
import { addMinutes, endOfDay, millisecondsToMinutes, parseISO, startOfDay, subMinutes } from "date-fns";
import React, { useState } from "react";
import { RangeToolbar, TimelineContext, TimelineContextProvider, generateItems, generateRows, useTimeline } from ".";
import type { Range } from ".";
import { TimelineExample } from "./TimelineExample";

const DEFAULT_RANGE_HOUR: Range = {
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
};
const ROWS = generateRows(3)
const ITEMS =   generateItems(
      10000,
      {
        start: parseISO("2020-10-26").getTime(),
        end: parseISO("2025-12-26").getTime(),
      },
       ROWS
    )
function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(ROWS);
  const [items, setItems] = useState(ITEMS);
  const timelineAttributes = useTimeline({range, onRangeChanged: setRange});
  
  return (
      <TimelineContextProvider
        {...timelineAttributes}
      >
        <RangeToolbar setRange={setRange} />
        <TimelineExample items={items} rows={rows} />
      </TimelineContextProvider>
  );
}

export default App;
