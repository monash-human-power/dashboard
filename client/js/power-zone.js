/* global io */
const socket = io();
let NUMBER_OF_ZONES = 0;

function clearForm() {
  document.getElementById('powerZoneForm').reset();
  NUMBER_OF_ZONES = 0;
  document.getElementById('inputFileName').value = '';
  document.getElementById('inputLowerBound').value = '';
  document.getElementById('inputUpperBound').value = '';
  document.getElementById('inputStep').value = '';
  document.getElementById('inputStartTrap').value = '';
  document.getElementById('inputEndTrap').value = '';
}

function removeZoneCards() {
  const zoneCards = document.getElementsByClassName('zone');
  zoneCards.forEach((zoneCard) => zoneCard.remove());
}

function removeAlerts() {
  const alerts = document.getElementsByClassName('alert');
  alerts.forEach((alert) => alert.remove());
}

function removeSpinners() {
  const spinner = document.getElementById('spinnerContainer');
  if (spinner) {
    spinner.remove();
  }
}

function resetForm() {
  clearForm();
  removeZoneCards();
}

/*
    Dynamically generate zone cards
*/
function renderZoneCards(numZones) {
  const formElement = document.getElementById('powerZoneForm');
  removeZoneCards();
  removeAlerts();
  removeSpinners();
  const zoneCardsElement = document.createElement('div');
  zoneCardsElement.className = 'zone';

  for (let zoneNumber = 1; zoneNumber <= numZones; zoneNumber += 1) {
    // Create card
    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.innerHTML = `Zone ${zoneNumber}`;

    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    // Recommended Power
    const recPowerFormGroup = document.createElement('div');
    recPowerFormGroup.className = 'form-group col-md-4';
    const recPowerInput = document.createElement('input');
    recPowerInput.className = 'form-control';
    recPowerInput.id = `zone${zoneNumber}RecPower`;
    recPowerInput.setAttribute('type', 'number');
    recPowerInput.placeholder = 'Recommended Power';
    recPowerFormGroup.appendChild(recPowerInput);

    // Max Time
    const maxTimeFormGroup = document.createElement('div');
    maxTimeFormGroup.className = 'form-group col-md-4';
    const maxTimeInput = document.createElement('input');
    maxTimeInput.className = 'form-control';
    maxTimeInput.id = `zone${zoneNumber}MaxTime`;
    maxTimeInput.setAttribute('type', 'number');
    maxTimeInput.placeholder = 'Max Time';
    maxTimeFormGroup.appendChild(maxTimeInput);

    // Spent Time
    const spentTimeFormGroup = document.createElement('div');
    spentTimeFormGroup.className = 'form-group col-md-4';
    const spentTimeInput = document.createElement('input');
    spentTimeInput.className = 'form-control';
    spentTimeInput.id = `zone${zoneNumber}SpentTime`;
    spentTimeInput.setAttribute('type', 'number');
    spentTimeInput.placeholder = 'Spent Time';
    spentTimeFormGroup.appendChild(spentTimeInput);

    formRow.appendChild(recPowerFormGroup);
    formRow.appendChild(maxTimeFormGroup);
    formRow.appendChild(spentTimeFormGroup);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(formRow);
    card.appendChild(cardBody);
    zoneCardsElement.appendChild(card);
  }
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.className = 'btn btn-primary';
  submitButton.id = 'submitButton';
  submitButton.innerHTML = 'Submit';

  const formRow = document.createElement('div');
  formRow.className = 'form-row';

  const divColumn = document.createElement('div');
  divColumn.className = 'col-sm-10';
  divColumn.appendChild(submitButton);
  formRow.appendChild(divColumn);
  zoneCardsElement.appendChild(formRow);
  formElement.appendChild(zoneCardsElement);
}

// eslint-disable-next-line no-unused-vars
function numZoneHandler(zoneValue) {
  if (
    zoneValue === 'default' ||
    NUMBER_OF_ZONES === zoneValue ||
    Number.isNaN(zoneValue)
  ) {
    return;
  }
  NUMBER_OF_ZONES = zoneValue;
  renderZoneCards(zoneValue);
}

// eslint-disable-next-line no-unused-vars
function formSubmitHandler(event) {
  event.preventDefault();
  const form = document.getElementById('powerZoneForm');
  const outputDict = {};
  for (let index = 1; index < form.elements.length - 1; index += 1) {
    // Group up 'inputs' information
    const inputMatch = form.elements[index].id.match(
      /(?<input>input)(?<value>.*)/,
    );
    if (inputMatch) {
      let inputDict = {};
      if (outputDict.inputs) {
        inputDict = outputDict.inputs;
      }
      inputDict[inputMatch.groups.value] = form.elements[index].value;
      outputDict.inputs = inputDict;
    } else {
      // Group up 'zone' information
      const zoneInputMatch = form.elements[index].id.match(
        /(?<zone>zone\d*)(?<value>.*)/,
      );
      if (zoneInputMatch) {
        let zoneDict = {};
        // Check if there is existing dict already
        if (outputDict[zoneInputMatch.groups.zone]) {
          zoneDict = outputDict[zoneInputMatch.groups.zone];
        }
        // If user does not place any value, default value of zero.
        if (form.elements[index].value === '') {
          form.elements[index].value = 0;
        }
        zoneDict[zoneInputMatch.groups.value] = form.elements[index].value;
        outputDict[zoneInputMatch.groups.zone] = zoneDict;
      } else {
        outputDict[form.elements[index].id] = form.elements[index].value;
      }
    }
  }
  // Submit form input here
  socket.emit('create-power-plan', outputDict);

  // Remove submit button
  const submitButton = document.getElementById('submitButton');
  submitButton.parentNode.removeChild(submitButton);

  resetForm();
  const defaultButton = document.getElementById('defaultButton');
  defaultButton.disabled = true;

  // Add spinner
  const spinnerContainer = document.createElement('div');
  spinnerContainer.id = 'spinnerContainer';
  const spinnerdiv = document.createElement('div');
  spinnerdiv.className = 'spinner-border text-primary';
  spinnerdiv.role = 'status';
  const spinner = document.createElement('span');
  spinner.className = 'sr-only';
  spinner.textContent = 'Loading...';
  spinnerdiv.appendChild(spinner);
  spinnerContainer.appendChild(spinnerdiv);

  form.appendChild(spinnerContainer);
}

// eslint-disable-next-line no-unused-vars
function prefill(config, zone) {
  document.getElementById('numZones').selectedIndex = config.numZones;
  numZoneHandler(config.numZones);
  document.getElementById('inputFileName').value = config.filename;
  document.getElementById('inputLowerBound').value = config.lowerBound;
  document.getElementById('inputUpperBound').value = config.upperBound;
  document.getElementById('inputStep').value = config.step;
  document.getElementById('inputStartTrap').value = config.startTrap;
  document.getElementById('inputEndTrap').value = config.endTrap;

  // Prefill zone values
  if (zone.one) {
    document.getElementById('zone1RecPower').value = zone.one.recPower;
    document.getElementById('zone1MaxTime').value = zone.one.maxTime;
    document.getElementById('zone1SpentTime').value = zone.one.spentTime;
  }

  if (zone.two) {
    document.getElementById('zone2RecPower').value = zone.two.recPower;
    document.getElementById('zone2MaxTime').value = zone.two.maxTime;
    document.getElementById('zone2SpentTime').value = zone.two.spentTime;
  }

  if (zone.three) {
    document.getElementById('zone3RecPower').value = zone.three.recPower;
    document.getElementById('zone3MaxTime').value = zone.three.maxTime;
    document.getElementById('zone3SpentTime').value = zone.three.spentTime;
  }

  if (zone.four) {
    document.getElementById('zone4RecPower').value = zone.four.recPower;
    document.getElementById('zone4MaxTime').value = zone.four.maxTime;
    document.getElementById('zone4SpentTime').value = zone.four.spentTime;
  }

  if (zone.five) {
    document.getElementById('zone5RecPower').value = zone.five.recPower;
    document.getElementById('zone5MaxTime').value = zone.five.maxTime;
    document.getElementById('zone5SpentTime').value = zone.five.spentTime;
  }

  if (zone.six) {
    document.getElementById('zone6RecPower').value = zone.six.recPower;
    document.getElementById('zone6MaxTime').value = zone.six.maxTime;
    document.getElementById('zone6SpentTime').value = zone.six.spentTime;
  }
}

// eslint-disable-next-line no-unused-vars
function prefillDefault() {
  const config = {
    numZones: 6,
    filename: 'default',
    lowerBound: 1000,
    upperBound: 1200,
    step: 100,
    startTrap: 4682,
    endTrap: 4882,
  };

  const zone = {
    one: {
      recPower: 100,
      maxTime: 100,
      spentTime: 0,
    },
    two: {
      recPower: 210,
      maxTime: 90,
      spentTime: 0,
    },
    three: {
      recPower: 280,
      maxTime: 45,
      spentTime: 0,
    },
    four: {
      recPower: 350,
      maxTime: 45,
      spentTime: 0,
    },
    five: {
      recPower: 450,
      maxTime: 60,
      spentTime: 0,
    },
    six: {
      recPower: 0,
      maxTime: 0,
      spentTime: 0,
    },
  };

  prefill(config, zone);
}

socket.on('power-plan-generated', function notifyPowerPlanGeneration() {
  // Remove spinner
  const spinner = document.getElementById('spinnerContainer');
  if (spinner) {
    spinner.parentNode.removeChild(spinner);
    const defaultButton = document.getElementById('defaultButton');
    defaultButton.disabled = false;
  }

  removeAlerts();

  // Replace with an alert
  const alert = document.createElement('div');
  alert.className = 'alert alert-success';
  alert.role = 'alert';
  alert.textContent = 'Power plan finished generation!';

  const form = document.getElementById('powerZoneForm');
  form.appendChild(alert);
});
