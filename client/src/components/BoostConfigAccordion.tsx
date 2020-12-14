import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import BoostConfigList from './BoostConfigList';

export interface BoostConfigAccordionProps {
  powerPlanConfigs: string[];
  riderConfigs: string[];
  bikeConfigs: string[];
  trackConfigs: string[];
}

export default function BoostConfigAccordion({
  powerPlanConfigs,
  riderConfigs,
}: BoostConfigAccordionProps) {
  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
          Power plan
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <BoostConfigList
              configNames={powerPlanConfigs}
              onSelectConfig={() => {}}
              onDeleteConfig={() => {}}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey="1">
          Rider
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <BoostConfigList
              configNames={riderConfigs}
              onSelectConfig={() => {}}
              onDeleteConfig={() => {}}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
