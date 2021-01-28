import React from 'react';
import { Table } from 'react-bootstrap';
import { useData } from 'api/v2/sensors';
import { usePowerModel } from 'api/v2/powerModel';
import styles from './V2TextModeChart.module.css';

/**
 * Text Mode chart component
 *
 * @returns {React.Component} Component
 */
export default function V2TextModeChart() {
  const data = useData();
  const { recData, estData } = usePowerModel();

  /**
   * Format a value into text
   *
   * @param {?number} value Value to format. May be null
   * @param {string}  unit  Unit of measurement
   * @returns {string} Formatted value
   */
  function formatValue(value, unit) {
    let displayValue;
    if (value !== null && value !== undefined) {
      displayValue = Math.floor(value * 100) / 100;
    } else {
      displayValue = '-';
    }
    const displayUnit = unit ? ` ${unit}` : '';

    return `${displayValue}${displayUnit}`;
  }

  /**
   * Format sensor output
   *
   * @param {string} sensor Sensor name
   * @param {string} unit   Unit of measurement
   * @returns {string} Formatted value
   */
  function formatData(sensor, unit) {
    return formatValue(data[sensor], unit);
  }

  return (
    <Table responsive className={styles.chart}>
      <tbody>
        <tr>
          <td colSpan="2">
            <b>Time</b>
          </td>
          <td>{formatData('time', 's')}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <b>Velocity</b>
          </td>
          <td>{formatData('gps_speed', 'km/h')}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <b>Power</b>
          </td>
          <td>{formatData('power', 'W')}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <b>Cadence</b>
          </td>
          <td>{formatData('cadence', 'rpm')}</td>
        </tr>
        { /* eslint-disable camelcase */ }
        <tr>
          <td rowSpan="6">
            <b>BOOST</b>
          </td>
          <td>Recommended Speed</td>
          <td>{formatValue(recData?.rec_speed, 'km/h')}</td>
        </tr>
        <tr>
          <td>Recommended Power</td>
          <td>{formatValue(recData?.rec_power, 'W')}</td>
        </tr>
        <tr>
          <td>Predicted Max Speed</td>
          <td>{formatValue(estData?.predictedMaxSpeed, 'km/h')}</td>
        </tr>
        <tr>
          <td>Zone Distance Left</td>
          <td>{formatValue(recData?.zdist, 'm')}</td>
        </tr>
        <tr>
          <td>Distance Offset</td>
          <td>{formatValue(recData?.distance_offset, 'm')}</td>
        </tr>
        <tr>
          <td>Total Distance Left</td>
          <td>{formatValue(recData?.distance_left, 'm')}</td>
        </tr>
        { /* eslint-enable camelcase */ }
        <tr>
          <td rowSpan="3">
            <b>GPS</b>
          </td>
          <td>Latitude</td>
          <td>{formatData('gps_lat', 'N')}</td>
        </tr>
        <tr>
          <td>Longitude</td>
          <td>{formatData('gps_long', 'E')}</td>
        </tr>
        <tr>
          <td>Altitude</td>
          <td>{formatData('gps_alt', 'm')}</td>
        </tr>
        <tr>
          <td rowSpan="3">
            <b>Accelerometer</b>
          </td>
          <td>x</td>
          <td>{formatData('aX', 'g')}</td>
        </tr>
        <tr>
          <td>y</td>
          <td>{formatData('aY', 'g')}</td>
        </tr>
        <tr>
          <td>z</td>
          <td>{formatData('aZ', 'g')}</td>
        </tr>
        <tr>
          <td rowSpan="3">
            <b>Gyroscope</b>
          </td>
          <td>x</td>
          <td>{formatData('gX', 'deg/s')}</td>
        </tr>
        <tr>
          <td>y</td>
          <td>{formatData('gY', 'deg/s')}</td>
        </tr>
        <tr>
          <td>z</td>
          <td>{formatData('gZ', 'deg/s')}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <b>Potentiometer</b>
          </td>
          <td>{formatData('pot')}</td>
        </tr>
        <tr>
          <td colSpan="2">
            <b>Thermometer</b>
          </td>
          <td>{formatData('thermoC', '°C')}</td>
        </tr>
      </tbody>
    </Table>
  );
}
