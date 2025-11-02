import type { ItemDefinition, Span } from "../types";

export const sortItemsByStart = <T extends ItemDefinition = ItemDefinition>(
  items: readonly T[]
): T[] => {
  if (items.length < 2) return items.slice();
  return [...items].sort((a, b) => a.span.start - b.span.start);
};

const ensureSortedByStart = <T extends ItemDefinition>(
  items: readonly T[]
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

type HeapNode = {
  end: number;
  index: number;
};

const siftUp = (heap: HeapNode[], index: number) => {
  const node = heap[index];
  while (index > 0) {
    const parent = (index - 1) >> 1;
    if (heap[parent].end <= node.end) break;
    heap[index] = heap[parent];
    index = parent;
  }
  heap[index] = node;
};

const siftDown = (heap: HeapNode[], index: number) => {
  const lastIndex = heap.length - 1;
  const node = heap[index];

  while (true) {
    const left = index * 2 + 1;
    if (left > lastIndex) break;

    const right = left + 1;
    let smallest = left;

    if (right <= lastIndex && heap[right].end < heap[left].end) {
      smallest = right;
    }

    if (heap[smallest].end >= node.end) break;

    heap[index] = heap[smallest];
    index = smallest;
  }

  heap[index] = node;
};

const addToSubrows = <T extends ItemDefinition>(
  subrows: T[][],
  heap: HeapNode[],
  item: T
) => {
  const available = heap[0];

  if (available && available.end <= item.span.start) {
    subrows[available.index].push(item);
    available.end = item.span.end;
    siftDown(heap, 0);
    return;
  }

  const index = subrows.length;
  subrows.push([item]);
  heap.push({ end: item.span.end, index });
  siftUp(heap, heap.length - 1);
};

const findFirstIntersectingItemIndex = <T extends ItemDefinition>(
  sortedItems: readonly T[],
  visibleRangeStart: number
) => {
  let low = 0;
  let high = sortedItems.length - 1;
  let result = sortedItems.length;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (sortedItems[mid].span.end > visibleRangeStart) {
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
  T extends ItemDefinition = ItemDefinition
>(
  items: readonly T[],
  span?: Span
) => {
  const sortedItems = ensureSortedByStart(items);
  const state = new Map<string, { subrows: T[][]; heap: HeapNode[] }>();

  for (const item of sortedItems) {
    if (isOutsideSpan(item, span)) continue;

    let entry = state.get(item.rowId);
    if (!entry) {
      entry = { subrows: [], heap: [] };
      state.set(item.rowId, entry);
    }

    addToSubrows(entry.subrows, entry.heap, item);
  }

  const result: Record<string, T[][]> = {};
  for (const [rowId, { subrows }] of state.entries()) {
    if (subrows.length) {
      result[rowId] = subrows;
    }
  }

  return result;
};

export const buildVisibleSubrowsForRow = <
  T extends ItemDefinition = ItemDefinition
>(
  rowItems: readonly T[],
  span?: Span
) => {
  const orderedItems = ensureSortedByStart(rowItems);
  if (!orderedItems.length) return [];

  const startIndex =
    span && typeof span.start === "number"
      ? findFirstIntersectingItemIndex(orderedItems, span.start)
      : 0;

  const subrows: T[][] = [];
  const heap: HeapNode[] = [];

  for (let index = startIndex; index < orderedItems.length; index++) {
    const item = orderedItems[index];
    if (span) {
      if (item.span.start >= span.end) break;
      if (item.span.end <= span.start) continue;
    }

    addToSubrows(subrows, heap, item);
  }

  return subrows;
};

export const buildVisibleRowSubrows = <
  T extends ItemDefinition = ItemDefinition
>(
  itemsByRow: Record<string, readonly T[]>,
  span?: Span
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
  span?: Span
) => groupSortedItemsToSubrows(items, span);

export const groupItemsToRows = <T extends ItemDefinition = ItemDefinition>(
  items: T[],
  span?: Span
) => {
  const grouped: Record<string, T[]> = Object.create(null);

  for (const item of items) {
    if (isOutsideSpan(item, span)) continue;
    (grouped[item.rowId] ??= []).push(item);
  }

  return grouped;
};

export const groupItemsByRowSorted = <
  T extends ItemDefinition = ItemDefinition
>(
  items: T[]
) => {
  const itemsByRow = groupItemsToRows(items);

  for (const rowId of Object.keys(itemsByRow)) {
    const row = itemsByRow[rowId];
    if (row.length > 1) {
      row.sort((a, b) => a.span.start - b.span.start);
    }
  }

  return itemsByRow;
};
