import React from 'react';
import { Col, Card, Accordion, Button, Table } from 'react-bootstrap';
import OnlineStatusPill, { isOnlineT } from 'components/common/OnlineStatusPill';

export interface WirelessModuleStatusProps {
    moduleName: string,
    isOnline: isOnlineT,
    sensorData: {},
    batteryVoltage?: number,
    mqttAddress?: string,
};

export default function WirelessModuleStatusCol({
    moduleName,
    isOnline,
    sensorData,
    batteryVoltage,
    mqttAddress }: WirelessModuleStatusProps) {

    return (
        <Col md xl="12" className="my-2">
            <span>
                <b>{moduleName}</b> <OnlineStatusPill isOnline={isOnline} />
            </span>

            {/* Only show more information if the camera is online */}
            {isOnline && <>
                {/* MQTT address */}
                <p style={{ fontSize: "0.75rem", color: "gray" }}>{mqttAddress}</p>

                <Table striped bordered hover>
                    <tbody>

                        {/* Battery Voltage */}
                        <tr>
                            <td>Battery Voltage</td>
                            <td>{batteryVoltage}V</td>
                        </tr>

                        {/* Sensors List of Names */}
                        {Object.keys(sensorData).map(
                            (sensorName, index) => (
                                <tr>
                                    <td>Sensor-{index}</td>
                                    <td>{sensorName}</td>
                                </tr>
                            )
                        )}

                    </tbody>
                </Table >

                {/* Sensor Data Toggle Section */}
                <Accordion className="mt-2">
                    <Card>
                        <Accordion.Toggle as={Button} variant="outline-success" eventKey="0">
                            Toggle Sensor Data
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Sensor</th>
                                            <th>Data Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* TODO: extract data */}
                                        {/* Sensor Names and Data */}
                                        {Object.keys(sensorData).map(
                                            (sensorName) => (
                                                <tr>
                                                    <td>{sensorName}</td>
                                                    <td>{sensorName}</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </Table >
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </>}
        </Col >
    );
};