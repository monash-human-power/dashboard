import React, {useRef, useState} from 'react';
// import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
// import FontAwesomeIcon from 'components/common/FontAwesomeIcon';
import { Accordion, Button, Card } from 'react-bootstrap';
import { BoostConfig, BoostConfigType } from 'types/boost';
import { camelCaseToStartCase } from 'utils/string';
import BoostConfigList from 'components/common/boost/BoostConfigList';

export interface BoostConfiguratorProps {
  configs: BoostConfig[];
  onSelectConfig: (configType: BoostConfigType, name: string) => void;
  onDeleteConfig: (configType: BoostConfigType, name: string) => void;
  onUploadConfig: (configType: BoostConfigType, configFiles: FileList) => void;
}

/** 
 * TODO: Add real docs for this component
 *
 * @param props Props
 * @returns Component
 */
export default function BoostConfigurator({
  configs,
  onSelectConfig,
  onDeleteConfig,
  onUploadConfig,
}: BoostConfiguratorProps) {
  const fileInput = useRef(null);
  const [configType, setConfigType] = useState<BoostConfigType>('all');

  const handleClick = (type: BoostConfigType) => {
    if (fileInput.current != null) {
      setConfigType(type);
      fileInput.current.click();
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      onUploadConfig(configType, event.target.files);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Configuration</Card.Title>
        <>
          <input
            ref={fileInput}
            onChange={handleFileUpload}
            type="file"
            style={{ display: "none" }}
            multiple={false}
          />
          <Button variant="outline-primary" className="mb-3" onClick={() => {handleClick('all');}}>
            Upload All Configs
          </Button>
      </>
        <Accordion>
          {configs.map((config, index) => (
            <Card>
              <Accordion.Toggle
                as={Card.Header}
                variant="link"
                eventKey={String(index)}
              >
                {camelCaseToStartCase(config.type)}
                {': '}
                <i>{config.active ? `"${config.active}"` : 'None'}</i>
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
      </Card.Body>
    </Card>
  );
}
