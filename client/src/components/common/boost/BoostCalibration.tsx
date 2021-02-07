import React , {useCallback, useState} from 'react';
import {Button, Card, InputGroup, FormControl} from 'react-bootstrap';
import {setCalibration as sendCalibrationValue, resetCalibration} from 'api/common/powerModel';
import {useSensorData} from 'api/v2/sensors/data';

/**
 * Boost distance claibration input form
 * 
 * @returns {React.Component} Component
 */
function BoostCalibrationInput() {
    const [calibrationValue, setCalib] = useState('');

    const handleCalibrationChange = useCallback(
        (event) => {
        setCalib(event.target.value);
        },
        [setCalib],
    );

    const onSet = useCallback(
        () => {
          const calibValue: number = parseInt(calibrationValue, 10);
          if (Number.isNaN(calibValue)) {
            alert("Please enter an integer value only!");
          }
          else {
            console.log(calibValue);
            sendCalibrationValue(parseInt(calibrationValue, 10));
          }
          setCalib('');
        },
        [calibrationValue, setCalib],
    );

    const handleKeyPressed = useCallback(
        (event) => { if (event.key === 'Enter') onSet(); },
        [onSet]
    );

    return (
    <InputGroup className="mb-1" >
        <FormControl
            onChange={handleCalibrationChange}
            onKeyPress={handleKeyPressed}
            placeholder="Calibrate distance..."
            value={calibrationValue}
        />
        <InputGroup.Append className="l5">
            <Button className="mr-2" variant="outline-secondary" onClick={onSet}>Set</Button>
        </InputGroup.Append>
        
        <Button variant="outline-danger" onClick={resetCalibration}>Reset</Button>
    </InputGroup>
    );
}

/**
 * Boost calibration card, displays the calibrated distance and the 
 * distance travelled by the bike
 * 
 * @returns {React.Component} Component
 */
export default function BoostCalibration() {
    const [distTravelled] = useState(30);

    const GetDistTravelled = () => {
        return useSensorData("reed_distance").data;
    };
    console.log(GetDistTravelled());
    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text>
                    BOOST may use a distance different to the bike&apos;s travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <div className="pb-3">
                    <b>Distance travelled (m) </b> <span className="float-right pr-4" > {distTravelled} </span>
                </div>
                <div className="pb-3">
                  <b>Calibrated distance (m) </b> <span className="float-right pr-4"> 40 </span>
                </div>
                <BoostCalibrationInput/>
            </Card.Body>
        </Card>
    );
}
