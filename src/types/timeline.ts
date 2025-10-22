import type { CSSProperties, PropsWithChildren } from "react";
import { Range } from ".";
export interface PanEndEvent {
	clientX?: number;
	clientY?: number;
	deltaX: number;
	deltaY: number;
}


export type GetValueFromScreenX = (screenX: number) => number;

export type GetDeltaXFromScreenX = (screenX: number) => number;

export type OnPanEnd = (event: PanEndEvent) => void;

export type PixelsToValue = (pixels: number, range?: Range) => number;
export type ValueToPixels = (value: number, range?: Range) => number;

export interface TimelineBag {
	style: CSSProperties;
	range: Range;
	rangeGridSize?: number;
	direction: CanvasDirection;
	timelineRef: React.MutableRefObject<HTMLElement | null>;
	setTimelineRef: (element: HTMLElement | null) => void;
	sidebarWidth: number;
	sidebarRef: React.MutableRefObject<HTMLElement | null>;
	setSidebarRef: (element: HTMLElement | null) => void;
	valueToPixels: ValueToPixels;
	pixelsToValue: PixelsToValue;
	getValueFromScreenX: GetValueFromScreenX;
	getDeltaXFromScreenX: GetDeltaXFromScreenX;
	onPanEnd: OnPanEnd
	onRangeChanged: OnRangeChanged;
}

export type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;

export interface GridSizeDefinition {
	value: number;
	maxRangeSize?: number;
}

export interface UseTimelineProps {
	range: Range;
	overlayed?: boolean;
	resizeHandleWidth?: number;
	onRangeChanged: OnRangeChanged;
	rangeGridSizeDefinition?: number | GridSizeDefinition[];
}

export interface TimelineContextProps
	extends PropsWithChildren,
		UseTimelineProps {}
	
