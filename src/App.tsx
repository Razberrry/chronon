import "./index.css";
import { addDays, addHours, addMinutes, endOfDay, startOfDay, subMinutes } from "date-fns";
import type { Range } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import React, { useState } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";
import RangeToolbar from "./rangeToolBar/rangeToolbar";


const DEFAULT_RANGE_HOUR: Range = {
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
};

function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(generateRows(3));
  const [items, setItems] = useState(
    generateItems(
      5000,
      {
        start: startOfDay(new Date(Date.now() - 10 * 86400000)).getTime(),
        end: endOfDay(new Date(Date.now() + 20 * 86400000)).getTime(),
      },
      rows
    )
  );

  return (
      <TimelineContext
        range={range}
        onRangeChanged={setRange}
      >
        <RangeToolbar setRange={setRange} />
        <Timeline items={items} rows={rows} />
      </TimelineContext>
  );
}

export default App;