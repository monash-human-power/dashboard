import React from 'react';
import { Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import ContentPage from 'components/common/ContentPage';
import OnlineStatusPill from 'components/common/OnlineStatusPill';
import CameraStatusCol from 'components/v3/status/CameraStatusCol';


const PrimaryCamera = {
    /** Specify whether the camera status is on, off or error */
    cameraName: "Primary",
    /** Specify whether the camera status is on, off or error */
    isOnline: true,
    /** Specify whether the camera status is on, off or error */
    batteryVoltage: 3,
    /** Specify whether the camera status is on, off or error */
    ip: "192.168.123.2",
    /** Specify whether the camera status is on, off or error */
    videoFeedStatus: "RECORDING",
};

const SecondaryCamera = {
    /** Specify whether the camera status is on, off or error */
    cameraName: "Secondary",
    /** Specify whether the camera status is on, off or error */
    isOnline: false,
};


/**
//  * Status View component
//  *
//  * @returns {React.Component} Component
//  */
export default function StatusView() {
    return (
        <ContentPage title="System Status">
            <Row>
                {/* Camera Status */}
                <Col xl className="mb-2">
                    <Card>
                        <Card.Body>
                            <Card.Title>Camera System</Card.Title>
                            <Row>
                                {/* Primary Camera Status */}
                                <CameraStatusCol {...PrimaryCamera} />

                                {/* Secondary Camera Status */}
                                <CameraStatusCol {...SecondaryCamera} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Wireless Module Status */}
                <Col xl className="mb-2">
                    <Card>
                        <Card.Body>
                            <Card.Title>Wireless Modules</Card.Title>
                            <Row>
                                {/* Front WM Status */}
                                <Col md xl="12" className="my-2">
                                    <span>
                                        <b>Front WM</b> <OnlineStatusPill isOnline />
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.75rem", color: "gray" }}>/v3/wireless_module/3/data</p>

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
                                </Col>

                                {/* Middle WM Status */}
                                <Col md xl="12" className="my-2">
                                    <span>
                                        <b>Front WM</b> <OnlineStatusPill isOnline />
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.75rem", color: "gray" }}>/v3/wireless_module/3/data</p>
                                </Col>

                                {/* Back WM Status */}
                                <Col md xl="12" className="my-2">
                                    <span>
                                        <b>Front WM</b> <OnlineStatusPill isOnline />
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.75rem", color: "gray" }}>/v3/wireless_module/3/data</p>
                                    <Accordion>
                                        <Card>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                Toggle Sensor Data
                                        </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>Hello! Im the body</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </Col>
                            </Row>

                        </Card.Body>

                    </Card>
                </Col>

            </Row >

        </ContentPage >
    );
}




