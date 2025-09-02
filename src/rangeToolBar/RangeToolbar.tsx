import React, { useMemo } from "react";
import {
  addDays,
  addHours,
  addMinutes,
  subDays,
  subHours,
  subMinutes,
  hoursToMilliseconds,
  differenceInMilliseconds,
} from "date-fns";
import { useTimelineContext, type Range } from "dnd-timeline";
import styles from "./RangeToolbar.module.css";

type Props = {
  setRange: (range: Range) => void;
};

/** Named presets so the intent is obvious everywhere. */
type PresetKey = "hour" | "day" | "week";

/** Duration of each preset. */
const PRESET_DURATIONS_MILLISECONDS: Record<PresetKey, number> = {
  hour: hoursToMilliseconds(1),
  day: hoursToMilliseconds(8), // The "Day" button represents an 8-hour span
  week: hoursToMilliseconds(50),
};

/** Builders for each preset range, centered on "now". */
const createHourRange = (): Range => ({
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
});

const createDayRange = (): Range => ({
  start: subHours(new Date(), 4).getTime(),
  end: addHours(new Date(), 4).getTime(),
});

const createWeekRange = (): Range => ({
  start: subDays(new Date(), 3).getTime(),
  end: addDays(new Date(), 4).getTime(),
});

const PRESET_BUILDERS: Record<PresetKey, () => Range> = {
  hour: createHourRange,
  day: createDayRange,
  week: createWeekRange,
};

/** Utilities */
const getRangeDurationMilliseconds = (range: Range): number =>
  differenceInMilliseconds(new Date(range.end), new Date(range.start));

const getClosestPresetKey = (durationMilliseconds: number): PresetKey => {
  let bestKey: PresetKey = "hour";
  let bestDistance = Number.POSITIVE_INFINITY;

  (Object.keys(PRESET_DURATIONS_MILLISECONDS) as PresetKey[]).forEach((key) => {
    const target = PRESET_DURATIONS_MILLISECONDS[key];
    const distance = Math.abs(durationMilliseconds - target);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  });

  return bestKey;
};

const RangeToolbar: React.FC<Props> = ({ setRange }) => {
  const { range: timelineRange } = useTimelineContext();

  const currentDurationMilliseconds = useMemo(
    () => getRangeDurationMilliseconds(timelineRange),
    [timelineRange]
  );

  const activePresetKey = useMemo(
    () => getClosestPresetKey(currentDurationMilliseconds),
    [currentDurationMilliseconds]
  );

  const handleClickPreset = (presetKey: PresetKey): void => {
    setRange(PRESET_BUILDERS[presetKey]());
  };

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={activePresetKey === "hour" ? styles.active : undefined}
        onClick={() => handleClickPreset("hour")}
      >
        Hour
      </button>

      <button
        type="button"
        className={activePresetKey === "day" ? styles.active : undefined}
        onClick={() => handleClickPreset("day")}
      >
        Day
      </button>

      <button
        type="button"
        className={activePresetKey === "week" ? styles.active : undefined}
        onClick={() => handleClickPreset("week")}
      >
        Week
      </button>
    </div>
  );
};

export default RangeToolbar;
