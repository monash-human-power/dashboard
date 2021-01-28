import React, { useCallback } from 'react';
import classNames from 'classnames';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ContentPage from 'components/common/ContentPage';
import LabelledControl from 'components/v2/power_map/LabelledControl';
import { getPresets, useGeneratePowerPlan } from 'api/v2/powerPlan';

/**
 * Power Map page component
 *
 * @returns {React.Component} Component
 */
export default function PowerMapView() {
  const {
    generate: generatePowerPlan,
    generating,
    generated,
  } = useGeneratePowerPlan();
  const { register, handleSubmit, watch, errors, reset } = useForm();

  const onSubmit = useCallback(
    (data) => {
      const plan = {
        fileName: data.fileName,
        mass: parseInt(data.mass, 10),
        startAdjust: parseInt(data.startAdjust, 10),
        lowerBound: parseInt(data.lowerBound, 10),
        upperBound: parseInt(data.upperBound, 10),
        step: parseInt(data.step, 10),
        startTrap: parseInt(data.startTrap, 10),
        endTrap: parseInt(data.endTrap, 10),
        zones: data.zones.map((zone) => ({
          recPower: parseInt(zone.recPower, 10),
          maxTime: parseInt(zone.maxTime, 10),
          spentTime: parseInt(zone.spentTime, 10),
        })),
      };

      generatePowerPlan(plan);
      reset({});
    },
    [generatePowerPlan, reset],
  );

  const presetButtons = getPresets().map((preset) => (
    <Button
      variant="outline-primary"
      onClick={() =>
        reset({
          ...preset.value,
          numZones: preset.value.zones.length,
        })
      }
      key={preset.name}
    >
      {preset.name}
    </Button>
  ));

  const zoneCount = parseInt(watch('numZones') || '0', 10);
  const zones = [...Array(zoneCount)].map((_, index) => {
    const fieldname = `zones[${index}]`;
    const zoneErrors = errors.zones?.[index];

    return (
      <fieldset name={fieldname} key={fieldname}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{`Zone ${index + 1}`}</Card.Title>
            <Form.Row>
              <Col lg={4}>
                <LabelledControl
                  type="number"
                  label="Recommended Power"
                  error={!!zoneErrors?.recPower}
                  placeholder="Recommended Power"
                  name={`${fieldname}.recPower`}
                  ref={register({ required: true })}
                />
              </Col>
              <Col lg={4}>
                <LabelledControl
                  type="number"
                  label="Max Time"
                  error={!!zoneErrors?.maxTime}
                  placeholder="Max Time"
                  name={`${fieldname}.maxTime`}
                  ref={register({ required: true })}
                />
              </Col>
              <Col lg={4}>
                <LabelledControl
                  type="number"
                  label="Spent Time"
                  error={!!zoneErrors?.spentTime}
                  placeholder="Spent Time"
                  name={`${fieldname}.spentTime`}
                  ref={register({ required: true })}
                />
              </Col>
            </Form.Row>
          </Card.Body>
        </Card>
      </fieldset>
    );
  });

  return (
    <ContentPage title="Generate Power Map">
      <Card>
        <Card.Body>
          <Card.Title>Pre-fill Plans</Card.Title>
          {presetButtons}
        </Card.Body>
      </Card>
      <Button block variant="danger" onClick={reset} className="mb-4">
        Reset Form
      </Button>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-4">
          <Card.Body>
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
                  <Form.Label htmlFor="inputFileName">
                    Power Plan File Name
                  </Form.Label>
                  <InputGroup
                    className={classNames(errors.fileName && 'is-invalid')}
                  >
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
          </Card.Body>
        </Card>
        {zones}
        <Button type="submit" disabled={generating}>
          {generating ? <Spinner animation="border" /> : 'Submit'}
        </Button>
      </Form>
      {generated && (
        <Alert variant="success">Power plan finished generation!</Alert>
      )}
    </ContentPage>
  );
}
