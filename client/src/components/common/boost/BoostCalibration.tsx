import React , {useState, useCallback} from 'react';
import {Button, Card, Form, Col} from 'react-bootstrap';
// import {useSensorData} from 'api/v2/sensors/data';

export interface BoostCalibrationProps {
    onSet: (calibValue: number) => void;
    onReset: () => void;
  }

/**
 * Boost calibration card, displays the calibrated distance and the 
 * distance travelled by the bike
 * 
 * @returns {React.Component} Component
 */
export default function BoostCalibration({
    onSet, onReset
}: BoostCalibrationProps) {
    const [state, setState] = useState({validated: false, calibrationValue: 0});

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

  const handleSubmit = useCallback(
      (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        else {
            const value = state.calibrationValue;
            onSet(value);
            console.log(value);
        }
        event.preventDefault();
        setState(prevState => ({
        ...prevState,
        validated: true})
        );
    },
    [state, onSet, setState]);

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
                            <Form.Control 
                            type="number" 
                            placeholder="Calibrate distance..." 
                            onKeyPress={handleKeyPressed}
                            onChange={handleCalibrationChange}
                            required/>
                            <Form.Control.Feedback type="invalid">
                            Please provide a valid calibration distance.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Button  type="submit" >Set</Button>
                        <Button variant="outline-danger" className="float-right pr-3" onClick ={onReset} >Reset</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

// export default function BoostCalibration() {
//     // const GetDistTravelled = () => {
//     //     return useSensorData("reed_distance").data;
//     // };
//     const [state, setState] = useState({calibrationValue: "", validated: false});

//     const handleCalibrationChange = useCallback(
//         (event) => {
//         const val = event.target.value;
//         setState(prevState => ({
//                 ...prevState,
//                 calibrationValue: val
//              }));
//         },
//         [setState],
//     );

//     const onSet = useCallback((event: any) => {
//         const calibValue: number = parseInt(state.calibrationValue, 10);
//         if (Number.isNaN(calibValue)) {
//             event.preventdefault();
//             event.stopPropagation();
//         }
//         else {
//             console.log("All goods");
//             console.log(calibValue);
//         }
    
//         setState(prevState => ({
//             ...prevState,
//             validated: true
//         }));
//         console.log(state.calibrationValue);
//       },
//       [state, setState]);

//     const handleKeyPressed = useCallback(
//         (event) => { 
//             if (event.key === 'Enter') onSet(event); 
//         },
//         [onSet]
//     );

//     return (
//         <Card >
//             <Card.Body>
//                 <Card.Title>Calibration</Card.Title>
//                 <Card.Text>
//                     BOOST may use a distance different to the bike&apos;s travelled distance for the purposes of generating power plan data.
//                 </Card.Text>
//                 <div className="pb-3">
//                     <b>Distance travelled </b> <span className="float-right pr-4" > 30 m </span>
//                 </div>
//                 <div className="pb-3">
//                   <b>Calibrated distance </b> <span className="float-right pr-4"> 40 m </span>
//                 </div>
//                 <InputGroup className="mb-1" >
//                     <FormControl
//                         onChange={handleCalibrationChange}
//                         onKeyPress={handleKeyPressed}
//                         placeholder="Calibrate distance..."
//                         value={state.calibrationValue}
//                         type="number"
//                         required
//                     />
//                     <Form.Control.Feedback type="invalid" className="mb-4">
//                         Please provide a valid calibration distance.
//                     </Form.Control.Feedback>
//                     <InputGroup.Append className="l5">
//                         <Button className="mr-2" variant="outline-secondary" onClick={onSet}>Set</Button>
//                     </InputGroup.Append>
                    
//                     <Button variant="outline-danger" >Reset</Button>
//                 </InputGroup>
//             </Card.Body>
//         </Card>
//     );
// }