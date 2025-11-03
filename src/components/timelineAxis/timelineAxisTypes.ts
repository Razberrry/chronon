import React from "react";

export type MarkerRenderer = (time: Date) => React.ReactNode;

export interface BasicLabelDefinition {
  maxRangeSize?: number;
  minRangeSize?: number;
}

export interface MarkerDefinition extends BasicLabelDefinition {
  value: number;
  render: MarkerRenderer;
}

export interface Marker {
  sideDelta: number;
  render: MarkerRenderer;
  date: Date;
}
