export interface ChartPoint {
  /** X value */
  x: number;
  /** Y value */
  y: number;
}

export interface ChartProps {
  /** Data to render */
  data: ChartPoint[];
  /** The maximum value achieved */
  max: number;
}
