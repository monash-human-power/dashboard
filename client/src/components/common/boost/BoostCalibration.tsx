import React , {useState, useCallback} from 'react';
import {Button, Card, Form, Col} from 'react-bootstrap';
// import {setCalibration as sendCalibrationValue, resetCalibration} from 'api/common/powerModel';
// import {useSensorData} from 'api/v2/sensors/data';

/**
 * Boost calibration card, displays the calibrated distance and the 
 * distance travelled by the bike
 * 
 * @returns {React.Component} Component
 */
export default function BoostCalibration() {
    const [state, setState] = useState({validated: false});

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setState(prevState => ({
      ...prevState,
      validated: true})
      );
  };

    const handleKeyPressed = useCallback(
            (event) => { 
                if (event.key === 'Enter') handleSubmit(event); 
            },
            [handleSubmit]
        );

    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text>
                    BOOST may use a distance different to the bike&apos;s travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <div className="pb-3">
                    <b>Distance travelled </b> <span className="float-right pr-4" > 30 m </span>
                </div>
                <div className="pb-3">
                  <b>Calibrated distance </b> <span className="float-right pr-4"> 40 m </span>
                </div>
                <Form noValidate validated={state.validated} onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} md="4" >
                            <Form.Control type="number" placeholder="Calibrate distance..." onKeyPress={handleKeyPressed} required />
                            <Form.Control.Feedback type="invalid">
                            Please provide a valid calibration distance.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Button  type="submit" >Set</Button>
                        <Button variant="outline-danger" className="float-right pr-3" >Reset</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
    );
}
