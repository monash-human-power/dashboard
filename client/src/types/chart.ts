import { TimeSeriesPoint } from "utils/timeSeries";

export interface ChartProps {
    /** Time series to render */
    series: TimeSeriesPoint[]
    /** The maximum value achieved */
    max: number
}
