import React , {useCallback, useState} from 'react';
import {Button, Card, InputGroup, FormControl} from 'react-bootstrap';

export interface BoostCalibrationProps {
    onCalibrationSet: () => void;
    onCalibrationReset: () => void;
  }

function BoostCalibrationInput({
    onCalibrationSet,
    onCalibrationReset
}: BoostCalibrationProps) {

    const [calibrationValue, setCalibration] = useState('');

    const handleCalibrationChange = useCallback(
        (event) => {
        setCalibration(event.target.value);
        },
        [setCalibration],
    );

    // const handleKeyPressed = useCallback(
    //     (event) => {
    //     if (event.key === 'Enter') {
    //         sendMessage(message);
    //         setMessage('');
    //     }
    //     },
    //     [message, setMessage],
    // );

    return (
    <InputGroup className="mb-3" >
        <FormControl
            onChange={handleCalibrationChange}
            placeholder="Calibrate distance"
            value={calibrationValue}
        />
        <InputGroup.Append className="l5">
            <Button className="mr-2" variant="outline-secondary" onClick={onCalibrationSet}>Set</Button>
        </InputGroup.Append>
        
        <Button variant="outline-danger" onClick={onCalibrationReset}>Reset</Button>
    </InputGroup>
    );
}

export default function BoostCalibration({
    onCalibrationSet,
    onCalibrationReset
}: BoostCalibrationProps) {
    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text style={{ width: '35rem' }}>
                    BOOST may use a distance different to the bike&apos s travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <b>Distance travelled </b>
                <p/>
                <b>Calibrated distance</b>
                <p/>
                <BoostCalibrationInput onCalibrationReset={onCalibrationReset} onCalibrationSet={onCalibrationSet}/>
            </Card.Body>
        </Card>
    );
}
