import "./index.css";
import { addHours, parseISO, subHours } from "date-fns";
import { useState } from "react";
import {
  TimelineContextProvider,
  generateItems,
  generateRows,
  useTimeline,
} from ".";
import type { Range } from ".";
import { TimelineExample } from "./TimelineExample";
import React from "react";

const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 5).getTime(),
  end: addHours(new Date(), 5).getTime(),
};
const ROWS = generateRows(2);
const ITEMS = generateItems(
  500,
  {
    start: parseISO("2025-11-01").getTime(),
    end: parseISO("2025-12-05").getTime(),
  },
  ROWS
);

function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(ROWS);
  const [items, setItems] = useState(ITEMS);
  const timelineAttributes = useTimeline({
    range,
    setRange,
  });

  return (
    <TimelineContextProvider {...timelineAttributes}>
      <TimelineExample items={items} rows={rows} />
    </TimelineContextProvider>
  );
}

export default App;
