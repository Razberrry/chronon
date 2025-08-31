import "./index.css";
import { addDays, addHours, addMinutes, endOfDay, startOfDay, subDays, subHours, subMinutes } from "date-fns";
import type { Range } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import React, { useCallback, useState } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";
import { useHorizontalDragScroll } from "./usePanStrategy";

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

// Builders that center the range around "now" each time they're called
const makeHourRange = (): Range => ({
  start: subMinutes(new Date(),30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
});

const makeDayRange = (): Range => ({
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(),12).getTime(),
});

const makeWeekRange = (): Range => ({
  start: subDays(new Date(), 3).getTime(),
  end: addDays(new Date(), 4).getTime(),
});

// Use a concrete default; hour view is fine
const DEFAULT_RANGE_HOUR: Range = makeHourRange();

function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(generateRows(3));
  const [items, setItems] = useState(
    generateItems(
      500,
      {
        start: startOfDay(daysAgo(10)).getTime(),
        end: endOfDay(daysAgo(-20)).getTime(),
      },
      rows
    )
  );

  const setHour = useCallback(() => setRange(makeHourRange()), []);
  const setDay = useCallback(() => setRange(makeDayRange()), []);
  const setWeek = useCallback(() => setRange(makeWeekRange()), []);

  return (
    <>
      <div className="range-toolbar" style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button type="button" onClick={setHour}>Hour</button>
        <button type="button" onClick={setDay}>Day</button>
        <button type="button" onClick={setWeek}>Week</button>
      </div>

      <TimelineContext
        range={range}
        onResizeEnd={() => {}}
        onRangeChanged={setRange}
        usePanStrategy={useHorizontalDragScroll}
      >
        <Timeline items={items} rows={rows} />
      </TimelineContext>
    </>
  );
}

export default App;
