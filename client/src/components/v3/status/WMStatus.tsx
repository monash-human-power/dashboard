import React from 'react';
import { Accordion, Button, Card, Col, Table } from 'react-bootstrap';

import OnlineStatusPill from 'components/common/OnlineStatusPill';
import { WMStatus as WMStatusT } from 'types/data';
import { isOnline } from 'utils/data';
import { camelCaseToStartCase } from 'utils/string';

export type WMStatusProps = WMStatusT;

/**
 * Status for Wireless Modules
 *
 * @param props Props
 * @returns component
 */
export default function WMStatus(props: WMStatusProps) {
  const { moduleName, online } = props;

  const statusPill = (
    <span>
      <b>{moduleName}</b> <OnlineStatusPill isOnline={online} />
    </span>
  );

  /**
   * extract data from JSON objects and present them on client side so its user friendly
   *
   * @param type -  type of the data
   * @param data - data JSON received from the mqtt broker
   * @returns JSON-string
   */
  function extractData(type: string, data: any) {
    interface strMap {
      [key: string]: string;
    }
    interface numMap2 {
      [key: string]: number;
    }

    const units: strMap = {
      speed: 'km/h',
      satellites: '',
      pdop: '',
      latitude: '°N',
      longitude: '°E',
      altitude: 'm',
      course: '°',
      datetime: '',
      temperature: '°C',
      humidity: '%',
      steeringAngle: '°',
      co2: 'ppm',
      power: 'W',
      cadence: 'rpm',
      heartRate: 'bpm',
      reedVelocity: 'km/h',
      reedDistance: 'km',
    };

    const decimals: numMap2 = {
      speed: 1,
      satellites: 0,
      pdop: 2,
      latitude: 5,
      longitude: 5,
      altitude: 1,
      course: 1,
      temperature: 1,
      humidity: 0,
      steeringAngle: 1,
      co2: 0,
      power: 0,
      cadence: 0,
      heartRate: 0,
      reedVelocity: 1,
      reedDistance: 2,
      x: 2,
      y: 2,
      z: 2,
    };

    /**
     * receives a value and its unit and format them appropriately
     *
     * @param name type's name
     * @param value type's value
     * @param unit the unit
     * @returns string containing the value and its unit
     */
    function formatValue(name: string, value: any, unit: any) {
      let displayValue;
      let val = value;
      if (val !== null && val !== undefined) {
        if (name === 'Date' || name === 'Time') {
          displayValue =
            name === 'Date' ? value.substring(0, 10) : value.substring(11, 19);
        } else {
          const dec = decimals[name];
          if (unit === 'km') {
            val /= 1000;
          } else if (unit === 'km/h') {
            val *= 3.6;
          }
          displayValue = Math.floor(val * 10 ** dec) / 10 ** dec;
        }
      } else {
        displayValue = '-';
      }
      const displayUnit = unit ? ` ${unit}` : '';

      return `${displayValue}${displayUnit}`;
    }

    let output = <></>;

    if (type === 'accelerometer') {
      const accRows: any[] = [];
      Object.entries(data).forEach((arr) => {
        accRows.push({ name: arr[0], value: arr[1] });
      });

      output = (
        <Table borderless>
          <tbody>
            {accRows.map(({ name, value }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{camelCaseToStartCase(name.toLowerCase())}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, '')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else if (type === 'gyroscope') {
      const gyroRows: any[] = [];
      Object.entries(data).forEach((arr) => {
        gyroRows.push({ name: arr[0], value: arr[1] });
      });
      output = (
        <Table borderless>
          <tbody>
            {gyroRows.map(({ name, value }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{camelCaseToStartCase(name.toLowerCase())}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, '')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    // output = JSON.stringify(data);
    else if (type === 'gps') {
      const gpsRows: any[] = [];

      Object.entries(data).forEach((arr) => {
        if (arr[0] === 'datetime') {
          gpsRows.push({ name: 'Date', value: arr[1], unit: '' });
          gpsRows.push({ name: 'Time', value: arr[1], unit: '' });
        } else {
          gpsRows.push({ name: arr[0], value: arr[1], unit: units[arr[0]] });
        }
      });

      output = (
        <Table borderless>
          <tbody>
            {gpsRows.map(({ name, value, unit }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{camelCaseToStartCase(name.toLowerCase())}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, unit)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      output = (
        <div style={{ float: 'right' }}>
          {formatValue(type, JSON.stringify(data), units[type])}
        </div>
      );
    }
    return output;
  }

  let info = <> </>;

  if (isOnline(props)) {
    const { data, batteryVoltage } = props;
    info = (
      <>
        <Table hover>
          <tbody>
            {/* Battery Voltage */}
            <tr>
              <td>
                <strong>Battery Voltage</strong>
              </td>
              <td>{batteryVoltage.toFixed(2)} V</td>
            </tr>

            {/* Sensors List of Names */}
            <tr>
              <td>
                <strong>Sensors</strong>
              </td>
              <td>
                {data
                  .map(({ type }) => camelCaseToStartCase(type.toLowerCase()))
                  .join(', ')}
              </td>
            </tr>
          </tbody>
        </Table>

        {/* Sensor Data Toggle Section */}
        <Accordion className="mt-2">
          <Card>
            <Accordion.Toggle
              as={Button}
              variant="outline-success"
              eventKey="0"
            >
              Sensor Data
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table bordered hover>
                  <tbody>
                    {data.map(({ type, value }) => (
                      <tr key={`${moduleName} ${type}`}>
                        <td>
                          <strong>
                            {camelCaseToStartCase(type.toLowerCase())}
                          </strong>
                        </td>
                        <td>{extractData(type, value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }

  return (
    <Col md xl="12" className="my-2">
      {statusPill}

      {/* Only show more information if the camera is online */}
      {info}
    </Col>
  );
}
