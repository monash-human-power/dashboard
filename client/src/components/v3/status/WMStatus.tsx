import React from 'react';
import { Col, Card, Accordion, Button, Table } from 'react-bootstrap';
import OnlineStatusPill, {
  isOnlineT,
} from 'components/common/OnlineStatusPill';
import { SensorDataT } from 'types/data';

export interface WMStatusProps {
  moduleName: string;
  isOnline: isOnlineT;
  data: SensorDataT[];
  batteryVoltage?: number;
  mqttAddress?: string;
}

/**
 * Status for Wireless Modules
 *
 * @property props Props
 * @returns component
 */
export default function WMStatus({
  moduleName,
  isOnline,
  data,
  batteryVoltage,
  mqttAddress,
}: WMStatusProps) {
  return (
    <Col md xl="12" className="my-2">
      <span>
        <b>{moduleName}</b> <OnlineStatusPill isOnline={isOnline} />
      </span>

      {/* Only show more information if the camera is online */}
      {isOnline && (
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
      )}
    </Col>
  );
}
