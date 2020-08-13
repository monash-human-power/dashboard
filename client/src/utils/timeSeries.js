import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Checks if a value is a real number
 *
 * @returns {boolean} is valid
 * @param {number} value Value to check
 */
function isValid(value) {
  return (
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
  );
}

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
 * @param {number}  dimensions  Dimensions of data to record
 * @param {number}  interval    Time in ms between points
 * @param {boolean} running     Whether to record values
 * @returns {TimeSeriesHook} Hook
 */
export function useTimeSeries(dimensions, interval, running) {
  const [series, setSeries] = useState([]);
  const max = useRef(Array(dimensions).fill(0));
  const intermediateCount = useRef(Array(dimensions).fill(0));
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

  const add = useCallback((values) => {
    if (values.every(isValid)) {
      values.forEach((value, index) => {
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
