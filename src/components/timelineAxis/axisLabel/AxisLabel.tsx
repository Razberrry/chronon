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

  return (
    <div
      className={clsx("TlTimeline-axisLabel", classes?.axisLabel)}
      data-tl-axis-left={side === "left" ? marker.sideDelta : undefined}
      data-tl-axis-right={side === "right" ? marker.sideDelta : undefined}
    >
      {marker.label ? <Label>{marker.label}</Label> : <Label/>}
    </div>
  );
};

export default AxisLabel;
