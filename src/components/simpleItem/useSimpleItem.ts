import { useTimelineContext } from "../../context/timelineContext";
import type { Span } from "../../types";

export type UseItemProps = {
  span: Span;
};

export type UseItemWrapperComputed = {
  insetStartPixels: number;
  insetEndPixels: number;
  widthPixels: number;
};

export const useSimpleItem = ({
  span,
}: UseItemProps): UseItemWrapperComputed => {
  const { range, spanToPixels } = useTimelineContext();

  const insetStartPixels = spanToPixels(span.start - range.start);
  const insetEndPixels = spanToPixels(range.end - span.end);

  const widthPixels = spanToPixels(span.end - span.start);

  return {
    insetStartPixels,
    insetEndPixels,
    widthPixels,
  };
};
