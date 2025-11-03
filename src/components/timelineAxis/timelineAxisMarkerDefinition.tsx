import React from "react";
import { format, hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { he } from "date-fns/locale";
import DefaultLabel from "./DefaultLabel/defaultLabel";
import SimpleTickLabel from "./justTick/simpleTickLabel";
import TickWithLineLabel from "./tickWithLineLabel/tickWithLineLabel";
import { MarkerDefinition } from "./timelineAxisTypes";

type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, "m");
const formatHourMinute: DateLabelFormatter = (date) => format(date, "H:mm");
const formatWeek: DateLabelFormatter = (date) => format(date, "EEEE");

export const formatHebrewDate = (date: Date): string => {
  const timePart = format(date, "H:mm", { locale: he });
  const dayMonthPart = format(date, "d/M", { locale: he });
  const weekdayPart = format(date, "EEEE", { locale: he });
  return `${timePart} • ${dayMonthPart} ${weekdayPart} `;
};

interface MarkerPairOptions {
  majorValueMilliseconds: number;
  minimumRangeSizeMilliseconds?: number;
  maximumRangeSizeMilliseconds?: number;
  majorLabel?: DateLabelFormatter;
  minorToMajorRatio: number;
}

export const createMarkerDefinitionPair = (
  options: MarkerPairOptions
): MarkerDefinition[] => {
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
      render: () => <SimpleTickLabel />,
    },
    {
      value: majorValueMilliseconds,
      minRangeSize: minimumRangeSizeMilliseconds,
      maxRangeSize: maximumRangeSizeMilliseconds,
      render: (date: Date) => (
        <TickWithLineLabel label={majorLabel?.(date)} />
      ),
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
    majorValueMilliseconds: minutesToMilliseconds(30),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(3),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(12),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 2,
  }),
  ...createMarkerDefinitionPair({
    majorValueMilliseconds: hoursToMilliseconds(1),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(12),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(30),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 2,
  }),
  ...createMarkerDefinitionPair({
    majorValueMilliseconds: hoursToMilliseconds(2),
    minimumRangeSizeMilliseconds: hoursToMilliseconds(30),
    maximumRangeSizeMilliseconds: hoursToMilliseconds(50),
    majorLabel: formatHourMinute,
    minorToMajorRatio: 2,
  }),
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(50),
    render: (date: Date) => <DefaultLabel label={formatWeek(date)} />,
  },
];

const HOUR_AXIS_MARKERS: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(1),
    minRangeSize: minutesToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(2),
    render: (date: Date) => (
      <DefaultLabel label={formatHebrewDate(date)} />
    ),
  },
];

export { TIME_AXIS_MARKERS, HOUR_AXIS_MARKERS };
