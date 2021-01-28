import React from 'react';
import { useCameraConfig } from '../../api/v2/camera';
import OverlaySelection from './OverlaySelection';

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
