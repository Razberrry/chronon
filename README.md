# chronon-timeline

A headless (no-UI) React timeline library built around a **composition pattern**: you compose `Timeline`, `Row`, `Subrow`, `Item`, `TimeAxis`, etc. and bring your own UI/content. The library provides layout, positioning, and interaction hooks (pan/zoom), but does not ship “opinionated” visuals.

## Install

```bash
npm install chronon-timeline
```

### Peer dependencies

This package expects these to be provided by the consuming app:

- `react`
- `react-dom`
- `react-virtuoso` (only needed if you use `VirtualizedRow`)

## What “headless” means here

- You render your own `Item` content and row sidebars (labels, buttons, etc).
- Styling is up to you. Components expose stable class hooks like `TlTimeline-*` and most accept a `classes` prop so you can attach your own classNames.
- Interaction behavior (mouse pan + wheel zoom) is opt-in via hooks.

## Basic usage

At a minimum:

1. Keep a `range` in state.
2. Call `useTimeline({ range, setRange })`.
3. Wrap your timeline in `TimelineContextProvider`.
4. Compose rows/items.

## Subrows (lanes)

`Subrow` is a lightweight “lane” container inside a `Row`.

- A `Row` typically represents a single track (e.g. a person, a machine, a category).
- A `Subrow` represents one **lane** within that row.
- You render items inside `Subrow`, and the library positions each `Item` horizontally based on its `span` and the current `range`.
- If items in the same row overlap in time, you usually place them into **multiple subrows** so they don’t visually overlap.

The simplest way to do that is to pre-group your items into lanes per row using `groupItemsToSubrows(items, range)` (pure utility), then render:

- `Row` (per row)
- `Subrow` (per lane)
- `Item` (per item)

### `useVisibleTimelineItems`

If you want the library to do “visible-range aware” grouping for you, use `useVisibleTimelineItems({ rows, items })` inside a provider.

What it does:

- Reads the current `range` from `TimelineContextProvider`.
- Filters `items` to only those intersecting the visible `range`.
- Groups the visible items into non-overlapping lanes per row (`subrowsByRow`).
- Returns:
  - `subrowsByRow: Record<rowId, ItemDefinition[][]>` (lanes)
  - `rowIdWithMostVisibleLanes` (handy for choosing which row to measure/attach refs to)
  - `isWeekly` (a convenience flag based on range length; currently used to switch to full-day spans)

Example:

```tsx
import React from "react";
import {
  Row,
  Subrow,
  Item,
  useVisibleTimelineItems,
  type ItemDefinition,
  type RowDefinition,
} from "chronon-timeline";

export function Rows({
  rows,
  items,
}: {
  rows: RowDefinition[];
  items: ItemDefinition[];
}) {
  const { subrowsByRow } = useVisibleTimelineItems({ rows, items });

  return rows.map((row) => (
    <Row key={row.id} {...row} subrowHeight={48}>
      {subrowsByRow[row.id]?.map((lane, laneIndex) => (
        <Subrow key={`${row.id}-${laneIndex}`}>
          {lane.map((it) => (
            <Item key={it.id} id={it.id} span={it.span}>
              {/* Your UI */}
              <div>{it.id}</div>
            </Item>
          ))}
        </Subrow>
      ))}
    </Row>
  ));
}
```

```tsx
import React, { useMemo, useState } from "react";
import {
  Timeline,
  TimelineContextProvider,
  Row,
  Subrow,
  Item,
  useTimeline,
  type Range,
  type ItemDefinition,
  type RowDefinition,
  groupItemsToSubrows,
} from "chronon-timeline";

export function MyTimeline({
  rows,
  items,
}: {
  rows: RowDefinition[];
  items: ItemDefinition[];
}) {
  const [range, setRange] = useState<Range>(() => {
    const now = Date.now();
    return { start: now - 1000 * 60 * 60 * 6, end: now + 1000 * 60 * 60 * 6 };
  });

  const timelineContext = useTimeline({ range, setRange });

  const subrowsByRow = useMemo(() => groupItemsToSubrows(items, range), [items, range]);

  return (
    <TimelineContextProvider {...timelineContext}>
      <Timeline dir="ltr">
        {rows.map((row) => (
          <Row key={row.id} {...row} subrowHeight={48}>
            {subrowsByRow[row.id]?.map((lane, laneIndex) => (
              <Subrow key={`${row.id}-${laneIndex}`}>
                {lane.map((it) => (
                  <Item key={it.id} id={it.id} span={it.span}>
                    {/* Bring your own UI */}
                    <div style={{ background: "black", color: "white", borderRadius: 6, padding: 8 }}>
                      {it.id}
                    </div>
                  </Item>
                ))}
              </Subrow>
            ))}
          </Row>
        ))}
      </Timeline>
    </TimelineContextProvider>
  );
}
```

## Interaction (mouse pan + wheel zoom)

Call `useTimelineBehavior()` somewhere inside your `TimelineContextProvider` tree (it attaches listeners to the timeline element).

What it does:

- Enables horizontal **mouse/touchpad drag to pan** the visible range.
- Enables **wheel zoom** when using a “zoom gesture” (`ctrl`/`cmd` + wheel).
- Batches pan/zoom updates to animation frames to avoid over-updating state.
- Suppresses the click that can occur right after a drag.
- Runs `useTimelineAutoPanUntilInteraction()` + `useTimelineMousePanAndZoom()` under the hood.

```tsx
import { useTimelineBehavior } from "chronon-timeline";

function TimelineInteractions() {
  useTimelineBehavior();
  return null;
}
```

Then render `<TimelineInteractions />` inside your provider.

## Time axis + cursor

```tsx
import React from "react";
import {
  TimeAxis,
  TimeCursor,
  TIME_AXIS_MARKERS,
  HOUR_AXIS_MARKERS,
} from "chronon-timeline";

export function Overlay() {
  return (
    <>
      <TimeCursor at={new Date()} />
      <TimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <TimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
    </>
  );
}
```

## Styling

- Components render with class hooks like `TlTimeline-rowWrapper`, `TlTimeline-item`, etc.
- Most components accept a `classes` prop to let you provide your own classNames without relying on DOM structure.

## Utility exports

The package also exports helpers for generating and grouping items/rows:

- `generateRows`, `generateItems`, `generateRandomSpan`, `generateFixedLengthItems`, `generateDeterministicItems`
- `groupItemsToRows`, `groupItemsToSubrows`, `groupItemsByRowSorted`, `sortItemsByStart`
- `mapItemsToFullDaySpans`, `filterItemsBySpan`

## Development

```bash
npm run dev
npm run build
```
