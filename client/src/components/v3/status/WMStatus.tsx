import React from 'react';
import { Accordion, Button, Card, Col, Table } from 'react-bootstrap';

import OnlineStatusPill from 'components/common/OnlineStatusPill';
import { WMStatus as WMStatusT } from 'types/data';
import { isOnline } from 'utils/data';

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

  function convertToSentenceCase(str: String) {
    /**
     * convert Camel Case words to sentence case
     *
     * @param str - camel case string
     * @returns string in sentence format
     */
    const result = str.replace(/([A-Z])/g, ' $1');
    const final = result.charAt(0).toUpperCase() + result.slice(1);
    return final;
  }

  function extractData(type: string, data: any) {
    /**
     * extract data from JSON objects and present them on client side so its user friendly
     *
     * @param type -  type of the data
     * @param data - data JSON received from the mqtt broker
     * @returns JSON-string
     */

    function formatValue(value: any, unit: any) {
      /**
       * receives a value and it unit and format them appropriately
       *
       * @param value - any value
       * @param unit
       * @returns string containing hte value and its unit
       */
      let displayValue;
      if (value !== null && value !== undefined) {
        displayValue = Math.floor(value * 100) / 100;
      } else {
        displayValue = '-';
      }
      const displayUnit = unit ? ` ${unit}` : '';

      return `${displayValue}${displayUnit}`;
    }

    if (type === 'gps') {
      return (
        <>
          <table>
            <tbody>
              <tr style={{ borderTop: 'none' }}>
                <td colSpan={2}>Altitude</td>
                <td>{formatValue(data.altitude, 'm')}</td>
              </tr>
              <tr>
                <td colSpan={2}>Course</td>
                <td>{formatValue(data.course, '')}</td>
              </tr>
              <tr>
                <td colSpan={2}>Date-Time</td>
                <td>{data.datetime}</td>
              </tr>
              <tr>
                <td colSpan={2}>Latitude</td>
                <td>{formatValue(data.latitude, 'N')}</td>
              </tr>
              <tr>
                <td colSpan={2}>Longitude</td>
                <td>{formatValue(data.longitude, 'E')}</td>
              </tr>
              <tr>
                <td colSpan={2}>pdop</td>
                <td>{formatValue(data.pdop, '')}</td>
              </tr>
              <tr>
                <td colSpan={2}>Satellites</td>
                <td>{formatValue(data.satellites, '')}</td>
              </tr>
              <tr>
                <td colSpan={2}>speed</td>
                <td>{formatValue(data.speed, 'km/h')}</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
    return JSON.stringify(data);
  }

  let info = <> </>;

  if (isOnline(props)) {
    const { data, mqttAddress, batteryVoltage } = props;
    info = (
      <>
        {/* MQTT address */}
        <p style={{ fontSize: '0.75rem', color: 'gray' }}>{mqttAddress}</p>

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
                {data.map(({ type }) => convertToSentenceCase(type)).join(', ')}
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
                    {/* TODO: extract data */}
                    {/* Sensor Names and Data */}
                    {data.map(({ type, value }) => (
                      <tr key={`${moduleName} ${type}`}>
                        <td>
                          <strong>{convertToSentenceCase(type)}</strong>
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
