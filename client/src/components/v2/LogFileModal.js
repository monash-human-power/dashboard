import React, { useState, useEffect } from 'react';
import {
  Col,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import VelocityTimeChart from 'components/charts/VelocityTimeChart';
import PowerTimeChart from 'components/charts/PowerTimeChart';
import CadenceTimeChart from 'components/charts/CadenceTimeChart';
import LocationTimeChart from 'components/charts/LocationTimeChart';
import { downloadFile } from 'api/v2/files';

/**
 * @typedef {import('api/v2/files').LogFile} LogFile
 */

/**
 * @typedef {object} LogFileModalProps
 * @property {LogFile}  file    Log file to show
 * @property {boolean}  show    Show the modal
 * @property {Function} onHide  Hide modal callback
 */

/**
 * Log file preview modal
 *
 * @param {LogFileModalProps} props Props
 * @returns {React.Component<LogFileModalProps>} Component
 */
export default function LogFileModal({ file, show, onHide }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({}); // eslint-disable-line

  useEffect(() => {
    /** Download log file data */
    async function loadData() {
      setData(await downloadFile(file));
      setLoading(false);
    }

    if (file) {
      setLoading(true);
      loadData();
    }
  }, [file]);

  /**
   * Render preview charts
   *
   * @returns {React.Component} Component
   */
  function renderCharts() {
    return (
      <div>
        <Row>
          <Col lg={6}>
            <VelocityTimeChart
              series={(data.series ?? []).map((x) => ({ time: x.time, value: x.gps_speed }))}
              max={0}
            />
          </Col>
          <Col lg={6}>
            <PowerTimeChart
              series={(data.series ?? []).map((x) => ({ time: x.time, value: x.power }))}
              max={0}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <CadenceTimeChart
              series={(data.series ?? []).map((x) => ({ time: x.time, value: x.cadence }))}
              max={0}
            />
          </Col>
          <Col lg={6}>
            <LocationTimeChart series={[]} />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
    >
      <Modal.Header>
        <Modal.Title>Log File Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>
            <Spinner animation="border" />
          </div>
        ) : renderCharts()}
      </Modal.Body>
    </Modal>
  );
}

LogFileModal.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

LogFileModal.defaultProps = {
  file: null,
};
