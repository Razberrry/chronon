import React from "react";
import styles from "./simpleTickLabel.module.css";

type SimpleTickLabelProps = {
  label?: string;
};

const SimpleTickLabel: React.FC<SimpleTickLabelProps> = () => (
  <div className={styles.labelContainer}>
    <div className={styles.line} />
  </div>
);

export default SimpleTickLabel;
