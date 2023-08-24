import React from 'react';
import { Accordion, Button, Card, Col, Table } from 'react-bootstrap';

import OnlineStatusPill from 'components/common/OnlineStatusPill';
import { WMStatus as WMStatusT } from 'types/data';
import { isOnline, roundNum } from 'utils/data';
import { camelCaseToStartCase } from 'utils/string';

export type WMStatusProps = WMStatusT;

/**
 * Data for Anemometer
 *
 * @property props Props
 * @returns component
 */
export default function AnemometerData(props: WMStatusProps) {
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
      minDirection: 'º',
      avgDirection: 'º',
      maxDirection: 'º',
      minSpeed: 'm/s',
      avgSpeed: 'm/s',
      maxSpeed: 'm/s',
    };

    const decimals: numMap2 = {
      minDirection: 0,
      avgDirection: 0,
      maxDirection: 0,
      minSpeed: 0,
      avgSpeed: 0,
      maxSpeed: 0,
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
        const dec = decimals[name];
        if (unit === 'm/s') {
          val *= 1;
        }
        displayValue = roundNum(val, dec);
      } else {
        displayValue = '-';
      }
      const displayUnit = unit ? ` ${unit}` : '';

      return `${displayValue}${displayUnit}`;
    }

    let output = <></>;

    if (type === 'windDirection') {
      const windDirectionRows: any[] = [];

      Object.entries(data).forEach((arr) => {
        windDirectionRows.push({
          name: arr[0],
          value: arr[1],
          unit: units[arr[0]],
        });
      });

      output = (
        <Table borderless>
          <tbody>
            {windDirectionRows.map(({ name, value, unit }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{camelCaseToStartCase(name)}</td>
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
    } else if (type === 'windSpeed') {
      const windSpeedRows: any[] = [];

      Object.entries(data).forEach((arr) => {
        windSpeedRows.push({
          name: arr[0],
          value: arr[1],
          unit: units[arr[0]],
        });
      });

      output = (
        <Table borderless>
          <tbody>
            {windSpeedRows.map(({ name, value, unit }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{camelCaseToStartCase(name)}</td>
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
            {/* Sensors List of Names */}
            <tr>
              <td>
                <strong>Sensors</strong>
              </td>
              <td>
                {data.map(({ type }) => camelCaseToStartCase(type)).join(', ')}
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
                          <strong>{camelCaseToStartCase(type)}</strong>
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
