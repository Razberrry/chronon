import { RowDefinition, Span, Range, ItemDefinition } from "../types/index";

import { nanoid } from "nanoid";
import { hoursToMilliseconds } from "date-fns";
export interface GenerateRowsOptions {
  disabled?: boolean;
}

const getRandomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const DEFAULT_MIN_DURATION = hoursToMilliseconds(10);
const DEFAULT_MAX_DURATION = hoursToMilliseconds(100);

export const generateRows = (count: number, options?: GenerateRowsOptions) =>
  Array.from({ length: count }, (_, index): RowDefinition => {
    let id = `row-${index}`;

    return { id };
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
  maxDuration: number = DEFAULT_MAX_DURATION
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
  options?: GenerateItemsOptions
) =>
  Array.from({ length: count }, (): ItemDefinition => {
    const row = rows[Math.floor(Math.random() * rows.length)];

    const span = generateRandomSpan(
      range,
      options?.minDuration,
      options?.maxDuration
    );

    let id = `item-${nanoid()}`;

    return {
      id,
      rowId: row.id,
      span,
    };
  });

export const generateFixedSpan = (range: Range, duration: number): Span => {
  const start = getRandomInRange(range.start, range.end - duration);
  const end = start + duration;
  return { start, end };
};

export const generateFixedLengthItems = (
  count: number,
  range: Range,
  rows: RowDefinition[],
  options?: GenerateItemsOptions
): ItemDefinition[] => {
  const duration = hoursToMilliseconds(5);

  return Array.from({ length: count }, (): ItemDefinition => {
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const span = generateFixedSpan(range, duration);
    const id = `item-${nanoid()}`;

    return {
      id,
      rowId: randomRow.id,
      span,
    };
  });
};
