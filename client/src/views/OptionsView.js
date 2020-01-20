import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  ListGroup,
} from 'react-bootstrap';
import ContentPage from 'components/ContentPage';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import { usePublishOnlineState } from 'api/v2/settings';

/**
 * Options page component
 *
 * @returns {React.Component} Component
 */
export default function OptionsView() {
  const { publishOnline, setPublishOnline } = usePublishOnlineState();

  const handlePublishOn = useCallback(() => {
    setPublishOnline(true);
  }, [setPublishOnline]);

  const handlePublishOff = useCallback(() => {
    setPublishOnline(false);
  }, [setPublishOnline]);

  return (
    <ContentPage title="Options">
      <ListGroup>
        <WidgetListGroupItem title="Publish data online">
          <ButtonGroup>
            <Button
              onClick={handlePublishOn}
              variant={publishOnline ? 'success' : 'outline-success'}
            >
              On
            </Button>
            <Button
              onClick={handlePublishOff}
              variant={!publishOnline ? 'danger' : 'outline-danger'}
            >
              Off
            </Button>
          </ButtonGroup>
        </WidgetListGroupItem>
      </ListGroup>
    </ContentPage>
  );
}
