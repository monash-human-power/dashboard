import ContentPage from 'components/ContentPage';
import CameraRecording from 'components/v2/CameraRecording';
import CameraSettings from 'components/v2/CameraSettings';
import CameraStatusContainer from 'components/v2/CameraStatusContainer';
import OverlayMessage from 'components/v2/OverlayMessage';
import React from 'react';

/**
 * Camera Settings page component
 *
 * @returns {React.Component} Component
 */
export default function CameraSettingsView() {
  return (
    <ContentPage title="Camera Settings">
      <div className="mb-4">
        <CameraStatusContainer />
      </div>
      <div className="mb-4">
        <CameraRecording devices={['primary', 'secondary']} />
      </div>
      <div className="mb-4">
        <OverlayMessage />
      </div>
      <div className="mb-4">
        <CameraSettings device="primary" />
      </div>
      <div>
        <CameraSettings device="secondary" />
      </div>
    </ContentPage>
  );
}
