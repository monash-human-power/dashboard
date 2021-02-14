import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import ContentPage from 'components/common/ContentPage';
import CameraStatusCol from 'components/v3/status/CameraStatusCol';
import WirelessModuleStatusCol from 'components/v3/status/WirelessModuleStatusCol';

// TODO: REMOVE HARD CODING OF PROPS DATA
const PrimaryCamera = {
    cameraName: "Primary",
    isOnline: true,
    batteryVoltage: 3,
    ip: "192.168.123.2",
    videoFeedStatus: "RECORDING",
};

const SecondaryCamera = {
    cameraName: "Secondary",
    isOnline: false,
};

const FrontWM = {
    moduleName: "Front WM",
    isOnline: true,
    batteryVoltage: 3.1,
    mqttAddress: "/v3/wireless_module/1/data",
    sensorData: {
        CO2: 123,
        temperature: "21 Degrees",
        humidity: "99%",
        accelerometer: "120",
        gyroscope: 360,
    }
};

const MiddleWM = {
    moduleName: "Front WM",
    isOnline: false,
    sensorData: {
        CO2: null,
        temperature: null,
        humidity: null,
        accelerometer: null,
        gyroscope: null,
    }
};

const BackWM = {
    moduleName: "Front WM",
    isOnline: null,
    sensorData: {
        CO2: null,
        temperature: null,
        humidity: null,
        accelerometer: null,
        gyroscope: null,
    }
};

/**
 * Status View component
 *
 * @returns {React.Component} Component
 */
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
                                <WirelessModuleStatusCol {...FrontWM} />

                                {/* Middle WM Status */}
                                <WirelessModuleStatusCol {...MiddleWM} />

                                {/* Back WM Status */}
                                <WirelessModuleStatusCol {...BackWM} />
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

            </Row >
        </ContentPage >
    );
}




