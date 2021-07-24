import React from 'react';
import { BoostResultsT } from 'types/boost';
import { Table } from 'react-bootstrap';

export interface BoostResultsProps {
  results: BoostResultsT | null;
}

/**
 * Displays the Maximum achievable speed and the power plan (the distance and the associated recommended power)
 *
 * @param props BoostResultProps
 * @returns JSX Element
 */
export default function BoostResults(props: BoostResultsProps) {
  const { results } = props;
  const speedPrecision = 2;

  if (!results) {
    return <div>No Power Plan Profile Generated Yet...</div>;
  }

  return (
    <>
      <div className="ml-2">
        Max Speed:
        <span className="float-right">
          {' '}
          {results
            ? `${results.maxSpeed.toFixed(speedPrecision)} km/h`
            : 'N/A'}{' '}
        </span>
      </div>
      <div className="my-2 ml-2">
        File name:{' '}
        <i className="small float-right">
          {results ? `(${results.fileName})` : ''}
        </i>
      </div>
      <Table striped bordered hover size="sm m-1">
        <thead>
          <tr>
            <th>Distance (m)</th>
            <th>Power (W)</th>
          </tr>
        </thead>
        <tbody>
          {results?.zones.map((value) => {
            return (
              <tr>
                <td>{Math.round(value.distance)}</td>
                <td>{Math.round(value.power)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
