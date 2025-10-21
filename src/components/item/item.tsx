import React from "react";
import clsx from "clsx";

import "./item.base.css";
import styles from "./item.module.css";
import type { Span } from "../../types";
import { useItem } from "./useItem";
import { TimelineItemClasses } from "../../types/TimelineClasses";


const TL_ITEM_CLASS = "TlTimeline-item";
const TL_ITEM_CONTENT_CLASS = "TlTimeline-itemContent";

export interface ItemProps {
  id: string;
  span: Span;
  children: React.ReactNode;
  classes?: TimelineItemClasses; 
};

export const Item: React.FC<ItemProps> = ({  span, children, classes }) => {
  const {
    insetStartPixels,
    insetEndPixels,
    widthPixels,
    paddingStartPixels,
    paddingEndPixels,
  } = useItem({ span });

  return (
    <div
      className={clsx(TL_ITEM_CLASS, classes?.item)}
      data-tl-item-width={widthPixels}
      data-tl-item-inset-start={insetStartPixels}
      data-tl-item-inset-end={insetEndPixels}
    >
      <div
        className={clsx(TL_ITEM_CONTENT_CLASS, classes?.content)}
        data-tl-item-pad-start={paddingStartPixels}
        data-tl-item-pad-end={paddingEndPixels}
      >
        <div className={clsx(classes?.innerContainer ?? styles.itemInnerContainer)}>
          {children}
        </div>
      </div>
    </div>
  );
};
