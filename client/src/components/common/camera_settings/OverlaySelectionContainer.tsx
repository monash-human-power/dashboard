import React from 'react';
import { useCameraConfig } from 'api/common/camera';
import OverlaySelection from 'components/common/camera_settings/OverlaySelection';

/**
 * Container for {@link OverlaySelection}
 *
 * @returns Component
 */
export default function OverlaySelectionContainer() {
    return (
        <>
            <div className="mb-4">
                <OverlaySelection device='primary' {...useCameraConfig('primary')} />
            </div>
            <div className="mb-4">
                <OverlaySelection device='secondary' {...useCameraConfig('secondary')} />
            </div>
        </>
    );
}
