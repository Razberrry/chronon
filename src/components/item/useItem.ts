import { useTimelineContext } from "../../context/timelineContext";
import type { Span } from "../../types";

export type UseItemProps = {
  span: Span;
};

export type UseItemComputed = {
  insetStartPixels: number;
  insetEndPixels: number;
  widthPixels: number;
  paddingStartPixels: number;
  paddingEndPixels: number;
};

export const useItem = ({ span }: UseItemProps): UseItemComputed => {
  const { range, spanToPixels } = useTimelineContext();

  const insetStartPixels = spanToPixels(span.start - range.start);
  const insetEndPixels = spanToPixels(range.end - span.end);

  const widthPixels = spanToPixels(span.end - span.start);

  const paddingStartPixels = insetStartPixels < 0 ? -insetStartPixels : 0;
  const paddingEndPixels = insetEndPixels < 0 ? -insetEndPixels : 0;

  return {
    insetStartPixels,
    insetEndPixels,
    widthPixels,
    paddingStartPixels,
    paddingEndPixels,
  };
};
