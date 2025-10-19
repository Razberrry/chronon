import type { Data } from "@dnd-kit/core";

import type {
	Span,
} from ".";

export type DragDirection = "start" | "end";

export interface ItemDefinition {
	id: string;
	rowId: string;
	disabled?: boolean;
	span: Span;
}

export interface UseItemProps
	extends Pick<ItemDefinition, "id" | "span" | "disabled"> {
	data?: object;
}

export interface ItemData extends Data {
	span: Span;
}







