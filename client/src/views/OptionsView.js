import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  ListGroup,
} from 'react-bootstrap';
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
    <Container>
      <h1>Options</h1>
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
    </Container>
  );
}
