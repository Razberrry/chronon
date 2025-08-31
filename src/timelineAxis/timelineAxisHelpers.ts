import { minutesToMilliseconds } from "date-fns";
import {orderBy,last,range,find}  from 'lodash'
import { Marker, MarkerDefinition } from "./timelineAxisTypes";
/** Return marker definitions sorted by interval value, largest → smallest. */
export const sortMarkerDefinitionsByValueDescending = (
  definitions: MarkerDefinition[],
): MarkerDefinition[] => {
  if (!definitions?.length) return [];
  return orderBy(definitions, ["value"], ["desc"]);
};

/** Get the smallest interval value from a list already sorted descending. */
export const getSmallestStepFromDefinitions = (
  sortedDefinitions: MarkerDefinition[],
): number => {
  if (!sortedDefinitions?.length) return 0;
  return last(sortedDefinitions)!.value;
};

/** Current timezone offset in milliseconds. */
export const getTimezoneOffsetMilliseconds = (): number =>
  minutesToMilliseconds(new Date().getTimezoneOffset());

/** Is a definition active at timestampMs, given the visible range and timezone offset. */
export const isMarkerDefinitionActiveAtTime = (
  definition: MarkerDefinition,
  timestampMs: number,
  rangeSizeMs: number,
  timezoneOffsetMs: number,
): boolean => {
  if (!definition || typeof definition.value !== "number" || definition.value <= 0) {
    return false;
  }

  const alignedToInterval = ((timestampMs - timezoneOffsetMs) % definition.value) === 0;

  const withinMax = definition.maxRangeSize
    ? rangeSizeMs <= definition.maxRangeSize
    : true;

  const withinMin = definition.minRangeSize
    ? rangeSizeMs >= definition.minRangeSize
    : true;

  return alignedToInterval && withinMax && withinMin;
};

/** Find the first active definition at timestampMs from a list sorted by value desc. */
export const findActiveMarkerDefinitionForTime = (
  sortedDefinitions: MarkerDefinition[],
  timestampMs: number,
  rangeSizeMs: number,
  timezoneOffsetMs: number,
): MarkerDefinition | undefined =>
  find(sortedDefinitions, (def) =>
    isMarkerDefinitionActiveAtTime(def, timestampMs, rangeSizeMs, timezoneOffsetMs),
  );

/** Floor a timestamp to the nearest step size. */
export const floorTimestampToStep = (timestampMs: number, stepMs: number): number => {
  if (!stepMs || stepMs <= 0) return timestampMs;
  return Math.floor(timestampMs / stepMs) * stepMs;
};

/** Generate timestamps from start to end (inclusive), spaced by stepMs. */
export const generateTimestampsBetweenRangeInclusive = (
  startMs: number,
  endMs: number,
  stepMs: number,
): number[] => {
  if (stepMs <= 0) return [];
  if (endMs < startMs) return [];

  // lodash.range is end-exclusive; extend by one step and then ensure end inclusion.
  const values = range(startMs, endMs + stepMs, stepMs);
  const lastValue = last(values);

  const endIsAligned = (endMs - startMs) % stepMs === 0;
  const endMissing = lastValue !== endMs;

  if (endIsAligned && endMissing) values.push(endMs);
  return values;
};

/** Convert a marker definition at timestampMs into a renderable marker. */
export const createMarkerFromDefinition = (
  definition: MarkerDefinition,
  timestampMs: number,
  rangeStartMs: number,
  valueToPixels: (valueMs: number) => number,
): Marker => ({
  label: definition.getLabel?.(new Date(timestampMs)),
  sideDelta: valueToPixels(timestampMs - rangeStartMs),
  Override: definition.overrideComponent,
});
