import React from 'react';

export interface StatisticProps {
    /** Value to be shown */
    value: number | null;
    /** Unit of the value */
    unit: string;
    /** Description */
    desc: string;
}

/**
 * Display a value
 *
 * @returns Component
 */
export default function Statistic({ value, unit, desc }: StatisticProps): JSX.Element {
    return (
        <div>
            <span>{value ?? '-'}</span>
            <span>{unit}</span><br />
            <span>{desc}</span>
        </div>
    );
}
