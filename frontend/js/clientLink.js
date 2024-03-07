
const SERVER__URL = `http://localhost:3000`;

async function getClientModul(id) {
    let resalt = await fetch(SERVER__URL + `/api/clients/` + id);
    return await resalt.json();
}

let URLClientData = new URLSearchParams(window.location.search);
let id = URLClientData.get('post_id');

let postData = await getClientModul(id);

function createModul() {
    let $modulBox = document.createElement('div');
    let $modulHeader = document.createElement('div');
    let $modulTitleBox = document.createElement('div');
    let $modulTitle = document.createElement('h2');
    let $modulTitleId = document.createElement('span');
    let $modulBtnClose = document.createElement('button');
    let $modulForm = document.createElement('form');
    let $modulLabelSur = document.createElement('label');
    let $modulLabelName = document.createElement('label');
    let $modulLabelLast = document.createElement('label');
    let $modulPlaceholdSur = document.createElement('span');
    let $modulInputSur = document.createElement('input');
    let $modulPlaceholdName = document.createElement('span');
    let $modulInputName = document.createElement('input');
    let $modulPlaceholdLast = document.createElement('span');
    let $modulInputLast = document.createElement('input');
    let $modulContacts = document.createElement('div');
    let $modulBlock = document.createElement('div');

    $modulBox.classList.add('modul__box', 'flex');
    $modulHeader.classList.add('modul__header', 'flex');
    $modulTitleBox.classList.add('modul__title');
    $modulTitle.classList.add('modul__title__action');
    $modulBtnClose.classList.add('modul__close', 'btn');
    $modulForm.classList.add('flex', 'modul__form');
    $modulLabelSur.classList.add('modul__label');
    $modulLabelName.classList.add('modul__label');
    $modulLabelLast.classList.add('modul__label');
    $modulInputSur.classList.add('modul__input');
    $modulInputName.classList.add('modul__input');
    $modulPlaceholdLast.classList.add('none')
    $modulInputLast.classList.add('modul__input');
    $modulContacts.classList.add('modul__contacts', 'flex')
    $modulBlock.classList.add('contacts__block');

    $modulTitle.setAttribute('id', 'modulTitle');
    $modulTitleId.setAttribute('id', 'modulClients');
    $modulBtnClose.setAttribute('id', 'btnModulClose');
    $modulForm.setAttribute('id', 'modulForm');
    $modulPlaceholdSur.setAttribute('id', 'modulPlaceholderSurname')
    $modulInputSur.setAttribute('id', 'modulInputSurname')
    $modulInputSur.setAttribute('data-required', 'true')
    $modulPlaceholdName.setAttribute('id', 'modulPlaceholderName')
    $modulInputName.setAttribute('id', 'modulInputName')
    $modulInputName.setAttribute('data-required', 'true')
    $modulPlaceholdLast.setAttribute('id', 'modulPlaceholderLastname')
    $modulInputLast.setAttribute('id', 'modulInputLastname')
    $modulBlock.setAttribute('id', 'modulContacts');

    $modulPlaceholdLast.placeholder = '';

    document.querySelector('.client__cards').append($modulBox);
    $modulBox.append($modulHeader);
    $modulHeader.append($modulTitleBox);
    $modulHeader.append($modulBtnClose);
    $modulTitleBox.append($modulTitle);
    $modulTitleBox.append($modulTitleId);
    $modulBox.append($modulForm);
    $modulForm.append($modulLabelSur);
    $modulLabelSur.append($modulPlaceholdSur);
    $modulLabelSur.append($modulInputSur);
    $modulForm.append($modulLabelName);
    $modulLabelName.append($modulPlaceholdName);
    $modulLabelName.append($modulInputName);
    $modulForm.append($modulLabelLast);
    $modulLabelLast.append($modulPlaceholdLast);
    $modulLabelLast.append($modulInputLast);
    $modulForm.append($modulContacts);
    $modulContacts.append($modulBlock);
}

function createModulClient(clientObj) {

    createModul(postData);

    document.getElementById('btnModulClose').remove();
    document.getElementById('modulTitle').textContent = "Клиент";
    document.getElementById('modulPlaceholderSurname').classList.add('modul__placeholder', 'add_client__surname--empty-input', 'modul__placeholder--small');
    document.getElementById('modulPlaceholderName').classList.add('modul__placeholder','add_client__name--empty-input', 'modul__placeholder--small');
    document.getElementById('modulPlaceholderLastname').classList.add('modul__placeholder', 'modul__placeholder--small', 'add-client__lastname--empty-input');
    document.getElementById('modulPlaceholderLastname').classList.remove('none');
    document.getElementById('modulPlaceholderLastname').textContent = "Отчество";

    document.querySelector('#modulClients').innerHTML = 'ID:' + clientObj.id.slice(-5);
    document.querySelector('#modulInputSurname').value = clientObj.surname;
    document.querySelector('#modulInputName').value = clientObj.name;
    document.querySelector('#modulInputLastname').value = clientObj.lastName;

    let titleContacts = document.createElement('h3');
    let contactClientList = document.createElement('ul');
    let contactsContainer = document.getElementById('modulContacts');

    contactClientList.classList.add('contacts__list');

    titleContacts.textContent = 'Контакты клиента';

    contactsContainer.append(titleContacts, contactClientList);

    for(let i = 0; i < clientObj.contacts.length; i++) {
        let arrContactValue = Object.values(clientObj.contacts[i]);
        let clientContact = document.createElement('li');
        let clientContactType = document.createElement('span');
        let clientContactValue = document.createElement('a');
        let href = 'https://' + arrContactValue[1];
        clientContactValue.href = href;

        clientContact.classList.add('contacts-list__item', 'flex');
        clientContactType.classList.add('contact__type');
        clientContactValue.classList.add('contact__value');

        if(arrContactValue[0] == 'Телефон') {
            href = 'tel:' + arrContactValue[1];
            clientContactValue.href = href;
        }
        if(arrContactValue[0] == 'Email') {
            href = 'mailto:' + arrContactValue[1];
            clientContactValue.href = href;
        }

        clientContactType.textContent = arrContactValue[0];
        clientContactValue.textContent = arrContactValue[1];

        contactClientList.append(clientContact);
        clientContact.append(clientContactType, clientContactValue);
    }
}

createModulClient(postData)