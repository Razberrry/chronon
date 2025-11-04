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
}

export const SimpleItem: React.FC<ItemProps> = ({
  span,
  children,
  classes,
}) => {
  const { insetStartPixels, insetEndPixels, widthPixels } = useSimpleItem({
    span,
  });

  const itemStyle = {
    "--tl-item-width": `${widthPixels}px`,
    "--tl-item-inset-start": `${insetStartPixels}px`,
    "--tl-item-inset-end": `${insetEndPixels}px`,
  } as React.CSSProperties;

  return (
    <div
      className={clsx("TlTimeline-simple-item", classes?.item)}
      style={itemStyle}
    >
      {children}
    </div>
  );
};
