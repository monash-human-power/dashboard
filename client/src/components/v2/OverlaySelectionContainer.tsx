import React from 'react';
import { useOverlays } from '../../api/v2/camera';
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
                <OverlaySelection device='primary' {...useOverlays('primary')} />
            </div>
            <div className="mb-4">
                <OverlaySelection device='secondary' {...useOverlays('secondary')} />
            </div>
        </>
    );
}
