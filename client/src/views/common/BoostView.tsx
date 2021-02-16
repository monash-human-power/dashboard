import React from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import {setCalibration, resetCalibration} from 'api/common/powerModel';

/**
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
    // TODO: remove the hardcoded value for `distTravelled` with actual value read from MQTT
    return (
        <ContentPage title="Boost Configuration">
            <BoostCalibration onSet={setCalibration} onReset={resetCalibration} distTravelled={30} calibrationDiff={10}/>
        </ContentPage>
    );
};

