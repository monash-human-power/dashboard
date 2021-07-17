import React from 'react';
import { BoostResultT } from 'types/boost';
import { Card, Accordion, Table } from 'react-bootstrap';

export interface BoostResultProps {
  results: BoostResultT | null;
}

/**
 * Displays the Maximum achievable speed and the power plan (the distance and the associated recommended power)
 *
 * @param props BoostResultProps
 * @returns JSX Element
 */
export default function BoostResult(props: BoostResultProps) {
  const { results } = props;

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title className="small">
          <b>BOOST Output:</b>
        </Card.Title>
        <div className="small pb-3">
          Maximum Speed
          <span className="float-right pr-4">
            {results ? `${results.maxSpeed} km/h` : 'N/A'}
          </span>
        </div>
        <Accordion className="small p-0">
          <Card>
            <Accordion.Toggle
              className="p-2"
              eventKey="0"
              as={Card.Header}
              style={{ cursor: 'pointer' }}
            >
              View plan{' '}
              <i className="small">{results ? `(${results.fileName})` : ''}</i>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table striped bordered hover size="sm">
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
                          <td>{value.distance}</td>
                          <td>{value.power}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Card.Body>
    </Card>
  );
}
