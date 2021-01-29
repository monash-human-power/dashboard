import React from 'react';
import { useCameraStatus } from "../../api/v2/camera";
import CameraStatus from "./CameraStatus";

/**
 * Container for {@link CameraStatus}
 *
 * @returns Component
 */
export default function CameraStatusContainer(): JSX.Element {
    const primaryStatus = useCameraStatus('primary').online;
    const secondaryStatus = useCameraStatus('secondary').online;

    return (<CameraStatus primaryStatus={primaryStatus} secondaryStatus={secondaryStatus} />);
}
