import type { MutableRefObject } from "react";

import { Range } from ".";

export interface PanEndEvent {
	clientX?: number;
	clientY?: number;
	deltaX: number;
	deltaY: number;
}

export type GetSpanFromScreenX = (screenX: number) => number;
export type GetSpanFromScreenXForRange = (
	screenX: number,
	range: Range,
) => number;
export type GetDeltaXFromScreenX = (screenX: number) => number;

export type OnPanEnd = (event: PanEndEvent) => void;
export type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;

export type PixelsToSpan = (pixels: number, range?: Range) => number;
export type SpanToPixels = (span: number, range?: Range) => number;

export interface ZoomLimits {
	minRangeMilliseconds: number;
	maxRangeMilliseconds: number;
}

export type ZoomLimitsConfig = Partial<ZoomLimits>;

export interface TimelineGeometry {
	timelineRef: MutableRefObject<HTMLElement | null>;
	setTimelineRef: (element: HTMLElement | null) => void;
	sidebarRef: MutableRefObject<HTMLElement | null>;
	setSidebarRef: (element: HTMLElement | null) => void;
	sidebarWidth: number;
	direction: CanvasDirection;
	directionSign: number;
	viewportWidth: number;
}

export interface TimelineConversions {
	spanToPixels: SpanToPixels;
	pixelsToSpan: PixelsToSpan;
	getDeltaXFromScreenX: GetDeltaXFromScreenX;
	getSpanFromScreenX: GetSpanFromScreenX;
	getSpanFromScreenXForRange: GetSpanFromScreenXForRange;
}

export interface TimelinePanOptions {
	directionSign: number;
	pixelsToSpan: PixelsToSpan;
	getSpanFromScreenXForRange: GetSpanFromScreenXForRange;
	onRangeChanged: OnRangeChanged;
	zoomLimits: ZoomLimits;
}

export interface TimelineContext {
	range: Range;
	direction: CanvasDirection;
	timelineRef: MutableRefObject<HTMLElement | null>;
	setTimelineRef: (element: HTMLElement | null) => void;
	sidebarWidth: number;
	sidebarRef: MutableRefObject<HTMLElement | null>;
	setSidebarRef: (element: HTMLElement | null) => void;
	spanToPixels: SpanToPixels;
	pixelsToSpan: PixelsToSpan;
	getSpanFromScreenX: GetSpanFromScreenX;
	getDeltaXFromScreenX: GetDeltaXFromScreenX;
	onPanEnd: OnPanEnd;
	onRangeChanged: OnRangeChanged;
	zoomLimits: ZoomLimits;
}

export interface UseTimelineProps {
	range: Range;
	onRangeChanged: OnRangeChanged;
	zoomLimits?: ZoomLimitsConfig;
}
