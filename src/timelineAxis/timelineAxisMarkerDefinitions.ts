import { format, hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { MarkerDefinition } from "./timelineAxisTypes";
import TickWithLineLabel from "./tickWithLineLabel/tickWithLineLabel";
import SimpleTickLabel from "./justTick/SimpleTickLabel";

type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, "m");
const formatHourMinute: DateLabelFormatter = (date) => format(date, "H:mm");

interface MarkerPairOptions {
  majorValueMilliseconds: number;
  minimumRangeSizeMilliseconds?: number;
  maximumRangeSizeMilliseconds?: number;
  majorLabel?: DateLabelFormatter;
  minorToMajorRatio: number; // e.g. 5 means minor = major/5
}

/**
 * Creates a minor+major pair:
 * - Minor tick: simple tick component, no label
 * - Major tick: line + label component, uses provided formatter
 */
const createMarkerDefinitionPair = (options: MarkerPairOptions): MarkerDefinition[] => {
  const {
    majorValueMilliseconds,
    minimumRangeSizeMilliseconds,
    maximumRangeSizeMilliseconds,
    majorLabel,
    minorToMajorRatio,
  } = options;

  if (minorToMajorRatio <= 0) {
    throw new Error("minorToMajorRatio must be greater than 0");
  }

  const minorValueMilliseconds = majorValueMilliseconds / minorToMajorRatio;

  return [
    {
      value: minorValueMilliseconds,
      minRangeSize: minimumRangeSizeMilliseconds,
      maxRangeSize: maximumRangeSizeMilliseconds,
      overrideComponent: SimpleTickLabel,
    },
    {
      value: majorValueMilliseconds,
      minRangeSize: minimumRangeSizeMilliseconds,
      maxRangeSize: maximumRangeSizeMilliseconds,
      getLabel: majorLabel,
      overrideComponent: TickWithLineLabel,
    },
  ];
};

const TIME_AXIS_MARKERS: MarkerDefinition[] = [
  ...createMarkerDefinitionPair({
    majorValueMilliseconds: minutesToMilliseconds(5),
    minimumRangeSizeMilliseconds: 0,
    maximumRangeSizeMilliseconds: hoursToMilliseconds(3),
    majorLabel: formatMinutes,
    minorToMajorRatio: 5,
  }),

  ...createMarkerDefinitionPair({
    majorValueMilliseconds: minutesToMilliseconds(10),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(3),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(5),
    majorLabel: formatMinutes,
    minorToMajorRatio: 2,
  }),


  ...createMarkerDefinitionPair({
    majorValueMilliseconds: minutesToMilliseconds(30),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(5),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(12),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 2,
  }),

  ...createMarkerDefinitionPair({
    majorValueMilliseconds: hoursToMilliseconds(1),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(12),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(28),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 2,
  }),

  ...createMarkerDefinitionPair({
    majorValueMilliseconds: hoursToMilliseconds(5),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(28),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(100),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 5,
  }),
];

export default TIME_AXIS_MARKERS;
