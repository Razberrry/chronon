import React from "react";

export type LabelComponent = React.ComponentType<React.PropsWithChildren<{}>>;

export interface MarkerDefinition {
  value: number;
  maxRangeSize?: number;
  minRangeSize?: number;
  getLabel?: (time: Date) => string;
  overrideComponent?: LabelComponent; // children-only component
}

export interface Marker {
  label?: string;
  sideDelta: number;
  Override?: LabelComponent;
}

export interface TimeAxisProps {
  markers: MarkerDefinition[];
}
