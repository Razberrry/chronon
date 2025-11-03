import React from "react";
import styles from "./DefaultLabel.module.css";

type DefaultLabelProps = {
  label?: string;
};

const DefaultLabel: React.FC<DefaultLabelProps> = ({ label }) => (
  <div className={styles.label}>{label}</div>
);

export default DefaultLabel;
