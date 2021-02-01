import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import ContentPage from 'components/common/ContentPage';
import CameraStatusCol from 'components/v3/status/CameraStatusCol';
import WirelessModuleStatusCol from 'components/v3/status/WirelessModuleStatusCol';


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
    videoFeedStatus: "string",
};

const MiddleWM = {
    moduleName: "Front WM",
    isOnline: false,
    batteryVoltage: 3.1,
    mqttAddress: "/v3/wireless_module/1/data",
    videoFeedStatus: "string",
};

const BackWM = {
    moduleName: "Front WM",
    isOnline: null,
    batteryVoltage: 3.1,
    mqttAddress: "/v3/wireless_module/1/data",
    videoFeedStatus: "string",
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




