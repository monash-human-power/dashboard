import React from 'react';
import ContentPage from 'components/ContentPage';
import CameraSettings from 'components/v2/CameraSettings';
import CameraRecording from 'components/v2/CameraRecording';

/**
 * Camera Settings page component
 *
 * @returns {React.Component} Component
 */
export default function CameraSettingsView() {
  return (
    <ContentPage title="Camera Settings">
      <div className="mb-4">
        <CameraRecording />
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
