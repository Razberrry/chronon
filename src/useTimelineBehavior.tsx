import { useTimelineAutoPanUntilInteraction } from "./hooks/useTimelineAutoPanUntilInteraction";
import { useTimelineMousePanAndZoom } from "./hooks/useTimelineMousePanAndZoom";

export const useTimelineBehavior = (): null => {
  useTimelineAutoPanUntilInteraction();
  useTimelineMousePanAndZoom();
  return null;
};