import React, { useMemo } from "react";
import { useTimelineContext, type Range } from "dnd-timeline";
import styles from "./rangetoolbar.module.css";
import { buildPresetRange, getClosestPresetKey, getRangeDurationMilliseconds, PresetKey } from "./rangetoolbarFunctions";

type RangeToolbarProps = {
  setRange: (range: Range) => void;
};

const RangeToolbar: React.FC<RangeToolbarProps> = ({ setRange }) => {
  const { range: timelineRange } = useTimelineContext();

  const currentDurationMilliseconds = useMemo(
    () => getRangeDurationMilliseconds(timelineRange),
    [timelineRange],
  );

  const activePresetKey = useMemo<PresetKey>(
    () => getClosestPresetKey(currentDurationMilliseconds),
    [currentDurationMilliseconds],
  );

  const handleHourClick = (): void => {
    setRange(buildPresetRange("hour"));
  };
  const handleDayClick = (): void => {
    setRange(buildPresetRange("day"));
  };
  const handleWeekClick = (): void => {
    setRange(buildPresetRange("week"));
  };

  const isHourActive = activePresetKey === "hour";
  const isDayActive = activePresetKey === "day";
  const isWeekActive = activePresetKey === "week";

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={isHourActive ? styles.active : undefined}
        onClick={handleHourClick}
      >
        Hour
      </button>

      <button
        type="button"
        className={isDayActive ? styles.active : undefined}
        onClick={handleDayClick}
      >
        Day
      </button>

      <button
        type="button"
        className={isWeekActive ? styles.active : undefined}
        onClick={handleWeekClick}
      >
        Week
      </button>
    </div>
  );
};

export default RangeToolbar;
