import ContentPage from 'components/common/ContentPage';
import CameraRecordingContainer from 'components/common/camera_settings/CameraRecordingContainer';
import CameraStatusContainer from 'components/common/camera_settings/CameraStatusContainer';
import OverlayMessageContainer from 'components/common/camera_settings/OverlayMessageContainer';
import OverlaySelectionContainer from 'components/common/camera_settings/OverlaySelectionContainer';
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
      <OverlaySelectionContainer />
    </ContentPage>
  );
}
