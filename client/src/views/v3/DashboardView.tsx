import React, { useState } from 'react';


/**
 * Dashboard View component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
    const [buttonInfo, setButtonInfo] = useState(0);
    return (
        <div>
            <h1>Hi I&apos;m the dashboard {buttonInfo} </h1>
            <button type="button" onClick={() => setButtonInfo(buttonInfo + 1)}>press meee</button>
        </div>
    );
};

