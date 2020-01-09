import React, { useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  ListGroup,
} from 'react-bootstrap';
import WidgetListItem from 'components/WidgetListItem';
import { usePublishOnlineState } from 'api/v2/settings';

export default function OptionsView() {
  const [publishOnline, setPublishOnline] = usePublishOnlineState();

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
        <WidgetListItem title="Publish data online">
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
        </WidgetListItem>
      </ListGroup>
    </Container>
  );
}
