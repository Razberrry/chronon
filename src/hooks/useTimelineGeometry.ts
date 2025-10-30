import { useElementRef } from "./useElementRef";
import type { TimelineGeometry } from "../types";

export const useTimelineGeometry = (): TimelineGeometry => {
	const {
		ref: timelineRef,
		setRef: setTimelineRef,
		direction,
	} = useElementRef();

	const {
		ref: viewportRef,
		setRef: setViewportRef,
		width: rawViewportWidth,
	} = useElementRef();

	const {
		ref: sidebarRef,
		setRef: setSidebarRef,
		width: sidebarWidth,
	} = useElementRef();

	const viewportWidth = Math.max(1, rawViewportWidth);
	const directionSign = direction === "rtl" ? -1 : 1;

	return {
		timelineRef,
		setTimelineRef,
		viewportRef,
		setViewportRef,
		sidebarRef,
		setSidebarRef,
		sidebarWidth,
		direction,
		directionSign,
		viewportWidth,
	};
};
