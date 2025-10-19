import React from "react";
import styles from "./simpleTickLabel.module.css";

const SimpleTickLabel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <div className={styles.labelContainer}> 
      <div className={styles.line}/>
    </div>
);

export default SimpleTickLabel;
