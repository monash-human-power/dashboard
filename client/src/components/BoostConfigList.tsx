import { faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Button } from 'react-bootstrap';
import FontAwesomeIcon from './FontAwesomeIcon';
import WidgetListGroupItem from './WidgetListGroupItem';
import styles from './BoostConfigList.module.css';

export interface BoostConfigListProps {
  configNames: string[];
  activeConfig?: string;
  onSelectConfig: (configName: string) => void;
  onDeleteConfig: (configName: string) => void;
}

export default function BoostConfigList({
  configNames,
  activeConfig,
  onSelectConfig,
  onDeleteConfig,
}: BoostConfigListProps) {
  const handleSelect = (configName: string) => {
    if (configName !== activeConfig) onSelectConfig(configName);
  };
  const handleDelete = (event: React.MouseEvent, configName: string) => {
    event.stopPropagation();
    onDeleteConfig(configName);
  };
  if (configNames.length === 0)
    return (
      <div className={styles.empty_dialogue}>
        <div className={styles.file_icon}>
          <FontAwesomeIcon icon={faFile} />
        </div>
        {'\n'}
        No configs uploaded yet!
      </div>
    );
  return (
    <>
      {configNames.map((configName) => (
        <WidgetListGroupItem
          title={configName}
          active={configName === activeConfig}
          action
          onClick={() => handleSelect(configName)}
          as="a"
        >
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => handleDelete(e, configName)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </WidgetListGroupItem>
      ))}
    </>
  );
}
