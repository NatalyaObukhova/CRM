const SERVER__URL = `http://localhost:3000`;
preloader(document.getElementById('tbody')); 
let massege 
let resultDelete = false;
let a

let arrErr = [];
for(let i = 0; i < 100; i++) {
    arrErr.push(500 + i)
}
arrErr.push('404')
arrErr.push('422')

async function serverAddClients(obj) {
    let response = await fetch(SERVER__URL + `/api/clients`, {
        method:'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(obj),
    })

    if((response.status == '200') || (response.status == '201')) {
    } else if(response.status) {
        for(const number of arrErr) {
            if(response.status == number) {
                document.getElementById('modulErrorText').textContent = response.statusText;
            } else{document.getElementById('modulErrorText').textContent = "Что-то пошло не так..."};  
        }
    }
    massege = response.status;

    let data = await response.json();

    return data
}

async function serverPatchClients(obj, id) {
    let response = await fetch(SERVER__URL + `/api/clients/` + id, {
        method:'PATCH',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(obj),
    })

    let data = await response.json();

    return data
}

async function serverGetClients() {
    let response = await fetch(SERVER__URL + `/api/clients`, {
        method:'GET',
        headers: {'Content-Type' : 'application/json'},
    })

    let data = await response.json();

    return data
}

let serverData = await serverGetClients();

async function serverDeleteClients(id) {
    let response = await fetch(SERVER__URL + `/api/clients/` + id, {
        method:'DELETE',
    })

    if((response.status == '200') || (response.status == '201')) {
        resultDelete = true;
    } 

    if(resultDelete == false) {
        document.querySelector('.error-text').classList.add('error-text__visible')
    }

    let data = await response.json();

    return data
    
}

let clientsList = [];

if(serverData) {
    clientsList = serverData;
}

function getDateFormat(prop) {
    let date = new Date(prop)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (year < 10) {year = '0' + year;}
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}

    return (year + '.' + month + '.' + day);
}

function getTimeFormat(prop) {
    let date = new Date(prop)
    let hour = date.getHours();
    let minite = date.getMinutes();

    if (hour < 10) {hour = '0' + hour;}
    if (minite < 10) {minite = '0' + minite;}

    return (hour + ':' + minite)
}

document.getElementById('headerLogoBtn').addEventListener('click', function() {
    this.nextElementSibling.classList.add('header__input--active');
    this.classList.add('header__logo--active')
})

function renderTableClients(clients) {
    for (const client of clients) {
        renderTrClient(client);
    }
}

function validation(form) {
    let result = true;

    const allInputs = form.querySelectorAll('input');
    const errorText = form.querySelector('#modulErrorText');
    
    for(const input of allInputs) {
        input.onfocus = function() {
            input.parentNode.classList.remove('error__contact');
            if (this.classList.contains('modul__label--error')) {
                this.classList.remove('modul__label--error');
                this.nextElementSibling.remove();
            }
        };

        if(input.dataset.required == 'true') {
            if(input.value == '') {
                let errorMessage = document.createElement('span');
                let errorOnInput = input.parentNode;
                errorMessage.classList.add('modul__input--error');
                errorOnInput.append(errorMessage);
                input.classList.add('modul__label--error');
                errorText.textContent = "Не все поля заполнены";
                result = false;
            }
        } 
        let selects = document.querySelectorAll('.choices__list--single');
        let inputs = document.querySelectorAll('#contactInput');

        for (const inputContact of inputs) {
            if(inputContact.previousSibling.querySelector('option').value == "Телефон") {
                if(inputContact.value.length != 16) {
                    inputContact.parentNode.classList.add('error__contact');
                    result = false
                }
            }
            if((inputContact.previousSibling.querySelector('option').value == "Facebook") || (inputContact.previousSibling.querySelector('option').value == "VK")) {
                if(!inputContact.value.includes(".com")) {
                    if(!inputContact.value.includes(".ru")) {
                        inputContact.parentNode.classList.add('error__contact');
                        result = false
                    }
                }
            }
        } 
    }
    return result
}

const sortArr = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] :  a[prop] > b[prop]) ? -1 : 1);

function filterTable() {
    document.getElementById('idClient').checked = true;
    sortArr(clientsList, 'id', true);
    renderTableClients(clientsList);
    document.getElementById('idClient').onclick = function toggleCheckbox(element) {
        if(document.getElementById('idClient').checked) {
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'id', true);
            renderTableClients(clientsList);
        }else{
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'id', false);
            renderTableClients(clientsList);
        }
    }

    document.getElementById('fioClient').onclick = function toggleCheckbox(element) {
        if(document.getElementById('fioClient').checked) {
            document.querySelector('.table__check-span').textContent = '';
            document.getElementById('tbody').innerHTML = '';
            document.querySelector('.table__check-span').textContent = 'А-Я';
            sortArr(clientsList, 'name', true);
            renderTableClients(clientsList);
        }else{
            document.querySelector('.table__check-span').textContent = '';
            document.getElementById('tbody').innerHTML = '';
            document.querySelector('.table__check-span').textContent = 'Я-А';
            sortArr(clientsList, 'name', false);
            renderTableClients(clientsList);
        }
    }

    document.getElementById('DateAddClient').onclick = function toggleCheckbox(element) {
        if(document.getElementById('DateAddClient').checked) {
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'createdAt', true);
            renderTableClients(clientsList);
        }else{
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'createdAt', false);
            renderTableClients(clientsList);
        }
    }

    document.getElementById('lastChangeClient').onclick = function toggleCheckbox(element) {
        if(document.getElementById('lastChangeClient').checked) {
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'updatedAt', true);
            renderTableClients(clientsList);
        }else{
            document.getElementById('tbody').innerHTML = '';
            sortArr(clientsList, 'updatedAt', false);
            renderTableClients(clientsList);
        }
    }
}

filterTable();

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
    let $modulContactsBtn = document.createElement('button');
    let $modulErrorText = document.createElement('div');
    let $modulContactsBtnSave = document.createElement('button');
    let $modulContactsBtnDelete = document.createElement('button');
    let $modulContactsBtnCancel = document.createElement('button');

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
    $modulContactsBtn.classList.add('btn', 'contact__btn');
    $modulErrorText.classList.add('modul__error--text');
    $modulContactsBtnSave.classList.add('btn', 'modul__save');
    $modulContactsBtnDelete.classList.add('btn', 'modul__cancel', 'btn__hidden');
    $modulContactsBtnCancel.classList.add('btn', 'modul__cancel', 'btn__hidden');

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
    $modulContactsBtn.setAttribute('id', 'modulAddContacts');
    $modulErrorText.setAttribute('id', 'modulErrorText');
    $modulContactsBtnSave.setAttribute('id', 'modulBtnSave');
    $modulContactsBtnDelete.setAttribute('id', 'modulBtnDelete');
    $modulContactsBtnCancel.setAttribute('id', 'modulBtnCancel');

    $modulContactsBtn.textContent = 'Добавить контакт';
    $modulContactsBtnSave.textContent = 'Сохранить';
    $modulPlaceholdLast.placeholder = '';

    document.getElementById('modul').append($modulBox);
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
    $modulContacts.append($modulContactsBtn);
    $modulForm.append($modulErrorText);
    $modulForm.append($modulContactsBtnSave);
    $modulForm.append($modulContactsBtnDelete);
    $modulForm.append($modulContactsBtnCancel);

    document.getElementById('btnModulClose').addEventListener('click', function() {
        modulRemove()
        document.getElementById('modul').classList.remove('open');
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            modulRemove()
            document.getElementById('modul').classList.add('open');
        }
    });
    
    document.querySelector('#modul .modul__box').addEventListener('click', event => {
        event._isClickWithInModal = true;
    });
    
    document.getElementById ('modul').addEventListener('click', event => {
        if(event._isClickWithInModal) return;
        modulRemove();
        event.currentTarget.classList.remove('open');
    });
    
    document.getElementById('modulAddContacts').addEventListener('click', function(e) {
        e.preventDefault();
        let keys = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'];
        let $contactsItem = document.createElement('div');
        let $typeContactList = document.createElement('select');
        let $contactsValueInput = document.createElement('input');
        let $clearValueBtn = document.createElement('button');
    
        $typeContactList.classList.add('flex');
        $contactsItem.classList.add('flex', 'contact__item')
        $clearValueBtn.classList.add('clear__btn');
        $contactsValueInput.setAttribute('id', 'contactInput');
        $contactsValueInput.placeholder = 'Введите данные контакта'
        document.querySelector('#modulContacts').classList.add('contacts__block--active');
    
        document.querySelector('#modulContacts').append($contactsItem);
        $contactsItem.append($typeContactList)
    
        for (const key of keys) {
            let $typeContactsElem = document.createElement('option');
            $typeContactList.append($typeContactsElem);
            $typeContactsElem.textContent = key;
        }
    
        const example = new Choices($typeContactList, {
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: true,
        });

        let select = document.querySelector('.choices__input');

        $contactsItem.append($contactsValueInput);

        if(document.querySelectorAll('.contact__item').length == '10') {
            document.getElementById('modulAddContacts').remove()
        }

        $contactsValueInput.oninput = function() {
            if(document.querySelector('#contactInput').value != '') {
                $contactsItem.append($clearValueBtn);
            }
        };
    
        $clearValueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            $contactsItem.remove();
        })
    });
}

function renderTrClient(clientObj) {
    let keysClient =[];
    let values = [];
    let idShort = clientObj.id.slice(-5);
    let $tbody = document.getElementById('tbody');
    let $tr = document.createElement('tr');
    let $tdIndex = document.createElement('td');
    let $tdFio = document.createElement('td');
    let $fiolink = document.createElement('a');
    let $surname = document.createElement('span');
    let $name = document.createElement('span');
    let $lastName = document.createElement('span');
    let $tdAddDateFull = document.createElement('td');
    let $fulldateAdd = document.createElement('div');
    let $tdAddDate = document.createElement('span');
    let $tdAddDateTime = document.createElement('span');
    let $tdCreateFull = document.createElement('td');
    let $fulldateCreate = document.createElement('div');
    let $tdCreate = document.createElement('span');
    let $tdCreateTime = document.createElement('span');
    let $tdContacts = document.createElement('td');
    let $tdButtons = document.createElement('td');
    let $tdChangeBtn = document.createElement('button');
    let $tdRemoveBtn = document.createElement('button');

    $tr.classList.add('tr');
    $tdFio.classList.add('td', 'td__name');
    $fiolink.classList.add('table__link', 'link__reset', 'flex');
    $surname.classList.add('table-date__span');
    $name.classList.add('table-date__span');
    $lastName.classList.add('table-date__span');
    $fulldateAdd.classList.add('fulldate', 'flex');
    $tdAddDate.classList.add('table-date__span');
    $tdAddDateTime.classList.add('span__time');
    $fulldateCreate.classList.add('fulldate', 'flex');
    $tdCreate.classList.add('table-date__span');
    $tdCreateTime.classList.add('span__time');
    $tdContacts.classList.add('td__contacts');
    $tdChangeBtn.classList.add('btn', 'btn__change');
    $tdRemoveBtn.classList.add('btn', 'btn__delete');

    $tr.setAttribute('id', clientObj.id);
    $tdIndex.textContent = idShort;
    $fiolink.href = 'clientLink.html?post_id=' + clientObj.id;
    $surname.textContent = clientObj.surname;
    $name.textContent = clientObj.name;
    $lastName.textContent = clientObj.lastName;
    $tdAddDate.textContent = getDateFormat(clientObj.createdAt);
    $tdAddDateTime.textContent = getTimeFormat(clientObj.createdAt);
    $tdCreate.textContent = getDateFormat(clientObj.updatedAt);
    $tdCreateTime.textContent = getTimeFormat(clientObj.updatedAt);
    $tdContacts.textContent = '';
    $tdChangeBtn.textContent = 'Изменить';
    $tdRemoveBtn.textContent = 'Удалить';

    $tdRemoveBtn.addEventListener('click', function() {
            modulDeleteClient(clientObj.id);
            if(resultDelete == true) {
                document.getElementById('modul').classList.remove('open');
                document.getElementById('modul').innerHTML = '';
            }
    });

    function getContactsClient(clientObj) {
        for (const item of clientObj.contacts) {
            keysClient.push(item.type);
            values.push(item.value);
        }
        return keysClient, values
    }
    getContactsClient(clientObj);

    function sortAndAddContacts(keysClient) {
        let i = 0;
        for (const item of keysClient) {
            let contact = document.createElement('button');
            contact.setAttribute('data-tippy-content', keysClient[i] + ' : ' + values[i]);

            if(item == 'VK') {
                contact.classList.add('contact--vk', 'contact__block', 'btn');
            }
            if(item == 'Facebook') {
                contact.classList.add('contact--fb', 'contact__block', 'btn')
            }
            if(item == 'Телефон') {
                contact.classList.add('contact--phone', 'contact__block', 'btn')
            }
            if(item == 'Email') {
                contact.classList.add('contact--email', 'contact__block', 'btn')
            }
            if(item == 'Другое') {
                contact.classList.add('contact--other', 'contact__block', 'btn')
            }

            $tdContacts.append(contact);
            i++
        }
    }

    function getHiddenContacts(keysClient) {
        if(keysClient.length > 5) {
            $tdContacts.innerHTML = '';
            sortAndAddContacts(keysClient.slice([0], [4]));
            let btnHiddenContacts = document.createElement('button');
            btnHiddenContacts.classList.add('contacts__btn--hidden');
            let count = keysClient.length - 4;
            btnHiddenContacts.textContent = '+' + count;
            $tdContacts.append(btnHiddenContacts);

            btnHiddenContacts.addEventListener('click', function() {
                $tdContacts.innerHTML = '';
                sortAndAddContacts(keysClient);
            })
        }
    }

    sortAndAddContacts(keysClient)
    getHiddenContacts(keysClient)

    $tdChangeBtn.addEventListener('click', async function() {
        preloader(this);
        createModul();
        let arrContactsDataKey = [];
        let arrContactsDataValue = [];
        document.getElementById('modulTitle').textContent = "Изменить данные";
        document.getElementById('modulPlaceholderSurname').classList.add('modul__placeholder', 'add_client__surname--empty-input', 'modul__placeholder--small');
        document.getElementById('modulPlaceholderName').classList.add('modul__placeholder','add_client__name--empty-input', 'modul__placeholder--small');
        document.getElementById('modulPlaceholderLastname').classList.add('modul__placeholder', 'modul__placeholder--small', 'add-client__lastname--empty-input');
        document.getElementById('modulPlaceholderLastname').classList.remove('none');
        document.getElementById('modulPlaceholderLastname').textContent = "Отчество";
        document.getElementById('modulBtnDelete').classList.remove('btn__hidden');

        document.querySelector('#modulClients').innerHTML = 'ID:' + clientObj.id.slice(-5);
        document.querySelector('#modulInputSurname').value = clientObj.surname;
        document.querySelector('#modulInputName').value = clientObj.name;
        document.querySelector('#modulInputLastname').value = clientObj.lastName;
        document.getElementById('modulBtnDelete').textContent = 'Удалить клиента';

        for(let i = 0; i < clientObj.contacts.length; i++) {
            let keys = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'];
                let $contactsItem = document.createElement('div');
                let $typeContactList = document.createElement('select');
                let $contactsValueInput = document.createElement('input');
                let $clearValueBtn = document.createElement('button');
                $typeContactList.classList.add('select__add');
                $contactsValueInput.setAttribute('id', 'contactInput')

                
                for (const key of keys) {
                    let $typeContactsElem = document.createElement('option');

                    $typeContactsElem.textContent = key;
                    $typeContactList.append($typeContactsElem); 
                    
                    if(key == keysClient[i]) {
                        let index = keys.indexOf(key);
                        $typeContactList.selectedIndex = index;
                    } 
                }

                $clearValueBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    $contactsValueInput.value = '';
                    $contactsItem.remove();
                })

                $typeContactList.classList.add('flex');
                $clearValueBtn.classList.add('clear__btn');
                $contactsItem.classList.add('flex', 'contact__item');
                document.querySelector('#modulContacts').classList.add('contacts__block', 'contacts__block--active');
            
                document.querySelector('#modulContacts').append($contactsItem);
                $contactsItem.append($typeContactList);

                const cont = new Choices($typeContactList, {
                    searchEnabled: false,
                    itemSelectText: '',
                    allowHTML: true,
                });

                $contactsValueInput.value = values[i];
                $contactsItem.append($contactsValueInput);

                for (const input of document.querySelectorAll('#contactInput')) {
                    if(input.value != '') {
                        $contactsItem.append($clearValueBtn);
                    }
                }
        }

        document.getElementById('modulAddContacts').addEventListener('click', function() {

            let inputs = document.querySelectorAll('#contactInput');
    
            for (const input of inputs) {
    
                input.onfocus = function() {
    
                    if(this.previousSibling.querySelector('option').value == "Телефон") {
                        const maskOptions = {
                            mask: '+{7}(000)000-00-00'
                        };
                        const mask = IMask(input, maskOptions);
                    }
                }
            }
    
        })

        document.getElementById('modulBtnSave').addEventListener('click', async function() {

            function createContactsObj(arrKey, arrVal) {
                for(let i = 0; i < document.querySelectorAll('#contactInput').length; i++) {
                    let elem = document.querySelectorAll('#contactInput')[i];
                    let item = document.querySelectorAll('.is-selected')[i];
                    if(elem.value != '') {
                        arrContactsDataKey.push(item.getAttribute('data-value'));
                        arrContactsDataValue.push(elem.value);
                    }
                }

                for(let i = 0; i < arrKey.length; i++) {
                    let obj = {
                        type: arrKey[i],
                        value: arrVal[i],
                    }
                    ClientObj.contacts.push(obj);
                }    
            }

            let ClientObj = {
                name: document.getElementById('modulInputName').value,
                surname: document.getElementById('modulInputSurname').value,
                lastName: document.getElementById('modulInputLastname').value,
                contacts: [],
            }
    
            createContactsObj(arrContactsDataKey, arrContactsDataValue);

            let serverDataObj = await serverPatchClients(ClientObj, clientObj.id)

            document.getElementById('tbody').innerHTML = '';
            renderTableClients(clientsList);
        })

        document.getElementById('modulBtnDelete').addEventListener('click', function() {
            modulDeleteClient(clientObj.id);
            if(resultDelete == true) {
                document.getElementById('modul').classList.remove('open');
                document.getElementById('modul').innerHTML = '';
            }
        });

        document.getElementById('modul').classList.add('open');

        if(document.getElementById('modul').classList.contains('open')){
            document.querySelector('.mask').classList.add('hide');
            setTimeout(() => {
                $tdChangeBtn.classList.remove('container__mask');
                document.querySelector('.mask').remove();
            }, 700)
        };
    })

    $tbody.append($tr);
    $tr.append($tdIndex);
    $tr.append($tdFio);
    $tdFio.append($fiolink);
    $fiolink.append($surname);
    $fiolink.append($name);
    $fiolink.append($lastName);
    $tr.append($tdAddDateFull);
    $tdAddDateFull.append($fulldateAdd);
    $fulldateAdd.append($tdAddDate);
    $fulldateAdd.append($tdAddDateTime);
    $tr.append($tdCreateFull);
    $tdCreateFull.append($fulldateCreate);
    $fulldateCreate.append($tdCreate);
    $fulldateCreate.append($tdCreateTime);
    $tr.append($tdContacts);
    $tr.append($tdButtons);
    $tdButtons.append($tdChangeBtn);
    $tdButtons.append($tdRemoveBtn);
    
    return keysClient,
    values,
    $tbody
}

document.getElementById('btnAddClient').addEventListener('click', function(e) {
    e.preventDefault();

    createModul();

    let arrContactsDataKey = [];
    let arrContactsDataValue = [];

    document.getElementById('modulTitle').textContent = "Новый клиент";
    document.getElementById('modulPlaceholderSurname').classList.add('add_client__surname--empty-input', 'modul__placeholder');
    document.getElementById('modulPlaceholderName').classList.add('add_client__name--empty-input', 'modul__placeholder');
    document.getElementById('modulPlaceholderLastname').textContent = "Отчество";
    document.getElementById('modulPlaceholderLastname').classList.add('add-client__lastname--empty-input', 'modul__placeholder');
    document.getElementById('modulBtnCancel').classList.remove('btn__hidden');

    document.getElementById('modulBtnCancel').addEventListener('click', function() {
        document.getElementById('modul').classList.remove('open');
    })
    document.getElementById('modulBtnCancel').classList.add('btn', 'modul__cancel');
    document.getElementById('modulBtnCancel').textContent = 'Отмена';
    document.getElementById('modulForm').append(document.getElementById('modulBtnCancel'));

    document.querySelector('#modulInputSurname').onfocus = function() {
        document.getElementById('modulPlaceholderSurname').classList.remove('add_client__surname--empty-input');
    }

    document.querySelector('#modulInputName').onfocus = function() {
        document.getElementById('modulPlaceholderName').classList.remove('add_client__name--empty-input');
    }

    document.querySelector('#modulInputLastname').onfocus = function() {
        document.getElementById('modulPlaceholderLastname').textContent = '';
    }
    document.getElementById('modulAddContacts').addEventListener('click', function() {

        let inputs = document.querySelectorAll('#contactInput');

        for (const input of inputs) {

            input.onfocus = function() {

                if(this.previousSibling.querySelector('option').value == "Телефон") {
                    const maskOptions = {
                        mask: '+{7}(000)000-00-00'
                    };
                    const mask = IMask(input, maskOptions);
                }
            }
        }
    })


    document.getElementById('modulBtnSave').addEventListener('click', async function(e) {
        e.preventDefault();

        disabledInput(document.getElementsByClassName('modul__form'))

        function createContactsObj(arrKey, arrVal) {
            for(let i = 0; i < document.querySelectorAll('#contactInput').length; i++) {
                let elem = document.querySelectorAll('#contactInput')[i];
                let item = document.querySelectorAll('.is-selected')[i];
                if(elem.value != '') {
                    arrContactsDataKey.push(item.getAttribute('data-value'));
                    arrContactsDataValue.push(elem.value);
                }
            }

            for(let i = 0; i < arrKey.length; i++) {
                let obj = {
                    type: arrKey[i],
                    value: arrVal[i],
                }
                newClientObj.contacts.push(obj);
            }  
        }
        let newClientObj = {
            name: document.getElementById('modulInputName').value,
            surname: document.getElementById('modulInputSurname').value,
            lastName: document.getElementById('modulInputLastname').value,
            contacts: [],
        }

        createContactsObj(arrContactsDataKey, arrContactsDataValue);

        if(validation(document.getElementById('modulForm')) == true) {
            let serverDataObj = await serverAddClients(newClientObj);
            renderTrClient(serverDataObj);
            modulRemove()
        }else{
            deleteDisabledInput(document.getElementsByClassName('modul__form'))
        };
    })

    document.getElementById('modul').classList.add('open');
})

function modulRemove() {
    document.getElementById('modul').innerHTML = '';
    document.getElementById('modul').classList.remove('open');
}

let inner 

function modulDeleteClient(id) {
    document.getElementById('modul').classList.add('open')
    let $modulBox = document.createElement('div');
    let $moduldeleteHeader = document.createElement('div');
    let $modulEmptyBlock = document.createElement('div');
    let $modulDelHead = document.createElement('h2');
    let $modulDelBtnClose = document.createElement('button');
    let $modulDelPar = document.createElement('p');
    let $modulDelError = document.createElement('p');
    let $modulDelBtnDel = document.createElement('button');
    let $modulDelBtnCancel = document.createElement('button');

    $modulBox.classList.add('modul__box', 'flex');
    $moduldeleteHeader.classList.add('flex', 'modul__del-header');
    $modulEmptyBlock.classList.add('empty__block')
    $modulDelHead.classList.add('modul-del__header');
    $modulDelBtnClose.classList.add('modul__close', 'btn', 'modul-del__close');
    $modulDelPar.classList.add('modul__text');
    $modulDelError.classList.add('error-text');
    $modulDelBtnDel.classList.add('modul__save', 'btn');
    $modulDelBtnCancel.classList.add('modul__cancel', 'btn');

    $modulDelBtnClose.setAttribute('id', 'btnModulDelClose');

    $modulDelHead.innerHTML = 'Удалить клиента';
    $modulDelPar.innerHTML = 'Вы&nbsp;действительно хотите удалить данного клиента?';
    $modulDelError.innerText = 'Произошла ошибка при удалении попробуйте в следующий раз';
    $modulDelBtnDel.innerHTML = 'Удалить';
    $modulDelBtnCancel.innerHTML = 'Отмена';

    document.getElementById('modul').append($modulBox);
    $modulBox.append($moduldeleteHeader, $modulDelPar, $modulDelError, $modulDelBtnDel, $modulDelBtnCancel);
    $moduldeleteHeader.append($modulEmptyBlock, $modulDelHead, $modulDelBtnClose)

    document.getElementById('btnModulDelClose').addEventListener('click', function() {
        modulRemove()
        document.getElementById('modul').classList.remove('open');
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            modulRemove()
            document.getElementById('modul').classList.add('open');
        }
    });
    
    document.querySelector('#modul .modul__box').addEventListener('click', event => {
        event._isClickWithInModal = true;
    });
    
    document.getElementById ('modul').addEventListener('click', event => {
        if(event._isClickWithInModal) return;
        modulRemove();
        event.currentTarget.classList.remove('open');
    });

    $modulDelBtnDel.addEventListener('click', async function() {
        await serverDeleteClients(id);
        console.log(resultDelete)
    })



}
let fio = document.getElementById('fioClient');

tippy('[data-tippy-content]');


function preloader(container) {
    let $mask = document.createElement('div');
    let $loader = document.createElement('div');

    container.classList.add('container__mask');
    $mask.classList.add('mask');
    $loader.classList.add('loader');

    container.append($mask);
    $mask.append($loader);

    window.onload = function () {
        $mask.classList.add('hide');
        setTimeout(() => {
            container.classList.remove('container__mask');
            $mask.remove();
        }, 600)
    };

    return $mask 
}


function disabledInput(form) {
    for (const inputName of document.querySelectorAll('.modul__input')) {
        inputName.setAttribute('disabled', 'disabled');
        inputName.classList.add('input__disabled')
    }
    for (const input of document.querySelectorAll('#contactInput')) {
        input.setAttribute('disabled', 'disabled');
        input.classList.add('input__disabled')
    }
}

function deleteDisabledInput(form) {
    for (const inputName of document.querySelectorAll('.modul__input')) {
        inputName.removeAttribute('disabled', 'disabled');
        inputName.classList.remove('input__disabled')
    }
    for (const input of document.querySelectorAll('#contactInput')) {
        input.removeAttribute('disabled', 'disabled');
        input.classList.remove('input__disabled')
    }
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  document.getElementById('headerInput').oninput = debounce(() => searchInput());


function searchInput() {
    let listVisible = [];
    document.getElementById('headerSearch').innerHTML = '';
    document.getElementById('tbody').innerHTML = '';
    let arrValues = [];
    document.getElementById('headerSearch').classList.add('header__search--visible');
    for (const client of clientsList) {
        let clientItem = document.createElement('li');
        let clientItemLink = document.createElement('a');

        clientItem.setAttribute('id', 'search__item');
        clientItemLink.href = '#' + client.id;
        clientItemLink.innerHTML = client.name + '&nbsp;' + client.surname;

        document.getElementById('headerSearch').append(clientItem);
        clientItem.append(clientItemLink);

        arrValues.push(clientItemLink)
    }

    let valueSearch = document.getElementById('headerInput').value.trim();
    if(valueSearch != '') {
        arrValues.forEach(function(elem) {
            if(elem.innerText.search(valueSearch) == -1) {
                elem.parentElement.remove();
                elem.innerHTML = elem.innerText;
            }
            else {
                elem.classList.add('search-item__link');

                for (const client of clientsList) {
                    if(client.id == elem.href.slice(-13)) {
                        listVisible.push(client);
                    }
                }
                elem.addEventListener('keydown', function(e) {
                    if(e.key == 'ArrowDown') {
                        if(this.parentNode.nextSibling == null) {
                            this.blur();
                            document.querySelector('.search-item__link').focus();
                        }
                        else {
                            this.blur();
                            this.parentNode.nextSibling.firstElementChild.focus();
                        }
                    }

                    if(e.key == 'ArrowUp') {
                        if(this.parentNode.previousSibling == null) {
                            this.blur();
                            let elem = this;
                            for(let i = 0; i < 2; i++) {
                                elem = elem.parentElement;
                            }

                            elem.lastElementChild.firstElementChild.focus();
                            document.getElementById('headerSearch').lastChild.focus();
                        }
                        else {
                            this.blur();
                            this.parentNode.previousSibling.firstElementChild.focus();
                        }
                    }
                })
                let string = elem.innerText;
                elem.innerHTML = insertMark(string, elem.innerText.search(valueSearch), valueSearch.length);


            }

            if(document.querySelectorAll('#headerSearch li').length == '') {
                    
                    let $emptyBlock = document.createElement('li');
                    $emptyBlock.classList.add('empty');
                    $emptyBlock.textContent = "К сожалению ничего найти не удалось"
                    document.querySelector('#headerSearch').append($emptyBlock);
            }
            elem.addEventListener('click', function() {
                for (const tr of document.querySelectorAll('tbody tr')) {
                    tr.style.backgroundColor = '#FFFFFF';
                }

                for (let i = 0; i < listVisible.length; i++) {
             
                    if(listVisible[i].id == elem.attributes.href.value.slice(1)) {
                        document.querySelectorAll('tbody tr')[i].style.backgroundColor = '#7d8ccea3';
                        document.getElementById('headerSearch').innerHTML = '';
                        document.getElementById('headerSearch').classList.remove('header__search--visible');
                    }
                }
            })
        })
    }
    else {
        arrValues.forEach(function(elem) {
            // elem.parentElement.classList.remove('none');
            listVisible = clientsList;
            elem.innerHTML = elem.innerText;
        })
    }

    renderTableClients(listVisible) 
    let popup = document.querySelector('#headerSearch');
    document.addEventListener('click', (e) => {
        const popupOpened = e.composedPath().includes(popup);
        if(!popupOpened) {
            popup.innerHTML = '';
            popup.classList.remove('header__search--visible');
        }
    }) 
}

function insertMark(str, pos, length) {
    return str.slice(0, pos) + '<mark>' + str.slice(pos, pos + length) + '</mark>' + str.slice(pos + length);
}