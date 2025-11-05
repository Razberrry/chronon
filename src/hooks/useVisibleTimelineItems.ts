import { useMemo } from "react";

import { hoursToMilliseconds } from "date-fns";

import { useTimelineContext } from "../context/timelineContext";
import type { ItemDefinition, RowDefinition } from "../types";
import {
  filterItemsBySpan,
  groupItemsToSubrows,
  mapItemsToFullDaySpans,
} from "../utils";

export interface UseVisibleTimelineItemsParams {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export interface UseVisibleTimelineItemsResult {
  subrowsByRow: Record<string, ItemDefinition[][]>;
  rowIdWithMostVisibleLanes?: string;
  isWeekly: boolean;
}

export const useVisibleTimelineItems = ({
  rows,
  items,
}: UseVisibleTimelineItemsParams): UseVisibleTimelineItemsResult => {
  const { range } = useTimelineContext();

  const isWeekly = useMemo(
    () => hoursToMilliseconds(7 * 24) <= range.end - range.start,
    [range]
  );

  const visibleItems = useMemo(
    () => filterItemsBySpan(items, range),
    [items, range.start, range.end]
  );

  const itemsToGroup = useMemo(
    () =>
      isWeekly ? mapItemsToFullDaySpans(visibleItems, range) : visibleItems,
    [visibleItems, isWeekly, range.start, range.end]
  );

  const subrowsByRow = useMemo(
    () => groupItemsToSubrows(itemsToGroup, range),
    [itemsToGroup, range.start, range.end]
  );

  const rowIdWithMostVisibleLanes = useMemo(() => {
    let selectedRowId: string | undefined;
    let highestLaneCount = -1;

    for (const row of rows) {
      const laneCount = subrowsByRow[row.id]?.length ?? 0;
      if (laneCount > highestLaneCount) {
        highestLaneCount = laneCount;
        selectedRowId = row.id;
      }
    }

    return selectedRowId ?? rows[0]?.id;
  }, [rows, subrowsByRow]);

  return {
    subrowsByRow,
    rowIdWithMostVisibleLanes,
    isWeekly,
  };
};
