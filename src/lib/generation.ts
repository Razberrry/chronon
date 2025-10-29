import { hoursToMilliseconds } from "date-fns";
import { nanoid } from "nanoid";
import type { ItemDefinition, Range, RowDefinition, Span } from "../types";

export interface GenerateRowsOptions {
	disabled?: boolean;
}

const getRandomInRange = (min: number, max: number) =>
	Math.random() * (max - min) + min;

const DEFAULT_MIN_DURATION = hoursToMilliseconds(10);
const DEFAULT_MAX_DURATION = hoursToMilliseconds(168);

export const generateRows = (count: number, options?: GenerateRowsOptions) =>
	Array.from({ length: count }, (_, index): RowDefinition => {
		const disabled = options?.disabled;

		let id = `row-${index}`;
		if (disabled) id += " (disabled)";

		return { id, disabled };
	});

export interface GenerateItemsOptions {
	disabled?: boolean;
	background?: boolean;
	minDuration?: number;
	maxDuration?: number;
}

export const generateRandomSpan = (
	range: Range,
	minDuration: number = DEFAULT_MIN_DURATION,
	maxDuration: number = DEFAULT_MAX_DURATION,
): Span => {
	const duration = getRandomInRange(minDuration, maxDuration);
	const start = getRandomInRange(range.start, range.end - duration);
	const end = start + duration;

	return { start, end };
};

export const generateItems = (
	count: number,
	range: Range,
	rows: RowDefinition[],
	options?: GenerateItemsOptions,
) =>
	Array.from({ length: count }, (): ItemDefinition => {
		const row = rows[Math.floor(Math.random() * rows.length)];
	
		const span = generateRandomSpan(
			range,
			options?.minDuration,
			options?.maxDuration,
		);

		let id = `item-${nanoid()}`;

		return {
			id,
			rowId: row.id,
			span,
		};
	});
