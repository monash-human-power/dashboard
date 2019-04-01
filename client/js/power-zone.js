let numberOfZones = 0;

/*
    Dynamically generate zone cards
*/
function renderZoneCards(numZones) {
    let formElement = document.getElementById('powerZoneForm');
    formElement.innerHTML = '';

    for (let zoneNumber = 1; zoneNumber <= numZones; zoneNumber++) {
        // Create card
        let card = document.createElement('div');
        card.className = 'card';
    
        let cardBody = document.createElement('div')
        cardBody.className = 'card-body';
    
        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.innerHTML = 'Zone ' + zoneNumber ;
    
        let formRow = document.createElement('div');
        formRow.className = 'form-row';
    
        // Recommended Power
        let recPowerFormGroup = document.createElement('div');
        recPowerFormGroup.className = 'form-group col-md-4';
        let recPowerInput = document.createElement('input');
        recPowerInput.className = 'form-control';
        recPowerInput.id = 'zone1RecPower';
        recPowerInput.setAttribute('type', 'number');
        recPowerInput.placeholder = 'Recommended Power';
        recPowerFormGroup.appendChild(recPowerInput);
    
        // Max Time
        let maxTimeFormGroup = document.createElement('div');
        maxTimeFormGroup.className = 'form-group col-md-4';
        let maxTimeInput = document.createElement('input');
        maxTimeInput.className = 'form-control';
        maxTimeInput.id = 'zone1MaxTime';
        maxTimeInput.setAttribute('type', 'number');
        maxTimeInput.placeholder = 'Max Time';
        maxTimeFormGroup.appendChild(maxTimeInput);
    
        // Spent Time
        let spentTimeFormGroup = document.createElement('div');
        spentTimeFormGroup.className = 'form-group col-md-4';
        let spentTimeInput = document.createElement('input');
        spentTimeInput.className = 'form-control';
        spentTimeInput.id = 'zone1SpentTime';
        spentTimeInput.setAttribute('type', 'number');
        spentTimeInput.placeholder = 'Spent Time';
        spentTimeFormGroup.appendChild(spentTimeInput);
    
        formRow.appendChild(recPowerFormGroup);
        formRow.appendChild(maxTimeFormGroup);
        formRow.appendChild(spentTimeFormGroup);
    
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(formRow);
        card.appendChild(cardBody);
        formElement.appendChild(card);
    }
    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.className = 'btn btn-primary';
    submitButton.innerHTML = 'Submit';

    let formRow = document.createElement('div');
    formRow.className = 'form-row';

    let divColumn = document.createElement('div');
    divColumn.className = 'col-sm-10';
    divColumn.appendChild(submitButton);
    formRow.appendChild(divColumn);
    formElement.appendChild(formRow);
}

function numZoneHandler(zoneValue) {
    if ((numberOfZones == zoneValue) || (isNaN(zoneValue))) {
        return;
    }
    numberOfZones = zoneValue;
    renderZoneCards(zoneValue);
}
