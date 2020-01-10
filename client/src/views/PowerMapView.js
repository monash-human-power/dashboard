import React from 'react';
import classNames from 'classnames';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import LabelledControl from 'components/LabelledControl';

export default function PowerMapView() {
  // eslint-disable-next-line
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = (data) => { console.log(data); };
  console.log(errors);

  return (
    <Container>
      <h1>Generate Power Map</h1>
      <Card>
        <Card.Body>
          <Card.Title>Pre-fill Plans</Card.Title>
        </Card.Body>
      </Card>
      <Button block variant="danger">Reset Form</Button>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  label="Number of Zones"
                  error={errors.numZones && 'Number of Zones is required'}
                  name="numZones"
                  ref={register({ required: true })}
                  as="select"
                >
                  <option value="">Select number of zones</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </LabelledControl>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label htmlFor="inputFileName">Power Plan File Name</Form.Label>
                  <InputGroup className={classNames(errors.fileName && 'is-invalid')}>
                    <Form.Control
                      id="inputFileName"
                      name="fileName"
                      ref={register({ required: true, pattern: /^[\w\-. ]+$/ })}
                      placeholder="Filename"
                      className={classNames(errors.fileName && 'is-invalid')}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>.json</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.fileName && 'File Name is invalid'}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Mass"
                  error={!!errors.mass}
                  placeholder="Mass"
                  name="mass"
                  ref={register({ required: true, min: 0 })}
                  min="0"
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Start Adjust"
                  error={!!errors.startAdjust}
                  placeholder="Start Adjust"
                  name="startAdjust"
                  ref={register({ required: true, min: 0 })}
                  min="0"
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Lower Bound"
                  error={!!errors.lowerBound}
                  placeholder="Lower Bound"
                  name="lowerBound"
                  ref={register({ required: true })}
                />
              </Col>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Upper Bound"
                  error={!!errors.upperBound}
                  placeholder="Upper Bound"
                  name="upperBound"
                  ref={register({ required: true })}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Step"
                  error={!!errors.step}
                  placeholder="Step"
                  name="step"
                  ref={register({ required: true })}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="Start Trap"
                  error={!!errors.startTrap}
                  placeholder="Start Trap"
                  name="startTrap"
                  ref={register({ required: true })}
                />
              </Col>
              <Col sm={6}>
                <LabelledControl
                  type="number"
                  label="End Trap"
                  error={!!errors.endTrap}
                  placeholder="End Trap"
                  name="endTrap"
                  ref={register({ required: true })}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Button type="submit">Submit</Button>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
