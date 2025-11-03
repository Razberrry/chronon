import React from "react";
import styles from "./tickWithLineLabel.module.css";

type TickWithLineLabelProps = {
  label?: string;
};

const TickWithLineLabel: React.FC<TickWithLineLabelProps> = ({ label }) => (
  <div className={styles.labelContainer}>
    <div className={styles.label}>{label}</div>
    <div className={styles.line} />
  </div>
);

export default TickWithLineLabel;
