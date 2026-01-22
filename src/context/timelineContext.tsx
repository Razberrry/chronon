import { createContext } from "react";

import type { TimelineContext } from "../types";
import React from "react";

const timelineContext = createContext<TimelineContext | undefined>(undefined);

export const useTimelineContext = (): TimelineContext => {
  const context = React.useContext(timelineContext);

  if (!context) {
    throw new Error(
      "useTimelineContext must be used within a TimelineContextProvider"
    );
  }

  return context;
};

export const TimelineContextProvider = ({
  children,
  ...props
}: React.PropsWithChildren<TimelineContext>) => {
  return (
    <timelineContext.Provider value={props}>
      {children}
    </timelineContext.Provider>
  );
};
