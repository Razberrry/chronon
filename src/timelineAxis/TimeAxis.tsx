import { minutesToMilliseconds } from "date-fns";
import { useTimelineContext } from "dnd-timeline";
import React from "react";
import { memo, useMemo } from "react";

interface Marker {
  label?: string;
  sideDelta: number;
  heightMultiplier: number;
  Override?: LabelComponent;
}

type LabelComponent = React.ComponentType<React.PropsWithChildren<{}>>;

export interface MarkerDefinition {
  value: number;
  maxRangeSize?: number;
  minRangeSize?: number;
  getLabel?: (time: Date) => string;
  overrideComponent?: LabelComponent; // children-only component
}

interface TimeAxisProps {
  markers: MarkerDefinition[];
}

function DefaultLabel({ children }: React.PropsWithChildren<{}>) {
  return (
    <div style={{ paddingLeft: "3px", alignSelf: "flex-start" }}>
      {children}
    </div>
  );
}

function TimeAxis(props: TimeAxisProps) {
  const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();
  const side = direction === "rtl" ? "right" : "left";

  const markers = useMemo<Marker[]>(() => {
    const sortedMarkers = [...props.markers].sort((a, b) => b.value - a.value);
    if (!sortedMarkers.length) return [];

    const delta = sortedMarkers[sortedMarkers.length - 1].value;
    const rangeSize = range.end - range.start;
    const startTime = Math.floor(range.start / delta) * delta;
    const endTime = range.end;
    const timezoneOffset = minutesToMilliseconds(new Date().getTimezoneOffset());

    const out: Marker[] = [];

    for (let time = startTime; time <= endTime; time += delta) {
      const idx = sortedMarkers.findIndex(
        m =>
          ((time - timezoneOffset) % m.value) === 0 &&
          (!m.maxRangeSize || rangeSize <= m.maxRangeSize) &&
          (!m.minRangeSize || rangeSize >= m.minRangeSize),
      );
      if (idx === -1) continue;

      const def = sortedMarkers[idx];
      const label = def.getLabel?.(new Date(time));

      out.push({
        label,
        heightMultiplier: 1 / (idx + 1),
        sideDelta: valueToPixels(time - range.start),
        Override: def.overrideComponent,
      });
    }

    return out;
  }, [range, valueToPixels, props.markers]);

  return (
    <div
      style={{
        height: "20px",
        position: "relative",
        overflow: "hidden",
        [side === "right" ? "marginRight" : "marginLeft"]: `${sidebarWidth}px`,
      }}
    >
      {markers.map((marker, index) => {
        const Label = marker.Override ?? DefaultLabel;
        return (
          <div
            key={`${marker.sideDelta}-${index}`}
            style={{
              position: "absolute",
              bottom: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              height: "100%",
              [side]: `${marker.sideDelta}px`,
            }}
          >
            <div
              style={{
                width: "1px",
                height: `${100 * marker.heightMultiplier}%`,
              }}
            />
            {marker.label ? (
              // Override receives only children
              <Label>{marker.label}</Label>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default memo(TimeAxis);
