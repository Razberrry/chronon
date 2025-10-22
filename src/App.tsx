import "./index.css";
import { addMinutes, endOfDay, startOfDay, subMinutes } from "date-fns";
import React, { useState } from "react";
import { RangeToolbar, TimelineExample, TimelineContext, TimelineContextProvider, generateItems, generateRows, useTimeline } from ".";
import type { Range } from ".";

const DEFAULT_RANGE_HOUR: Range = {
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
};

function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(generateRows(3));
  const [items, setItems] = useState(
    generateItems(
      1000,
      {
        start: startOfDay(new Date(Date.now() - 10 * 86400000)).getTime(),
        end: endOfDay(new Date(Date.now() + 20 * 86400000)).getTime(),
      },
      rows
    )
  );
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
