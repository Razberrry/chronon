import type { ItemDefinition, Span } from "../types";

export const sortItemsByStart = <T extends ItemDefinition = ItemDefinition>(
	items: readonly T[],
): T[] =>
	[...items].sort((a, b) => (a.span.start > b.span.start ? 1 : -1));

const maybeSortByStart = <T extends ItemDefinition>(
	items: readonly T[],
): readonly T[] => {
	if (items.length < 2) return items;

	for (let index = 1; index < items.length; index++) {
		const current = items[index];
		const previous = items[index - 1];
		if (previous.span.start > current.span.start) {
			return sortItemsByStart(items);
		}
	}

	return items;
};

const pushIntoFirstAvailableSubrow = <T extends ItemDefinition>(
	subrows: T[][],
	item: T,
) => {
	for (const subrow of subrows) {
		const lastItem = subrow[subrow.length - 1];
		if (item.span.start >= lastItem.span.end) {
			subrow.push(item);
			return;
		}
	}

	subrows.push([item]);
};

const findFirstIntersectingItemIndex = <T extends ItemDefinition>(
	sortedItems: readonly T[],
	visibleRangeStart: number,
) => {
	let low = 0;
	let high = sortedItems.length - 1;
	let result = sortedItems.length;

	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const item = sortedItems[mid];
		if (item.span.end > visibleRangeStart) {
			result = mid;
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}

	return result;
};

const isOutsideSpan = <T extends ItemDefinition>(item: T, span?: Span) =>
	!!span && (item.span.start >= span.end || item.span.end <= span.start);

export const groupSortedItemsToSubrows = <
	T extends ItemDefinition = ItemDefinition,
>(
	items: readonly T[],
	span?: Span,
) => {
	const sortedItems = maybeSortByStart(items);
	const subrowsByRow: Record<string, T[][]> = {};

	for (const item of sortedItems) {
		if (isOutsideSpan(item, span)) continue;

		const subrows =
			subrowsByRow[item.rowId] ?? (subrowsByRow[item.rowId] = []);

		pushIntoFirstAvailableSubrow(subrows, item);
	}

	return subrowsByRow;
};

export const buildVisibleSubrowsForRow = <
	T extends ItemDefinition = ItemDefinition,
>(
	rowItems: readonly T[],
	span?: Span,
) => {
	const orderedItems = maybeSortByStart(rowItems);
	const subrows: T[][] = [];
	if (!orderedItems.length) return subrows;

	const startIndex =
		span && typeof span.start === "number"
			? findFirstIntersectingItemIndex(orderedItems, span.start)
			: 0;

	for (let index = startIndex; index < orderedItems.length; index++) {
		const item = orderedItems[index];

		if (span) {
			if (item.span.start >= span.end) break;
			if (item.span.end <= span.start) continue;
		}

		pushIntoFirstAvailableSubrow(subrows, item);
	}

	return subrows;
};

export const buildVisibleRowSubrows = <
	T extends ItemDefinition = ItemDefinition,
>(
	itemsByRow: Record<string, readonly T[]>,
	span?: Span,
) => {
	const result: Record<string, T[][]> = {};

	for (const [rowId, rowItems] of Object.entries(itemsByRow)) {
		const subrows = buildVisibleSubrowsForRow(rowItems, span);
		if (subrows.length) {
			result[rowId] = subrows;
		}
	}

	return result;
};

export const groupItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	span?: Span,
) => groupSortedItemsToSubrows(sortItemsByStart(items), span);

export const groupItemsToRows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	span?: Span,
) => {
	const grouped: Record<string, T[]> = {};

	for (const item of items) {
		if (isOutsideSpan(item, span)) continue;
		(grouped[item.rowId] ??= []).push(item);
	}

	return grouped;
};

export const groupItemsByRowSorted = <
	T extends ItemDefinition = ItemDefinition,
>(
	items: T[],
) => {
	const itemsByRow = groupItemsToRows(items);
	const sortedItemsByRow: Record<string, T[]> = {};

	for (const rowId of Object.keys(itemsByRow)) {
		sortedItemsByRow[rowId] = sortItemsByStart(itemsByRow[rowId]);
	}

	return sortedItemsByRow;
};
