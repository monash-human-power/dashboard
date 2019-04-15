const socket = io();

function resetDistance() {
    console.log('Reset distance');
    socket.emit('reset-calibration');
}

function submitActualDistance() {
    let calibrated_distance = document.getElementById('input-calibration').value;
    if ((calibrated_distance < 0) || (calibrated_distance == "")){
        console.error('Invalid distance');
        document.getElementById('invalid-distance-message').style.display = 'block';
        document.getElementById('valid-distance-message').style.display = 'none';
        return;
    }
    console.log('Submit calibration distance: ' + calibrated_distance);
    socket.emit('submit-calibration', calibrated_distance);
    document.getElementById('input-calibration').value = "";
    document.getElementById('invalid-distance-message').style.display = 'none';
    document.getElementById('valid-distance-message').style.display = 'block';
}