import React , {useCallback, useState} from 'react';
import {Button, Card, InputGroup, FormControl} from 'react-bootstrap';
// import {setCalibration as sendCalibrationValue, resetCalibration} from 'api/common/powerModel';
// import {useSensorData} from 'api/v2/sensors/data';

/**
 * Boost calibration card, displays the calibrated distance and the 
 * distance travelled by the bike
 * 
 * @returns {React.Component} Component
 */
export default function BoostCalibration() {
    // const GetDistTravelled = () => {
    //     return useSensorData("reed_distance").data;
    // };
    const [state, setState] = useState({calibrationValue: "", validated: true});

    const handleCalibrationChange = useCallback(
        (event) => {
        const val = event.target.value;
        setState(prevState => ({
                ...prevState,
                calibrationValue: val
             }));
        },
        [setState],
    );

    const onSet = useCallback((event: any) => {
        const calibValue: number = parseInt(state.calibrationValue, 10);
        if (Number.isNaN(calibValue)) {
            event.preventdefault();
            event.stopPropagation();
        }
        else {
            console.log(calibValue);
        }
    
        setState(prevState => ({
            ...prevState,
            validated: true
        }));
      },
      [state, setState]);

    const handleKeyPressed = useCallback(
        (event) => { 
            if (event.key === 'Enter') onSet(event); 
        },
        [onSet]
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
                <InputGroup className="mb-1" >
                    <FormControl
                        onChange={handleCalibrationChange}
                        onKeyPress={handleKeyPressed}
                        placeholder="Calibrate distance..."
                        value={state.calibrationValue}
                        type="number"
                        required
                    />
                    <InputGroup.Append className="l5">
                        <Button className="mr-2" variant="outline-secondary" onClick={onSet}>Set</Button>
                    </InputGroup.Append>
                    
                    <Button variant="outline-danger" >Reset</Button>
                </InputGroup>
            </Card.Body>
        </Card>
    );
}
