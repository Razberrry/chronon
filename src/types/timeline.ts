import { Range } from ".";

export interface PanEndEvent {
	clientX?: number;
	clientY?: number;
	deltaX: number;
	deltaY: number;
}

export type GetSpanFromScreenX = (screenX: number) => number;

export type GetDeltaXFromScreenX = (screenX: number) => number;

export type OnPanEnd = (event: PanEndEvent) => void;

export type PixelsToSpan = (pixels: number, range?: Range) => number;
export type SpanToPixels = (span: number, range?: Range) => number;

export interface TimelineContext {
	range: Range;
	direction: CanvasDirection;
	timelineRef: React.MutableRefObject<HTMLElement | null>;
	setTimelineRef: (element: HTMLElement | null) => void;
	sidebarWidth: number;
	sidebarRef: React.MutableRefObject<HTMLElement | null>;
	setSidebarRef: (element: HTMLElement | null) => void;
	spanToPixels: SpanToPixels;
	pixelsToSpan: PixelsToSpan;
	getSpanFromScreenX: GetSpanFromScreenX;
	getDeltaXFromScreenX: GetDeltaXFromScreenX;
	onPanEnd: OnPanEnd
	onRangeChanged: OnRangeChanged;
}

export type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;



export interface UseTimelineProps {
	range: Range;
	onRangeChanged: OnRangeChanged;
}	
