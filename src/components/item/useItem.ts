import { useTimelineContext } from "../../hooks/useTimelineContext";
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
  const { range, valueToPixels } = useTimelineContext();

  // Offsets in pixels relative to the visible range
  const insetStartPixels = valueToPixels(span.start - range.start);
  const insetEndPixels = valueToPixels(range.end - span.end);

  // Item width in pixels
  const widthPixels = valueToPixels(span.end - span.start);

  // Clamp padding to keep content visible when partially out of range
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
