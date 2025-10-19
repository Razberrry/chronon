import { useTimelineAutoPanUntilInteraction } from "./useTimelineAutoPanUntilInteraction";
import { useTimelineMousePanAndZoom } from "./useTimelineMousePanAndZoom";

export const useTimelineBehavior = (): null => {
  useTimelineAutoPanUntilInteraction();
  useTimelineMousePanAndZoom();
  return null;
};