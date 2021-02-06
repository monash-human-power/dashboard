import { faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Button } from 'react-bootstrap';
import { BoostConfig } from 'types/boost';
import FontAwesomeIcon from 'components/common/FontAwesomeIcon';
import WidgetListGroupItem from 'components/common/WidgetListGroupItem';
import styles from 'components/common/boost/BoostConfigList.module.css';

export interface BoostConfigListProps {
  config: BoostConfig;
  onSelectConfig: (configName: string) => void;
  onDeleteConfig: (configName: string) => void;
}

/**
 * Selectors for BOOST config
 *
 * @param props Props
 * @returns Component
 */
export default function BoostConfigList({
  config,
  onSelectConfig,
  onDeleteConfig,
}: BoostConfigListProps) {
  const handleSelect = (configName: string) => {
    if (configName !== config.active) onSelectConfig(configName);
  };
  const handleDelete = (event: React.MouseEvent, configName: string) => {
    event.stopPropagation();
    onDeleteConfig(configName);
  };
  if (config.options.length === 0)
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
      {config.options.map((configName) => (
        <WidgetListGroupItem
          title={configName}
          active={configName === config.active}
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
