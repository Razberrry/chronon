import { endOfDay, startOfDay } from "date-fns";

import type { ItemDefinition, Span } from "../types";

export const expandSpanToFullDays = (span: Span): Span => {
  const { start, end } = span;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return span;
  }

  const normalizedStart = startOfDay(start).getTime();
  const endSource = end >= start ? end : start;
  const normalizedEnd = endOfDay(endSource).getTime();

  return {
    start: normalizedStart,
    end: Math.max(normalizedEnd, normalizedStart),
  };
};

export const mapItemsToFullDaySpans = (
  items: readonly ItemDefinition[]
): ItemDefinition[] =>
  items.map(
    (item): ItemDefinition => ({
      ...item,
      span: expandSpanToFullDays(item.span),
    })
  );
