import React from "react";

export type MarkerRenderer = (time: Date) => React.ReactNode;

export interface MarkerDefinition {
  value: number;
  maxRangeSize?: number;
  minRangeSize?: number;
  render: MarkerRenderer;
}

export interface Marker {
  sideDelta: number;
  render: MarkerRenderer;
  date: Date;
}
