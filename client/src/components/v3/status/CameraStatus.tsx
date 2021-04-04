import React from 'react';
import { Col, Table } from 'react-bootstrap';
import OnlineStatusPill, {
  isOnlineT,
} from 'components/common/OnlineStatusPill';

export interface CameraStatusProps {
  cameraName: string;
  isOnline: isOnlineT;
  batteryVoltage?: number;
  ip?: string;
  videoFeedStatus?: string;
}

export default function CameraStatus({
  isOnline,
  batteryVoltage,
  ip,
  videoFeedStatus,
  cameraName,
}: CameraStatusProps) {
  return (
    <Col md xl="12" className="my-2">
      <span>
        <b>{cameraName}</b> <OnlineStatusPill isOnline={isOnline} />
      </span>

      {/* Only show more information if the camera is online */}
      {isOnline && (
        <>
          {/* IP address */}
          <p style={{ fontSize: '0.75rem', color: 'gray' }}>{ip}</p>

          <Table bordered hover>
            <tbody>
              {/* Battery Voltage */}
              <tr>
                <td>
                  <strong>Battery Voltage</strong>
                </td>
                <td>{batteryVoltage}V</td>
              </tr>

              {/* Video Feed Status */}
              <tr>
                <td>
                  <strong>Video Feed</strong>
                </td>
                <td>{videoFeedStatus}</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Col>
  );
}
