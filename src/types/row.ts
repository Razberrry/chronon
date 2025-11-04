export interface RowDefinition {
  id: string;
  subrowHeight?: number;
}

export interface UseRowProps extends RowDefinition {
  data?: object;
}
