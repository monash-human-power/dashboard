import React from 'react';
import { Col, Table } from 'react-bootstrap';
import OnlineStatusPill from 'components/common/OnlineStatusPill';

export interface CameraStatusProps {
  cameraName: string;
  online: boolean;
  ip: string | null;
  battery: number | null;
  videoFeedEnabled: boolean | null;
}

/**
 * Status for Cameras
 *
 * @property props Props
 * @returns component
 */
export default function CameraStatus({
  cameraName,
  online,
  ip,
  battery,
  videoFeedEnabled,
}: CameraStatusProps) {
  return (
    <Col md xl="12" className="my-2">
      <span>
        <b>{cameraName}</b> <OnlineStatusPill isOnline={online} />
      </span>

      {/* Only show more information if the camera is online */}
      {online && (
        <>
          {/* IP address */}
          <p style={{ fontSize: '0.75rem', color: 'gray' }}>{ip}</p>

          <Table bordered hover>
            <tbody>
              {/* Battery Voltage */}
              <tr>
                <td>
                  <strong>Battery</strong>
                </td>
                <td>{`${battery ?? '-'} %`}</td>
              </tr>

              {/* Video Feed Status */}
              <tr>
                <td>
                  <strong>Video Feed</strong>
                </td>
                <td>{videoFeedEnabled ? 'On' : 'Off'}</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Col>
  );
}
