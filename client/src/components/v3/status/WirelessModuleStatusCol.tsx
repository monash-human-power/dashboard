import React from 'react';
import { Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import OnlineStatusPill, { isOnlineT } from 'components/common/OnlineStatusPill';

export interface WirelessModuleStatusProps {
    moduleName: string,
    isOnline: isOnlineT,
    batteryVoltage?: number,
    mqttAddress?: string,
    videoFeedStatus?: string,
};

export default function WirelessModuleStatusCol({
    moduleName,
    isOnline,
    batteryVoltage,
    mqttAddress,
    videoFeedStatus }: WirelessModuleStatusProps) {
    return (
        <Col md xl="12" className="my-2">
            <span>
                <b>{moduleName}</b> <OnlineStatusPill isOnline={isOnline} />
            </span>

            {/* Only show more information if the camera is online */}
            {isOnline && <>
                {/* MQTT address */}
                <p style={{ fontSize: "0.75rem", color: "gray" }}>{mqttAddress}</p>

                {/* Battery Voltage */}
                <Row className="mx-2">
                    <Col xs="auto">
                        Battery Voltage
                    </Col>
                    <Col xs style={{ textAlign: "right" }}>
                        {batteryVoltage}V
                    </Col>
                </Row>

                {/* Video Feed Status */}
                <Row className="mx-2">
                    <Col xs="auto">
                        Video Feed
                    </Col>
                    <Col xs style={{ textAlign: "right" }}>
                        {videoFeedStatus}
                    </Col>
                </Row>

                <Accordion className="mt-2">
                    <Card>
                        <Accordion.Toggle as={Button} variant="outline-success" eventKey="0" onClick={() => console.log("yo")}>
                            Toggle Sensor Data
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {/* Battery Voltage */}
                                <Row className="mx-2">
                                    <Col xs="auto">
                                        Battery Voltage
                                    </Col>
                                    <Col xs style={{ textAlign: "right" }}>
                                        3.9V
                                    </Col>
                                </Row>

                                {/* Video Feed Status */}
                                <Row className="mx-2">
                                    <Col xs="auto">
                                        Video Feed
                                    </Col>
                                    <Col xs style={{ textAlign: "right" }}>
                                        OFF
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </>}
        </Col>
    );
};