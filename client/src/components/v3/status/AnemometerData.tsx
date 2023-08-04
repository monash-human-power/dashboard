import React from 'react';
import { Col, Table } from 'react-bootstrap';
import OnlineStatusPill from 'components/common/OnlineStatusPill';
import { WMStatus as WMStatusT } from 'types/data';

export type WMStatusProps = WMStatusT;

/**
 * Data for Anemometer
 *
 * @property props Props
 * @returns component
 */
export default function AnemometerData(props: WMStatusProps) {
  const { moduleName, online } = props;

  const statusPill = (
    <span>
      <b>{moduleName}</b> <OnlineStatusPill isOnline={online} />
    </span>
  );

  return (
    <Col md xl="12" className="my-2">
      {statusPill}

      {/* Only show more information if the anemometer is online */}
      {online && (
        <>
          <p> </p>
          <span>
            {' '}
            <b>Wind Speed</b>{' '}
          </span>
          <p> </p>
          <Table bordered hover>
            <tbody>
              {/* Wind Speed Labels */}
              <tr>
                <td>
                  <strong>Min</strong>
                </td>
                <td>
                  <strong>Avg</strong>
                </td>
                <td>
                  <strong>Max</strong>
                </td>
              </tr>

              {/* Wind Speed Data */}
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </Table>

          <span>
            {' '}
            <b>Wind Direction</b>{' '}
          </span>
          <p> </p>
          <Table bordered hover>
            <tbody>
              {/* Wind Direction Labels */}
              <tr>
                <td>
                  <strong>Min</strong>
                </td>
                <td>
                  <strong>Avg</strong>
                </td>
                <td>
                  <strong>Max</strong>
                </td>
              </tr>

              {/* Wind Direction Data */}
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Col>
  );
}
