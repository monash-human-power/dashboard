import React, { createRef, useState } from 'react';
import { faFileUpload, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from 'components/common/FontAwesomeIcon';
import { Accordion, Button, Card, Modal } from 'react-bootstrap';
import { BoostConfig, BoostConfigType } from 'types/boost';
import { camelCaseToStartCase } from 'utils/string';
import BoostConfigList from 'components/common/boost/BoostConfigList';

export interface BoostConfiguratorProps {
  configs: BoostConfig[];
  onSelectConfig: (configType: BoostConfigType, name: string) => void;
  onDeleteConfig: (configType: BoostConfigType, name: string) => void;
  onUploadConfig: (configType: BoostConfigType, configFile: File, displayErr: (message: string) => void, configExist: (type: BoostConfigType, name: string) => boolean) => void;
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
  const fileInput = createRef<HTMLInputElement>();
  const [configType, setConfigType] = useState<BoostConfigType>('all');

  const [displayMessage, setDisplayMessage] = useState({head: '', body: ''});

  const [showModal, setShowModal] = useState(false);
  const handleErrorClose = () => setShowModal(false);


  // Function to click the hidden file input button (this is a work around to avoid the ugly
  // UI of the default input file button)
  const handleClickUpload = (type: BoostConfigType) => {
    if (fileInput.current) {
      setConfigType(type);
      fileInput.current.click();
    }
  };

  // Check if a config with the same given name exists
  const configExist = (type: BoostConfigType, name: string) => {
    let found = false;
    configs.forEach((config) => {
      if (config.type === type && config.options.includes(`${name}.json`)) {
        found = true;
      };
    });
    return found;
  }; 

  // This method gets called even if the user uploads a file and the second time they cancel
  // to upload, hence the need to check that the files attribute is not an array of 0 length
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.files.length !== 0) {
      const dispErr = (message: string) => {
        setDisplayMessage({head: 'Upload Failed', body: message});
        setShowModal(true);
      };
      onUploadConfig(configType, event.target.files[0], dispErr, configExist);
    }
  };

  return (
    <>
<<<<<<< HEAD
      <Modal show={showModal} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b className="mx-3">{displayMessage.head}</b>
=======
    <Modal show={showUploadError} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
            />
            <b className="mx-3">Upload Failed</b>
>>>>>>> parent of 16400a9... Apply prettier formatting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{displayMessage.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleErrorClose}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>
    <Card style={{ marginTop: '2.5rem' }}>
      <Card.Body>
        <Card.Title style={{ marginBottom: '1.5rem' }}>
          Configuration
        <Button
            variant="outline-primary"
            className="float-right"
            onClick={() => handleClickUpload('all')}
          >
            Upload All Configs
          </Button>
        </Card.Title>
        <>
          <input
            ref={fileInput}
            onChange={handleFileUpload}
            type="file"
            style={{ display: 'none' }}
            accept=".json"
            multiple={false}
          />
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
                <Button
                  variant="outline-primary"
                  className="float-right mb-1"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickUpload(config.type);
                  }}
                >
                  <FontAwesomeIcon icon={faFileUpload} />
                </Button>
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
    </>
  );
}
