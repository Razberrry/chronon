import React from "react";
import clsx from "clsx";
import "./axisLabel.base.css";
import { Marker } from "../timelineAxisTypes";
import DefaultLabel from "../DefaultLabel/defaultLabel";
import type { TimelineAxisLabelClasses } from "./axisLabelClasses";

type AxisLabelProps = {
  side: "left" | "right";
  marker: Marker;
  classes?: TimelineAxisLabelClasses;
};

const AxisLabel: React.FC<AxisLabelProps> = ({ side, marker, classes }) => {
  const Label = marker.Override ?? DefaultLabel;
  const positionStyle =
    side === "left"
      ? { left: `${marker.sideDelta}px` }
      : { right: `${marker.sideDelta}px` };

  return (
    <div
      className={clsx(
        "TlTimeline-axisLabel",
        side === "left"
          ? "TlTimeline-axisLabel--left"
          : "TlTimeline-axisLabel--right",
        classes?.axisLabel,
      )}
      style={positionStyle}
    >
      {marker.label ? <Label>{marker.label}</Label> : <Label/>}
    </div>
  );
};

export default AxisLabel;
