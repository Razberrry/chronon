
import type {
	Span,
} from ".";

type AnyData = Record<string, any>;
type Data<T = AnyData> = T & AnyData;

export interface ItemDefinition {
	id: string;
	rowId: string;
	disabled?: boolean;
	span: Span;
}

export interface UseItemProps
	extends Pick<ItemDefinition, "id" | "span" > {
	data?: object;
}

export interface ItemData extends Data {
	span: Span;
}







