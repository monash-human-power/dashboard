// import { useStatus } from 'api/v2/sensors';
import ContentPage from 'components/ContentPage';
// import WidgetListGroupItem from 'components/WidgetListGroupItem';
import React from 'react';
import { Row, Col, Badge, Card, Button } from 'react-bootstrap';
// import styles from '../../components/v2/CameraRecording.module.css';
// TODO: IMPORT NICER

/**
 * System page component
 *
 * @returns {React.Component} Component
 */
export default function SensorStatusView() {
    return (
        <ContentPage title="System Status">
            <Row>
                {/* Camera Status */}
                <Col xl>
                    <Card>
                        <Card.Body>
                            <Card.Title>Camera System</Card.Title>
                            <Row>
                                {/* Primary Camera Status */}
                                <Col md className="my-2">
                                    <span>
                                        <b>Primary</b> <Badge pill variant="success">Online</Badge>
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.8rem", color: "gray" }}>192.168.3.9</p>

                                    {/* Battery Voltage */}
                                    <Row className="px-2">
                                        <Col xs="auto">
                                            Battery Voltage
                                        </Col>
                                        <Col xs style={{ textAlign: "right" }}>
                                            3.9V
                                        </Col>
                                    </Row>

                                    {/* Video Feed Status */}
                                    <Row className="px-2">
                                        <Col xs="auto">
                                            Video Feed
                                        </Col>
                                        <Col xs style={{ textAlign: "right" }}>
                                            OFF
                                        </Col>
                                    </Row>

                                </Col>

                                {/* Secondary Camera Status */}
                                <Col md className="my-2">
                                    <span>
                                        <b>Secondary</b> <Badge pill variant="success">Online</Badge>
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.8rem", color: "gray" }}>192.168.3.9</p>

                                    {/* Battery Voltage */}
                                    <Row className="px-2">
                                        <Col xs="auto">
                                            Battery Voltage
                                        </Col>
                                        <Col xs style={{ textAlign: "right" }}>
                                            3.9V
                                        </Col>
                                    </Row>

                                    {/* Video Feed Status */}
                                    <Row className="px-2">
                                        <Col xs="auto">
                                            Video Feed
                                        </Col>
                                        <Col xs style={{ textAlign: "right" }}>
                                            OFF
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Wireless Module Status */}
                <Col xl>
                    <Card>
                        <Card.Body>
                            <Card.Title>Wireless Modules</Card.Title>
                            <Row>
                                {/* Primary Camera Status */}
                                <Col md>
                                    <span>
                                        <b>Front WM</b> <Badge pill variant="success">Online</Badge>
                                    </span>
                                    {/* IP address */}
                                    <p style={{ fontSize: "0.8rem", color: "gray" }}>192.168.3.9</p>
                                    <Button variant="primary">yoooo</Button>
                                </Col>

                                {/* Secondary Camera Status */}
                                <Col md>
                                    <span>
                                        Middle WM <Badge pill variant="success">Online</Badge>
                                    </span>
                                    <p>192.168.3.9</p>
                                    <Button variant="primary">yoooo</Button>
                                </Col>

                                {/* Secondary Camera Status */}
                                <Col md>
                                    <span>
                                        Back WM <Badge pill variant="success">Online</Badge>
                                    </span>
                                    <p>192.168.3.9</p>
                                    <Button variant="primary">yoooo</Button>
                                </Col>
                            </Row>

                        </Card.Body>

                    </Card>
                </Col>

            </Row >

        </ContentPage >
    );
}
