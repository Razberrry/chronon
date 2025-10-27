import { hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { nanoid } from "nanoid";
import { Span,Range, RowDefinition, ItemDefinition } from "./types";
import { id } from "date-fns/locale";

interface GenerateRowsOptions {
	disabled?: boolean;
}

export const generateRows = (count: number, options?: GenerateRowsOptions) => {
	return Array(count)
		.fill(0)
		.map((_,index): RowDefinition => {
			const disabled = options?.disabled;

			let id = `row-${index}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				disabled,
			};
		});
};

const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

const DEFAULT_MIN_DURATION = hoursToMilliseconds(10);
const DEFAULT_MAX_DURATION = hoursToMilliseconds(168);

export const generateRandomSpan = (
	range: Range,
	minDuration: number = DEFAULT_MIN_DURATION,
	maxDuration: number = DEFAULT_MAX_DURATION,
): Span => {
	const duration = getRandomInRange(minDuration, maxDuration);

	const start = getRandomInRange(range.start, range.end - duration);

	const end = start + duration;

	return {
		start: start,
		end: end,
	};
};

interface GenerateItemsOptions {
	disabled?: boolean;
	background?: boolean;
	minDuration?: number;
	maxDuration?: number;
}

export const generateItems = (
	count: number,
	range: Range,
	rows: RowDefinition[],
	options?: GenerateItemsOptions
) => {

	let idNum = 0;
	return Array(count)
		.fill(0)
		.map((): ItemDefinition => {
			const row = rows[Math.ceil(Math.random() * rows.length - 1)];
			const rowId = row.id;
			const disabled = row.disabled || options?.disabled;

			const span = generateRandomSpan(
				range,
				options?.minDuration,
				options?.maxDuration,
		);

			let id = `item-${nanoid()}`;
			idNum = idNum + 1;
			if (disabled) id += " (disabled)";

			return {
				id,
				rowId,
				span,
				disabled,
			};
		});
};

export const sortItemsByStart = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
): T[] => [...items].sort((a, b) => (a.span.start > b.span.start ? 1 : -1));

export const groupSortedItemsToSubrows = <
	T extends ItemDefinition = ItemDefinition,
>(
	sortedItems: readonly T[],
	span?: Span,
) =>
	sortedItems.reduce<Record<string, T[][]>>((acc, item) => {
		if (span && (item.span.start >= span.end || item.span.end <= span.start))
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [[item]];
			return acc;
		}

		for (let index = 0; index < acc[item.rowId].length; index++) {
			const currentSubrow = acc[item.rowId][index];
			const lastItemInSubrow = currentSubrow[currentSubrow.length - 1];
			if (item.span.start >= lastItemInSubrow.span.end) {
				acc[item.rowId][index].push(item);
				return acc;
			}
		}

		acc[item.rowId].push([item]);
		return acc;
	}, {});

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

const assignItemToSubrows = <T extends ItemDefinition>(
	subrows: T[][],
	item: T,
) => {
	for (let index = 0; index < subrows.length; index++) {
		const currentSubrow = subrows[index];
		const lastItemInSubrow = currentSubrow[currentSubrow.length - 1];
		if (item.span.start >= lastItemInSubrow.span.end) {
			currentSubrow.push(item);
			return;
		}
	}

	subrows.push([item]);
};

export const groupItemsByRowSorted = <
	T extends ItemDefinition = ItemDefinition,
>(
	items: T[],
) => {
	const itemsByRow = groupItemsToRows(items);
	return Object.keys(itemsByRow).reduce<Record<string, T[]>>(
		(acc, rowId) => {
			acc[rowId] = sortItemsByStart(itemsByRow[rowId]);
			return acc;
		},
		{},
	);
};

export const buildVisibleSubrowsForRow = <
	T extends ItemDefinition = ItemDefinition,
>(
	sortedRowItems: readonly T[],
	span?: Span,
) => {
	const subrows: T[][] = [];
	if (!sortedRowItems.length) return subrows;

	const startIndex =
		span && typeof span.start === "number"
			? findFirstIntersectingItemIndex(sortedRowItems, span.start)
			: 0;

	for (let index = startIndex; index < sortedRowItems.length; index++) {
		const item = sortedRowItems[index];

		if (span) {
			if (item.span.start >= span.end) break;
			if (item.span.end <= span.start) continue;
		}

		assignItemToSubrows(subrows, item);
	}

	return subrows;
};

export const buildVisibleRowSubrows = <
	T extends ItemDefinition = ItemDefinition,
>(
	sortedItemsByRow: Record<string, readonly T[]>,
	span?: Span,
) => {
	const result: Record<string, T[][]> = {};

	Object.entries(sortedItemsByRow).forEach(([rowId, sortedRowItems]) => {
		const subrows = buildVisibleSubrowsForRow(sortedRowItems, span);
		if (subrows.length) {
			result[rowId] = subrows;
		}
	});

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
	return items.reduce<Record<string, T[]>>((acc, item) => {
		if (span && (item.span.start >= span.end || item.span.end <= span.start))
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [item];
		} else {
			acc[item.rowId].push(item);
		}

		return acc;
	}, {});
};
