import ContentPage from 'components/ContentPage';
import CameraRecordingContainer from 'components/v2/CameraRecordingContainer';
import CameraSettings from 'components/v2/CameraSettings';
import CameraStatusContainer from 'components/v2/CameraStatusContainer';
import OverlayMessageContainer from 'components/v2/OverlayMessageContainer';
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
        <CameraRecordingContainer />
      </div>
      <div className="mb-4">
        <OverlayMessageContainer />
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
