import React from "react";
import styles from "./DefaultLabel.module.css";

const DefaultLabel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles.label}>{children}</div>
);

export default DefaultLabel;
