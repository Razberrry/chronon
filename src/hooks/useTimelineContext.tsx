import { useContext } from "react";

import { timelineContext } from "../store/Timeline";

const useTimelineContext = () => {
	const contextValue = useContext(timelineContext);

	if (contextValue === undefined) {
		throw new Error(
			"cronon: useTimelineContext() must be used within a TimelineContext",
		);
	}

	return contextValue;
};

export default useTimelineContext;
