import React, { useMemo } from "react";
import clsx from "clsx";

import "./rangeToolbar.base.css";
import { buildPresetRange, getClosestPresetKey, getRangeDurationMilliseconds, PresetKey } from "./rangetoolbarFunctions";
import type { Range } from "../../types";
import type { TimelineRangeToolbarClasses } from "../../types/TimelineClasses";
import { useTimelineContext } from "../../context/timelineContext";

const TL_RANGE_TOOLBAR_CLASS = "TlTimeline-rangeToolbar";
const TL_RANGE_TOOLBAR_BUTTON_CLASS = "TlTimeline-rangeToolbarButton";
const TL_RANGE_TOOLBAR_BUTTON_ACTIVE_CLASS = "TlTimeline-rangeToolbarButton--active";

const PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: "hour", label: "Hour" },
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
];

export interface RangeToolbarProps {
  setRange: (range: Range) => void;
  classes?: TimelineRangeToolbarClasses;
};

export const RangeToolbar: React.FC<RangeToolbarProps> = ({ setRange, classes }) => {
  const { range: timelineRange } = useTimelineContext();

  const currentDurationMilliseconds = useMemo(
    () => getRangeDurationMilliseconds(timelineRange),
    [timelineRange],
  );

  const activePresetKey = useMemo<PresetKey>(
    () => getClosestPresetKey(currentDurationMilliseconds),
    [currentDurationMilliseconds],
  );

  return (
    <div
      className={clsx(TL_RANGE_TOOLBAR_CLASS, classes?.toolbar)}
    >
      {PRESETS.map(({ key, label }) => {
        const isActive = activePresetKey === key;

        return (
          <button
            key={key}
            type="button"
            className={clsx(
              TL_RANGE_TOOLBAR_BUTTON_CLASS,
              isActive && TL_RANGE_TOOLBAR_BUTTON_ACTIVE_CLASS,
              classes?.button,
              isActive && classes?.activeButton,
            )}
            onClick={() => setRange(buildPresetRange(key))}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
