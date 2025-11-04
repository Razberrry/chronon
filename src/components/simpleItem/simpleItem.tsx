import React from "react";
import clsx from "clsx";

import "./simpleItem.base.css";
import type { Span } from "../../types";
import type { TimelineItemClasses } from "../../types/TimelineClasses";
import { useSimpleItem } from "./useSimpleItem";
export interface ItemProps {
  id: string;
  span: Span;
  children?: React.ReactNode;
  classes?: TimelineItemClasses;
  style?: React.CSSProperties;
}

export const SimpleItem: React.FC<ItemProps> = ({
  span,
  children,
  classes,
  style,
}) => {
  const { insetStartPixels, widthPixels } = useSimpleItem({
    span,
  });

  const itemStyle = {
    "--tl-item-width": `${widthPixels}px`,
  } as React.CSSProperties;

  const combinedStyle = style ? { ...itemStyle, ...style } : itemStyle;

  return (
    <div
      className={clsx("TlTimeline-simple-item", classes?.item)}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};
