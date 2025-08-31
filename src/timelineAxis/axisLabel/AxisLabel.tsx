import React from "react";
import styles from "./AxisLabel.module.css";
import { Marker } from "../timelineAxisTypes";
import DefaultLabel from "../DefaultLabel/defaultLabel";

type AxisLabelProps = {
  side: "left" | "right";
  marker: Marker;
};

const AxisLabel: React.FC<AxisLabelProps> = ({ side, marker }) => {
  const Label = marker.Override ?? DefaultLabel;

  return (
    <div
      className={styles.AxisLabel}
      style={{ [side]: `${marker.sideDelta}px` } as React.CSSProperties}
    >
      {marker.label ? <Label>{marker.label}</Label> : <Label/>}
    </div>
  );
};

export default AxisLabel;
