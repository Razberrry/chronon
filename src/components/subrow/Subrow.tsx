import React, { useMemo } from "react";
import clsx from "clsx";
import "./subrow.base.css";
import type { TimelineSubrowClasses } from "../../types/TimelineClasses";
import type { Span } from "../../types";
import { useTimelineContext } from "../../context/timelineContext";

export interface SubrowProps {
  children: React.ReactNode;
  classes?: TimelineSubrowClasses;
}

const toPixelString = (value: number) => `${Math.round(value * 1000) / 1000}px`;

export const Subrow = ({ children, classes }: SubrowProps) => {
  const { range, spanToPixels } = useTimelineContext();

  const adjustedChildren = useMemo(() => {
    let occupiedInlineSize = 0;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      const { span } = child.props as { span?: Span };
      if (
        !span ||
        typeof span.start !== "number" ||
        typeof span.end !== "number"
      ) {
        return child;
      }

      const widthPixels = spanToPixels(span.end - span.start);
      const desiredStart = spanToPixels(span.start - range.start);

      if (!Number.isFinite(widthPixels) || !Number.isFinite(desiredStart)) {
        return child;
      }

      const margin = desiredStart - occupiedInlineSize;
      occupiedInlineSize =
        Math.round((occupiedInlineSize + widthPixels + margin) * 1000) / 1000;

      const existingStyle = (child.props as { style?: React.CSSProperties })
        .style;

      const nextStyle = (
        existingStyle
          ? {
              ...existingStyle,
              ["--tl-item-inline-margin"]: toPixelString(margin),
            }
          : { ["--tl-item-inline-margin"]: toPixelString(margin) }
      ) as React.CSSProperties;

      return React.cloneElement(child, {
        style: nextStyle,
      });
    });
  }, [children, range.start, range.end, spanToPixels]);

  return (
    <div className={clsx("TlTimeline-subrow", classes?.subrow)}>
      {adjustedChildren}
    </div>
  );
};
