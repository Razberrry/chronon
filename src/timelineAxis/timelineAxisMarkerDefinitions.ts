import { format, hoursToMilliseconds, min, minutesToMilliseconds } from "date-fns";
import { MarkerDefinition } from "./timelineAxisTypes";
import TickWithLineLabel from "./tickWithLineLabel/tickWithLineLabel";
import SimpleTickLabel from "./justTick/simpleTickLabel";
import { he } from "date-fns/locale";


type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, "m");
const formatHourMinute: DateLabelFormatter = (date) => format(date, "H:mm");
const formatWeek: DateLabelFormatter = (date) => format(date,'EEEE');

export const formatHebrewDate = (date: Date): string => {
  const timePart = format(date, "H:mm", { locale: he });  
  const dayMonthPart = format(date, "d/M", { locale: he }); 
  const weekdayPart = format(date, "EEEE", { locale: he });
  return `${timePart}  • ${dayMonthPart} ${weekdayPart} `;
};


interface MarkerPairOptions {
  majorValueMilliseconds: number;
  minimumRangeSizeMilliseconds?: number;
  maximumRangeSizeMilliseconds?: number;
  majorLabel?: DateLabelFormatter;
  minorToMajorRatio: number; // e.g. 5 means minor = major/5
}


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

  // ...createMarkerDefinitionPair({
  //   majorValueMilliseconds: minutesToMilliseconds(10),
  //   minimumRangeSizeMilliseconds: hoursToMilliseconds(3),
  //   maximumRangeSizeMilliseconds: hoursToMilliseconds(5),
  //   majorLabel: formatMinutes,
  //   minorToMajorRatio: 2,
  // }),


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
    minRangeSize:hoursToMilliseconds(50),
    getLabel: formatWeek
  }


];


const HOUR_AXIS_MARKERS = [
      {
      value: hoursToMilliseconds(1),
      minRangeSize:minutesToMilliseconds(30),
      maxRangeSize:hoursToMilliseconds(2),
      getLabel: formatHebrewDate
    }

]
  



export {TIME_AXIS_MARKERS,HOUR_AXIS_MARKERS};
