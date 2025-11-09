import type { Span } from ".";

export interface ItemDefinition {
  id: string;
  rowId: string;
  span: Span;
}

export interface UseItemProps extends Pick<ItemDefinition, "id" | "span"> {
  data?: object;
}
