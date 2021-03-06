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
              <td>{batteryVoltage} V</td>
            </tr>

            {/* Sensors List of Names */}
            <tr>
              <td>
                <strong>Sensors</strong>
              </td>
              <td>{data.map(({ type }) => type).join(', ')}</td>
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
                          <strong>{type}</strong>
                        </td>
                        <td>{JSON.stringify(value)}</td>
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
