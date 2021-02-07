import React from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';


/**
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
    return (
        <ContentPage>
            <div>
                <BoostCalibration/>
            </div>
        </ContentPage>
    );
};

