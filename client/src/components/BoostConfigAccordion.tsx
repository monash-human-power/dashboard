import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { BoostConfig, BoostConfigType } from 'types/boost';
import { camelCaseToStartCase } from 'utils/string';
import BoostConfigList from './BoostConfigList';

export interface BoostConfigAccordionProps {
  configs: BoostConfig[];
  onSelectConfig: (configType: BoostConfigType, name: string) => void;
  onDeleteConfig: (configType: BoostConfigType, name: string) => void;
}

export default function BoostConfigAccordion({
  configs,
  onSelectConfig,
  onDeleteConfig,
}: BoostConfigAccordionProps) {
  return (
    <Accordion>
      {configs.map((config, index) => (
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            variant="link"
            eventKey={String(index)}
          >
            {camelCaseToStartCase(config.type)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={String(index)}>
            <Card.Body>
              <BoostConfigList
                config={config}
                onSelectConfig={(name) => onSelectConfig(config.type, name)}
                onDeleteConfig={(name) => onDeleteConfig(config.type, name)}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
}
