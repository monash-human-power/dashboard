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

    const [calibrationValue, setCalibration] = useState(0);

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
    <InputGroup className="mb-1" >
        <FormControl
            onChange={handleCalibrationChange}
            placeholder="Calibrate distance..."
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
    // let distTravelled:number = 30;
    const [distTravelled] = useState(30);

    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text style={{ width: '35rem' }}>
                    BOOST may use a distance different to the bike&apos;s travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <div className="pb-3">
                    <b>Distance travelled (m) </b> <span className="float-right pr-4" > {distTravelled} </span>
                </div>
                <div className="pb-3">
                  <b>Calibrated distance (m) </b> <span className="float-right pr-4"> 40 </span>
                </div>
                <BoostCalibrationInput onCalibrationReset={onCalibrationReset} onCalibrationSet={onCalibrationSet}/>
            </Card.Body>
        </Card>
    );
}
