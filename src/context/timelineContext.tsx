import { createContext } from "react";

import { useTimeline } from "../hooks/useTimeline";
import type { TimelineContext, UseTimelineProps } from "../types";
import React from "react";

const timelineContext = createContext<TimelineContext | undefined>(
	undefined,
);

export const useTimelineContext = (): TimelineContext => {
	const context = React.useContext(timelineContext);

	if (!context) {
		throw new Error(
			"useTimelineContext must be used within a TimelineContextProvider",
		);
	}

	return context;
}

export const TimelineContextProvider = ({children, ...props}: React.PropsWithChildren<TimelineContext>) => {
	const timeline = useTimeline(props);

	return (
		<timelineContext.Provider value={timeline}>
			{children}
		</timelineContext.Provider>
	);
};
