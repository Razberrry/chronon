import { useTimelineContext } from "../context/timelineContext";

import { useRafPanEndBuffer } from "./useRafPanEndBuffer";
import { useTimelinePointerPan } from "./useTimelinePointerPan";
import { useTimelineWheelZoom } from "./useTimelineWheelZoom";

export { buildPanEndEvent } from "./useRafPanEndBuffer";

export const useTimelineMousePanAndZoom = (): void => {
  const { onPanEnd } = useTimelineContext();
  const panEndQueue = useRafPanEndBuffer(onPanEnd);

  useTimelinePointerPan(panEndQueue);
  useTimelineWheelZoom(panEndQueue);
};
