import React, { useMemo } from "react";
import clsx from "clsx";

import "./rangeToolbar.base.css";
import { buildPresetRange, getClosestPresetKey, getRangeDurationMilliseconds, PresetKey } from "./rangetoolbarFunctions";
import type { Range } from "../../types";
import type { TimelineRangeToolbarClasses } from "../../types/TimelineClasses";
import { useTimelineContext } from "../../context/timelineContext";

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
      className={clsx("TlTimeline-rangeToolbar", classes?.toolbar)}
    >
      {PRESETS.map(({ key, label }) => {
        const isActive = activePresetKey === key;

        return (
          <button
            key={key}
            type="button"
            className={clsx(
              "TlTimeline-rangeToolbarButton",
              isActive && "TlTimeline-rangeToolbarButton--active",
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
