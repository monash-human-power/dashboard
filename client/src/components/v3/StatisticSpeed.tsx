import React from 'react';
import Statistic from './Statistic';

// TODO: Consider component factory

/**
 * Statistic container for speed.
 *
 * @returns Component
 */
export default function StatisticSpeed(): JSX.Element {
    // TODO: Figure out how we're doing client/server/mqtt messages
    const { value } = { value: 501 };

    return <Statistic value={value} unit="km/hr" desc="Current speed" />;
}
