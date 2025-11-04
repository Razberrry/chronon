import React from "react";
import clsx from "clsx";

import "./subrow.base.css";
import type { TimelineSubrowClasses } from "../../types/TimelineClasses";

export interface SubrowProps {
  children: React.ReactNode;
  classes?: TimelineSubrowClasses;
}

export const Subrow = ({ children, classes }: SubrowProps) => (
  <div className={clsx("TlTimeline-subrow", classes?.subrow)}>{children}</div>
);
