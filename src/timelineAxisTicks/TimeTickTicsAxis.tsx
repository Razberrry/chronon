// import React, { useMemo, memo } from "react";

// import { minutesToMilliseconds } from "date-fns";
// import { useTimelineContext } from "dnd-timeline";

// interface Marker {
// 	label?: string;
// 	sideDelta: number;
// 	heightMultiplier: number;
// }


// export interface MarkerProps {
//   time: Date;
//   label?: string;
//   heightMultiplier: number;
//   range: { start: number; end: number };
// }

// export interface MarkerDefinition {
//   intervalMs: number;
//   maxRangeSize?: number;
//   minRangeSize?: number;
//   component: React.ComponentType<MarkerProps>;
// }

// export interface TimeTickAxisProps {
//   ticDefinitions:MarkerDefinition[];
// }

// function TimeTickTicsAxis({ticDefinitions}: TimeTickAxisProps) {
//   const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();
//   const side = direction === "rtl" ? "right" : "left";

//   const markers = useMemo(() => {
//     const sorted = [...ticDefinitions].sort((a, b) => b.value - a.value);
//     const smallest = sorted.at(-1)?.value ?? 0;
//     if (smallest <= 0) return [];

//     const rangeSize = range.end - range.start;
//     const startTime = Math.floor(range.start / smallest) * smallest;
//     const endTime = range.end;

//     // If your ranges can cross DST, prefer per-tick offset for day+ grids:
//     const needsDSTAware = smallest >= 24 * 60 * 60 * 1000;
//     const staticTZ = minutesToMilliseconds(new Date().getTimezoneOffset());

//     const out: Array<{
//       key: number;
//       sideDelta: number;
//       Component: React.ComponentType<MarkerProps>;
//       props: MarkerProps;
//     }> = [];

//     for (let time = startTime; time <= endTime; time += smallest) {
//       const tz = needsDSTAware
//         ? minutesToMilliseconds(new Date(time).getTimezoneOffset())
//         : staticTZ;

//       // Pick first matching definition (fine → coarse)
//       let idx = -1;
//       for (let i = 0; i < sorted.length; i++) {
//         const m = sorted[i];
//         if (
//           ((time - tz) % m.value) === 0 &&
//           (!m.maxRangeSize || rangeSize <= m.maxRangeSize) &&
//           (!m.minRangeSize || rangeSize >= m.minRangeSize)
//         ) {
//           idx = i;
//           break;
//         }
//       }
//       if (idx === -1) continue;

//       const def = sorted[idx];
//       out.push({
//         key: time,
//         sideDelta: valueToPixels(time - range.start),
//         Component: def.component,
//         props: {
//           time: new Date(time),
//           heightMultiplier: 1 / (idx + 1),
//           range,
//         },
//       });
//     }

//     return out;
//   }, [range, valueToPixels, ticDefinitions]);

//   return (
//     <div
//       style={{
//         height: 20,
//         position: "relative",
//         overflow: "hidden",
//         [side === "right" ? "marginRight" : "marginLeft"]: sidebarWidth,
//       }}
//     >
//       {markers.map(({ Component, props, sideDelta, key }) => (
//         <div
//           key={key}
//           style={{
//             position: "absolute",
//             bottom: 0,
//             height: "100%",
//             [side]: `${sideDelta}px`,
//           }}
//         >
//           <Component {...props} />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default memo(TimeTickTicsAxis);