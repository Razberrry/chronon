import { minutesToMilliseconds } from "date-fns";
import { orderBy, last } from "es-toolkit/array";
import { range } from "es-toolkit/math";
import { Marker, MarkerDefinition } from "./timelineAxisTypes";

const MIN_PIXELS_BETWEEN_MINOR_MARKERS = 1;
const MIN_PIXELS_BETWEEN_LABELED_MARKERS = 1000000000;

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

  const visibleRangePixels = convertMillisecondsToPixels(
    visibleRangeMilliseconds
  );
  if (!Number.isFinite(visibleRangePixels) || visibleRangePixels <= 0) {
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

  const definitionsWithViewportSpacing = applicableDefinitions.filter(
    (definition: MarkerDefinition) => {
      const pixelsBetweenMarkers = convertMillisecondsToPixels(
        definition.value
      );
      if (!Number.isFinite(pixelsBetweenMarkers) || pixelsBetweenMarkers <= 0) {
        return false;
      }

      const minimumSpacing = definition.getLabel
        ? MIN_PIXELS_BETWEEN_LABELED_MARKERS
        : MIN_PIXELS_BETWEEN_MINOR_MARKERS;

      return pixelsBetweenMarkers >= minimumSpacing;
    }
  );

  const labelledDefinition = applicableDefinitions.find(
    (definition) => !!definition.getLabel
  );

  let usableDefinitions =
    definitionsWithViewportSpacing.length > 0
      ? definitionsWithViewportSpacing
      : [];

  const hasLabel = (definition: MarkerDefinition) => !!definition.getLabel;

  if (!usableDefinitions.some(hasLabel) && labelledDefinition) {
    usableDefinitions = [labelledDefinition, ...usableDefinitions];
  }

  if (usableDefinitions.length === 0) {
    usableDefinitions = applicableDefinitions.slice(0, 1);
  }

  const stepMilliseconds = last(usableDefinitions)?.value;
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

    const activeDefinition = usableDefinitions.find(
      (markerDefinition: MarkerDefinition) =>
        (timestamp - timezoneOffsetMilliseconds) % markerDefinition.value === 0
    );

    if (activeDefinition) {
      markers.push({
        label: activeDefinition.getLabel?.(new Date(timestamp)),
        sideDelta: convertMillisecondsToPixels(
          timestamp - visibleRangeStartMilliseconds
        ),
        Override: activeDefinition.overrideComponent,
      });
    }

    return markers;
  }, []);
};
