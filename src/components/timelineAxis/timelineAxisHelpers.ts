import { minutesToMilliseconds } from "date-fns";
import { orderBy, last } from "es-toolkit/array";
import { range } from "es-toolkit/math";
import { Marker, MarkerDefinition } from "./timelineAxisTypes";

const isTimestampWithinVisibleRange = (
  timestampMilliseconds: number,
  visibleRangeStartMilliseconds: number,
  visibleRangeEndMilliseconds: number
): boolean =>
  timestampMilliseconds >= visibleRangeStartMilliseconds &&
  timestampMilliseconds <= visibleRangeEndMilliseconds;

export const computeMarkers = (
  markerDefinitions: MarkerDefinition[],
  visibleRangeStartMilliseconds: number,
  visibleRangeEndMilliseconds: number,
  convertMillisecondsToPixels: (milliseconds: number) => number
): Marker[] => {
  const visibleRangeMilliseconds =
    visibleRangeEndMilliseconds - visibleRangeStartMilliseconds;

  if (
    !markerDefinitions?.length ||
    !Number.isFinite(visibleRangeMilliseconds) ||
    visibleRangeMilliseconds <= 0
  ) {
    return [];
  }

  const applicableDefinitions: MarkerDefinition[] = orderBy(
    markerDefinitions,
    ["value"],
    ["desc"]
  ).filter((definition: MarkerDefinition) => {
    const isWithinMax =
      definition.maxRangeSize == null ||
      visibleRangeMilliseconds < definition.maxRangeSize;
    const isWithinMin =
      definition.minRangeSize == null ||
      visibleRangeMilliseconds >= definition.minRangeSize;
    return isWithinMax && isWithinMin;
  });

  if (!applicableDefinitions.length) return [];

  const stepMilliseconds = last(applicableDefinitions)?.value;
  if (!stepMilliseconds || stepMilliseconds <= 0) return [];

  const timezoneOffsetMilliseconds = minutesToMilliseconds(
    new Date().getTimezoneOffset()
  );

  const alignedStartMilliseconds =
    Math.floor(
      (visibleRangeStartMilliseconds - timezoneOffsetMilliseconds) /
        stepMilliseconds
    ) *
      stepMilliseconds +
    timezoneOffsetMilliseconds;

  const timestamps = range(
    alignedStartMilliseconds,
    visibleRangeEndMilliseconds + stepMilliseconds,
    stepMilliseconds
  );

  return timestamps.reduce<Marker[]>((markers: Marker[], timestamp: number) => {
    if (
      !isTimestampWithinVisibleRange(
        timestamp,
        visibleRangeStartMilliseconds,
        visibleRangeEndMilliseconds
      )
    ) {
      return markers;
    }

    const activeDefinition = applicableDefinitions.find(
      (markerDefinition: MarkerDefinition) =>
        (timestamp - timezoneOffsetMilliseconds) % markerDefinition.value === 0
    );

    if (activeDefinition?.render) {
      const date = new Date(timestamp);
      markers.push({
        sideDelta: convertMillisecondsToPixels(
          timestamp - visibleRangeStartMilliseconds
        ),
        render: activeDefinition.render,
        date,
      });
    }

    return markers;
  }, []);
};
