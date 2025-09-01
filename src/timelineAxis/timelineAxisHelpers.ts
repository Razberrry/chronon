import { minutesToMilliseconds } from "date-fns";
import orderBy from "lodash/orderBy";
import find from "lodash/find";
import last from "lodash/last";
import range from "lodash/range";
import { Marker, MarkerDefinition } from "./timelineAxisTypes";

const isScaleFunctionReady = (
  visibleRangeStartMilliseconds: number,
  visibleRangeEndMilliseconds: number,
  convertMillisecondsToPixels: (milliseconds: number) => number,
): boolean => {
  const rangeSpanMilliseconds = visibleRangeEndMilliseconds - visibleRangeStartMilliseconds;
  if (!Number.isFinite(rangeSpanMilliseconds) || rangeSpanMilliseconds <= 0) return false;
  const rangeSpanPixels = convertMillisecondsToPixels(rangeSpanMilliseconds);
  return Number.isFinite(rangeSpanPixels) && rangeSpanPixels > 0;
};

const getApplicableDefinitionsSortedForVisibleRange = (
  markerDefinitions: MarkerDefinition[],
  visibleRangeStartMilliseconds: number,
  visibleRangeEndMilliseconds: number,
): MarkerDefinition[] => {

  const visibleRangeMilliseconds = visibleRangeEndMilliseconds - visibleRangeStartMilliseconds;

  const sortedDefinitions = orderBy(markerDefinitions, ["value"], ["desc"]);
  return sortedDefinitions.filter((definition: MarkerDefinition) => {
    const withinMaximumRange =
      definition.maxRangeSize == null || visibleRangeMilliseconds <= definition.maxRangeSize;
    const withinMinimumRange =
      definition.minRangeSize == null || visibleRangeMilliseconds >= definition.minRangeSize;
    return withinMaximumRange && withinMinimumRange;
  });
};

const getStepAndAlignedStartFromDefinitions = (
  applicableDefinitions: MarkerDefinition[],
  visibleRangeStartMilliseconds: number,
): { stepMilliseconds: number; alignedStartMilliseconds: number } | null => {
  const stepMilliseconds = last(applicableDefinitions)?.value ?? 0;
  if (stepMilliseconds <= 0) return null;
  const alignedStartMilliseconds =
    Math.floor(visibleRangeStartMilliseconds / stepMilliseconds) * stepMilliseconds;
  return { stepMilliseconds, alignedStartMilliseconds };
};

const buildTimestampSequence = (
  alignedStartMilliseconds: number,
  visibleRangeEndMilliseconds: number,
  stepMilliseconds: number,
): number[] =>
  range(
    alignedStartMilliseconds,
    visibleRangeEndMilliseconds + stepMilliseconds,
    stepMilliseconds,
  );

const selectActiveMarkerDefinition = (
  applicableDefinitions: MarkerDefinition[],
  timestampMilliseconds: number,
  timezoneOffsetMilliseconds: number,
): MarkerDefinition | undefined =>
  find(
    applicableDefinitions,
    (definition:MarkerDefinition) =>
      ((timestampMilliseconds - timezoneOffsetMilliseconds) % definition.value) === 0,
  );

const createTimestampToMarkerMapper = (
  applicableDefinitions: MarkerDefinition[],
  visibleRangeStartMilliseconds: number,
  convertMillisecondsToPixels: (milliseconds: number) => number,
  timezoneOffsetMilliseconds: number,
) => {
  return (timestampMilliseconds: number): Marker | null => {
    const activeDefinition = selectActiveMarkerDefinition(
      applicableDefinitions,
      timestampMilliseconds,
      timezoneOffsetMilliseconds,
    );
    if (!activeDefinition) return null;

    const labelText = activeDefinition.getLabel?.(new Date(timestampMilliseconds));
    const pixelOffsetFromRangeStart = convertMillisecondsToPixels(
      timestampMilliseconds - visibleRangeStartMilliseconds,
    );

    return {
      label: labelText,
      sideDelta: pixelOffsetFromRangeStart,
      Override: activeDefinition.overrideComponent,
    };
  };
};

export const computeMarkers = (
  markerDefinitions: MarkerDefinition[],
  visibleRangeStartMilliseconds: number,
  visibleRangeEndMilliseconds: number,
  convertMillisecondsToPixels: (milliseconds: number) => number,
): Marker[] => {
  if (
    !isScaleFunctionReady(
      visibleRangeStartMilliseconds,
      visibleRangeEndMilliseconds,
      convertMillisecondsToPixels,
    )
  ) {
    return [];
  }

  if (!markerDefinitions?.length) return [];

  const applicableDefinitions = getApplicableDefinitionsSortedForVisibleRange(
    markerDefinitions,
    visibleRangeStartMilliseconds,
    visibleRangeEndMilliseconds,
  );
  if (!applicableDefinitions.length) return [];

  const stepAndAlignedStart = getStepAndAlignedStartFromDefinitions(
    applicableDefinitions,
    visibleRangeStartMilliseconds,
  );
  if (!stepAndAlignedStart) return [];

  const { stepMilliseconds, alignedStartMilliseconds } = stepAndAlignedStart;

  const timestampsMilliseconds = buildTimestampSequence(
    alignedStartMilliseconds,
    visibleRangeEndMilliseconds,
    stepMilliseconds,
  );

  const timezoneOffsetMilliseconds = minutesToMilliseconds(new Date().getTimezoneOffset());

  const mapTimestampToMarker = createTimestampToMarkerMapper(
    applicableDefinitions,
    visibleRangeStartMilliseconds,
    convertMillisecondsToPixels,
    timezoneOffsetMilliseconds,
  );
  const markersOrNull = timestampsMilliseconds.map(mapTimestampToMarker);
  const markers = markersOrNull.filter(Boolean) as Marker[];
  return markers;
};
