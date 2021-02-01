import React from 'react';
import { Row, Col } from 'react-bootstrap';
import OnlineStatusPill, { isOnlineT } from 'components/common/OnlineStatusPill';

export interface CameraStatusProps {
    cameraName: string,
    isOnline: isOnlineT,
    batteryVoltage?: number,
    ip?: string,
    videoFeedStatus?: string,
};


export default function CameraStatusCol({
    isOnline,
    batteryVoltage,
    ip,
    videoFeedStatus,
    cameraName }: CameraStatusProps) {
    return (
        <Col md xl="12" className="my-2">
            <span>
                <b>{cameraName}</b> <OnlineStatusPill isOnline={isOnline} />
            </span>

            {/* Only show more information if the camera is online */}
            {isOnline && <>
                {/* IP address */}
                <p style={{ fontSize: "0.75rem", color: "gray" }}>{ip}</p>

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
            </>}
        </Col>
    );
};
