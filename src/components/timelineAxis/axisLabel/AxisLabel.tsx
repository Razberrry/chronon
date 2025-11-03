import React from "react";
import clsx from "clsx";
import "./axisLabel.base.css";
import { Marker } from "../timelineAxisTypes";
import type { TimelineAxisLabelClasses } from "./axisLabelClasses";

type AxisLabelProps = {
  side: "left" | "right";
  marker: Marker;
  classes?: TimelineAxisLabelClasses;
};

const AxisLabel: React.FC<AxisLabelProps> = ({ side, marker, classes }) => {
  const labelStyle = {
    "--tl-axis-label-side-delta": `${marker.sideDelta}px`,
  } as React.CSSProperties;
  const renderedContent = marker.render?.(marker.date);

  return (
    <div
      className={clsx(
        "TlTimeline-axisLabel",
        side === "left"
          ? "TlTimeline-axisLabel--left"
          : "TlTimeline-axisLabel--right",
        classes?.axisLabel
      )}
      style={labelStyle}
    >
      {renderedContent ?? null}
    </div>
  );
};

export default AxisLabel;
