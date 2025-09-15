import React from "react";
import { useItem, type Span } from "dnd-timeline";
import styles from "./item.module.css";

type ItemProps = {
  id: string;
  span: Span;
  children: React.ReactNode;
};


const Item: React.FC<ItemProps> = ({ id, span, children }) => {
  const { itemStyle, itemContentStyle } = useItem({
    id,
    span,
  });

  return (
    <div style={itemStyle}>
      <div style={itemContentStyle}>
        <div className={styles.itemInnerContainer}>{children}</div>
      </div>
    </div>
  );
};

export default Item;
