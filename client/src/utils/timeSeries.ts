import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Checks if a value is a real number
 *
 * @param value Value
 * @returns is valid
 */
function isValid(value: number): boolean {
  return (
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
  );
}

export interface TimeSeriesPoint {
  /** Time since started running in ms */
  time: number
  /** Average value at this time */
  value: number
}

export interface TimeSeriesHook {
  /** Time-series data points for each dimension */
  series: TimeSeriesPoint[][]
  /** Maximum recorded raw value for each dimension */
  max: number[]
  /** Add a raw data point */
  add: (values: number[]) => void
  /** Remove recorded values */
  reset: () => void
}

// These JSDocs are left for backwards compatability with .js files

/**
 * @typedef {object} TimeSeriesPoint
 * @property {number} time    Time since started running in ms
 * @property {number} value   Average value at this time
 */

/**
 * @typedef {object} TimeSeriesHook
 * @property {TimeSeriesPoint[][]}  series  Time-series data points for each dimension
 * @property {number[]}             max     Maximum recorded raw value for each dimension
 * @property {function(number[])}   add     Add a raw data point
 * @property {Function}             reset   Remove recorded values
 */

/**
 * Create a value-time record, averaged every interval
 *
 * @param dimensions  Dimensions of data to record
 * @param interval    Time in ms between points
 * @param running     Whether to record values
 * @returns Hook
 */
export function useTimeSeries(
  dimensions: number, interval: number, running: boolean
): TimeSeriesHook {
  const [series, setSeries] = useState<TimeSeriesPoint[][]>([]);
  const max = useRef<number[]>(Array(dimensions).fill(0));
  const intermediateCount = useRef<number[]>(Array(dimensions).fill(0));
  const pointCount = useRef(0);
  const time = useRef(0);

  const resetCounters = useCallback(() => {
    intermediateCount.current = Array(dimensions).fill(0);
    pointCount.current = 0;
  }, [dimensions]);

  const reset = useCallback(() => {
    resetCounters();
    setSeries([]);
    max.current = Array(dimensions).fill(0);
    time.current = 0;
  }, [resetCounters, dimensions]);

  const add = useCallback((values: number[]) => {
    if (values.every(isValid)) {
      values.forEach((value: number, index: number) => {
        intermediateCount.current[index] += value;

        if (value > max.current[index]) {
          max.current[index] = value;
        }
      });
      pointCount.current += 1;
    }
  }, []);

  useEffect(() => {
    /**
     * Batch up accumulated results
     */
    function batch() {
      if (pointCount.current > 0) {
        const averages = intermediateCount.current.map(
          (sum) => sum / pointCount.current,
        );
        setSeries((prevState) => [
          ...prevState,
          averages.map((average) => ({
            time: time.current,
            value: average,
          })),
        ]);
        resetCounters();
      }
      time.current += interval;
    }

    if (running) {
      const timer = setInterval(batch, interval);
      return () => {
        clearInterval(timer);
      };
    }
    return () => null;
  }, [interval, running, resetCounters]);

  // On resume, discard values added when not running
  useEffect(() => {
    if (running) {
      resetCounters();
    }
  }, [running, resetCounters]);

  return {
    series,
    max: max.current,
    add,
    reset,
  };
}
