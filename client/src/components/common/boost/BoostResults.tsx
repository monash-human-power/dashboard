import React from 'react';
import { BoostResultsT } from 'types/boost';
import { Table, Accordion, Button, Card } from 'react-bootstrap';

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
  const SPEED_PRECISION = 2;
  const MS_TO_KMH = 3.6;

  const maxSpeed = results ? results.maxSpeed * MS_TO_KMH : null;

  return (
    <>
      <Accordion className="small p-0 my-4">
        <Card>
          <Accordion.Toggle
            className="p-2"
            eventKey="0"
            variant="outline-primary"
            as={Button}
            style={{ cursor: 'pointer' }}
          >
            View Plan
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <div className="ml-2">
                <b>Max Speed: </b>
                <span className="float-right">
                  {' '}
                  {maxSpeed
                    ? `${maxSpeed.toFixed(SPEED_PRECISION)} km/h`
                    : 'N/A'}{' '}
                </span>
              </div>
              <div className="my-2 ml-2">
                <b>File name:</b>
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
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}
