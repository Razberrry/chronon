import React from "react";
import clsx from "clsx";
import "./subrow.base.css";
import type { TimelineSubrowClasses } from "../../types/TimelineClasses";

const TL_SUBROW_CLASS = "TlTimeline-subrow";

export interface SubrowProps {
  children: React.ReactNode;
  classes?: TimelineSubrowClasses;
}

export const Subrow = ({ children, classes }: SubrowProps) => {
  return (
    <div className={clsx(TL_SUBROW_CLASS, classes?.subrow)}>
      {children}
    </div>
  );
};
