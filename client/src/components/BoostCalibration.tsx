import React from 'react';
import {Button, Card, InputGroup, FormControl} from 'react-bootstrap';

export default function BoostCalibration() {
    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text style={{ width: '35rem' }}>
                    BOOST may use a distance different to the bike's travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <b>Distance travelled </b>
                <p></p>
                <b>Calibrated distance</b>
                <p></p>
                <InputGroup className="mb-3" >
                    <FormControl
                        placeholder="Calibrate distance"
                    />
                    <InputGroup.Append className="l5">
                        <Button className="mr-2" variant="outline-secondary" >Set</Button>
                    </InputGroup.Append>
                    
                    <Button variant="outline-danger">Reset</Button>
                </InputGroup>
            </Card.Body>
        </Card>
    )
}
