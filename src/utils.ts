import { minutesToMilliseconds } from "date-fns";
import { nanoid } from "nanoid";
import { Span,Range, RowDefinition, ItemDefinition } from "./types";

interface GenerateRowsOptions {
	disabled?: boolean;
}

export const generateRows = (count: number, options?: GenerateRowsOptions) => {
	return Array(count)
		.fill(0)
		.map((): RowDefinition => {
			const disabled = options?.disabled;

			let id = `row-${nanoid(4)}`;
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

const DEFAULT_MIN_DURATION = minutesToMilliseconds(60);
const DEFAULT_MAX_DURATION = minutesToMilliseconds(360);

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
	options?: GenerateItemsOptions,
) => {
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

			let id = `item-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				rowId,
				span,
				disabled,
			};
		});
};

export const groupItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	span?: Span,
) => {
	const sortedItems = [...items];
	sortedItems.sort((a, b) => (a.span.start > b.span.start ? 1 : -1));

	return sortedItems.reduce<Record<string, T[][]>>((acc, item) => {
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
};

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
