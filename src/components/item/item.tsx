import React from "react";
import clsx from "clsx";

import "./item.base.css";
import styles from "./item.module.css";
import type { Span } from "../../types";
import { useItem } from "./useItem";
import type { TimelineItemClasses } from "../../types/TimelineClasses";

export interface ItemProps {
  id: string;
  span: Span;
  children?: React.ReactNode;
  classes?: TimelineItemClasses;
  style?: React.CSSProperties;
}

export const Item: React.FC<ItemProps> = ({
  span,
  children,
  classes,
  style,
}) => {
  const {
    insetStartPixels,
    insetEndPixels,
    widthPixels,
    paddingStartPixels,
    paddingEndPixels,
  } = useItem({ span });

  const itemStyle = {
    "--tl-item-width": `${widthPixels}px`,
    "--tl-item-inset-start": `${insetStartPixels}px`,
    "--tl-item-inset-end": `${insetEndPixels}px`,
    "--tl-item-pad-start": `${paddingStartPixels}px`,
    "--tl-item-pad-end": `${paddingEndPixels}px`,
  } as React.CSSProperties;

  const combinedStyle = style ? { ...itemStyle, ...style } : itemStyle;

  return (
    <div
      className={clsx("TlTimeline-item", classes?.item)}
      style={combinedStyle}
      onClick={() => {
        console.log("lol");
      }}
    >
      <div className={clsx("TlTimeline-itemContent", classes?.content)}>
        {children}
      </div>
    </div>
  );
};
