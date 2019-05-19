/* global io */
const socket = io();
let numberOfZones = 0;

function removeZoneCards() {
  const zoneCards = document.getElementsByClassName('zone');
  for (let index = 0; index < zoneCards.length; index += 1) {
    zoneCards[index].remove();
  }
}

/*
    Dynamically generate zone cards
*/
function renderZoneCards(numZones) {
  const formElement = document.getElementById('powerZoneForm');
  removeZoneCards();
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
  if (numberOfZones === zoneValue || Number.isNaN(zoneValue)) {
    return;
  }
  numberOfZones = zoneValue;
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
        zoneDict[zoneInputMatch.groups.value] = form.elements[index].value;
        outputDict[zoneInputMatch.groups.zone] = zoneDict;
      } else {
        outputDict[form.elements[index].id] = form.elements[index].value;
      }
    }
  }
  // Submit form input here
  console.log(outputDict);
  // TODO: Confirmation alert/modal that tells user that they have created a power plan
  socket.emit('create-power-plan', outputDict);
}
