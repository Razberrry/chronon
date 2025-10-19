import React, { memo, useRef, useEffect } from "react";
import clsx from "clsx";
import "./timeCursor.base.css";
import { TimelineCursorClasses, TL_CURSOR_CLASS } from "./timeCursorClasses";
import useTimelineContext from "../../hooks/useTimelineContext";

interface TimeCursorProps {
  at?: Date;
  classes?: TimelineCursorClasses;
}

const TimeCursor = ({ at, classes }: TimeCursorProps) => {
  const { range, direction, sidebarWidth, valueToPixels } = useTimelineContext();

  if (!at) return null;

  const isVisible = at.getTime() > range.start && at.getTime() < range.end;
  if (!isVisible) return null;

  const timeDelta = at.getTime() - range.start;
  const timeDeltaInPixels = valueToPixels(timeDelta);
  const cursorOffset = sidebarWidth + timeDeltaInPixels;

  return (
    <div
      className={clsx(TL_CURSOR_CLASS, classes?.cursor)}
      data-tl-cursor-offset={direction === "rtl" ? -cursorOffset : cursorOffset}
    />
  );
};

export default memo(TimeCursor);