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

export interface DualChartProps {
  /** Data to render */
  data: ChartPoint[];
  data2: ChartPoint[];
  /** Optional per-lap segments of data2 for faded rendering of past laps */
  data2Segments?: ChartPoint[][];
  /** The maximum value achieved */
  max: number;
  max2: number;
}
