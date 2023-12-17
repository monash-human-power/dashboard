import React from 'react';

import ContentPage from 'components/common/ContentPage';
import CameraRecordingContainer from 'components/common/camera_settings/CameraRecordingContainer';
import CameraStatusContainer from 'components/common/camera_settings/CameraStatusContainer';
import OverlayMessageContainer from 'components/common/camera_settings/OverlayMessageContainer';
import OverlaySelectionContainer from 'components/common/camera_settings/OverlaySelectionContainer';
import CrashModal from 'components/v3/CrashModal';

/**
 * Camera Settings page component
 *
 * @returns Component
 */
export default function CameraSystemView() {
  return (
    <ContentPage title="Camera System">
      <CrashModal />

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
