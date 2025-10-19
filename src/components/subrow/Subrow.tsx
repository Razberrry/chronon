import React from "react";
import clsx from "clsx";
import "./subrow.base.css";
import { TimelineSubrowClasses, TL_SUBROW_CLASS } from "./subrowClasses";

interface SubrowProps {
  children: React.ReactNode;
  classes?: TimelineSubrowClasses;
}

const Subrow = ({ children, classes }: SubrowProps) => {
  return (
    <div className={clsx(TL_SUBROW_CLASS, classes?.subrow)}>
      {children}
    </div>
  );
};

export default Subrow;