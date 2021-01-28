import React, { useState } from 'react';
import ContentPage from 'components/common/ContentPage';


/**
 * Dashboard View component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
    const [buttonInfo, setButtonInfo] = useState(0);
    return (
        <ContentPage>
            <h1>Hi Im the dashboard {buttonInfo} </h1>
            <button type="button" onClick={() => setButtonInfo(buttonInfo + 1)}>press meee</button>
        </ContentPage>
    );
};

