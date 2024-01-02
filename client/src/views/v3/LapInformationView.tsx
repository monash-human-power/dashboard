import React from 'react';
import ContentPage from 'components/common/ContentPage';
import LapTimer from 'components/v3/LapTimer/LapTimer';

/**
 * Lap Information View component
 *
 * @returns Component
 */
export default function LapInformationView(): JSX.Element {
  return (
    <ContentPage title="Lap Information">
      <div className="mb-4">
        {/* Lap Timer */}
        <LapTimer />
      </div>
    </ContentPage>
  );
}
