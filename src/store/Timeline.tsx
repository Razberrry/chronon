import { createContext } from "react";

import { useTimeline } from "../hooks/useTimeline";
import type { TimelineBag, TimelineContextProps } from "../types";
import React from "react";

export const timelineContext = createContext<TimelineBag | undefined>(
	undefined,
);

export const TimelineProvider = timelineContext.Provider;

const TimelineProviderInner = (props: TimelineContextProps) => {
	const timeline = useTimeline(props);

	return <TimelineProvider value={timeline}>{props.children}</TimelineProvider>;
};

export const TimelineContext = (props: TimelineContextProps) => {
	return (
			<TimelineProviderInner {...props}>{props.children}</TimelineProviderInner>
	);
};
