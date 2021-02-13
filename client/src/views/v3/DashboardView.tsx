import ContentPage from 'components/common/ContentPage';
import React from 'react';
import { Button } from 'react-bootstrap';
import StatisticSpeed from '../../components/v3/StatisticSpeed';


/**
 * Dashboard View component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
    return (
        <ContentPage>
            <div>
                <span>DAS recording</span>
                <Button />
            </div>
            <div>
                <StatisticSpeed />
                <StatisticSpeed />
                <StatisticSpeed />
                <StatisticSpeed />
                <StatisticSpeed />
                <StatisticSpeed />
            </div>
            <div>Graph Here</div>
        </ContentPage>
    );
};
