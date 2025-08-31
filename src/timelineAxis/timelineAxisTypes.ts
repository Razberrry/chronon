
/** Render-time tick instance */
export interface SpectimeMarkerRender {
  label?: string;
  offsetPx: number;     // px from visible range start
  heightRatio: number;  // 0..1, shorter = finer level
}

/** Configuration for a tick level */
export interface SpectimeMarker {
  intervalMs: number;                                // step size in ms
  maxVisibleRangeMs?: number;                        // show only if zoomed in enough
  minVisibleRangeMs?: number;                        // show only if zoomed out enough
  formatLabel?: (time: Date) => string;              // optional label formatter
}

/** Back-compat alias (optional) */
