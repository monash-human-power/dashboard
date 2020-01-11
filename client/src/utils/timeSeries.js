import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

/**
 * Checks if a value is a real number
 *
 * @returns {boolean} is valid
 * @param {number} value Value to check
 */
function isValid(value) {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
}

/**
 * @typedef {object} TimeSeriesPoint
 * @property {number} time    Time since started running in ms
 * @property {number} value   Average value at this time
 */

/**
 * @typedef {object} TimeSeriesHook
 * @property {TimeSeriesPoint[]}  series  Time-series data points
 * @property {number}             max     Maximum recorded raw value
 * @property {function(number)}   add     Add a raw data point
 * @property {Function}           reset   Remove recorded values
 */

/**
 * Create a value-time record, averaged every interval
 *
 * @param {number}  interval Time in ms between points
 * @param {boolean} running  Whether to record values
 * @returns {TimeSeriesHook} Hook
 */
export function useTimeSeries(interval, running) {
  const [series, setSeries] = useState([]);
  const max = useRef(0);
  const intermediateCount = useRef(0);
  const pointCount = useRef(0);
  const time = useRef(0);

  const add = useCallback((value) => {
    if (isValid(value)) {
      intermediateCount.current += value;
      pointCount.current += 1;

      if (value > max.current) {
        max.current = value;
      }
    }
  }, []);

  const reset = useCallback(() => {
    setSeries([]);
    max.current = 0;
    intermediateCount.current = 0;
    pointCount.current = 0;
    time.current = 0;
  }, []);

  useEffect(() => {
    /**
     * Batch up accumulated results
     */
    function batch() {
      if (pointCount.current > 0) {
        const avg = intermediateCount.current / pointCount.current;
        setSeries((prevState) => [...prevState, {
          time: time.current,
          value: avg,
        }]);
        intermediateCount.current = 0;
        pointCount.current = 0;
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
  }, [interval, running]);

  useEffect(() => {
    if (running) {
      max.current = 0;
      intermediateCount.current = 0;
      pointCount.current = 0;
      time.current = 0;
    }
  }, [running]);

  return {
    series,
    max: max.current,
    add,
    reset,
  };
}
