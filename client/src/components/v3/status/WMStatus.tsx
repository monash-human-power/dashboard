import React from 'react';
import { Col, Card, Accordion, Button, Table } from 'react-bootstrap';
import { SensorDataT } from 'types/data';
import OnlineStatusPill from 'components/common/OnlineStatusPill';

export interface WMStatusOnline {
  moduleName: string;
  online: true;
  data: SensorDataT[];
  batteryVoltage: number;
  mqttAddress: string;
}

export interface WMStatusOffline {
  moduleName: string;
  online: false;
}

export type WMStatusProps = WMStatusOnline | WMStatusOffline;

/**
 * Type guard for online state
 *
 * @param props Props
 * @returns guard
 */
function isOnline(props: WMStatusProps): props is WMStatusOnline {
  return !!props.online;
}

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
              <td>{batteryVoltage}V</td>
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
                      <tr>
                        <td>
                          <strong>{type}</strong>
                        </td>
                        <td>{value}</td>
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
