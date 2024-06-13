
//documentload

document.addEventListener('DOMContentLoaded', function(){
    setButtonsState();
    updateTableInfo();

    var popupData = document.querySelector('#popoverContent').innerHTML;
    document.querySelector('#popoverContent').remove();

    const popover = new bootstrap.Popover(document.querySelector('#filterPopover'), {
        container: 'body',
        html: true,
        placement: 'bottom',
        sanitize: false,
        content() {
            var content = popupData;
            return content
        }
    });

    $('#filterPopover').on('shown.bs.popover', function(){
        setFilterList();
        setFilterValueInput();
    });
});

//MÁSCARAS
function setModalFieldsMask(cpf, phone, cep){
    //using IMASK.JS
    var cpfMask = IMask(document.getElementById('customerCPF'), {
        mask: '000.000.000-00'
    });

    var phoneMask = IMask(document.getElementById('customerPhone'), {
        mask: '(00) 90000-0000'
    });

    var cepMask = IMask(document.getElementById('customerCEP'), {
        mask: '00000-000'
    });

    cpfMask.value = cpf;
    phoneMask.value = phone;
    cepMask.value = cep;
}

function getModalFieldsMask(){
    var cpfMask = IMask(document.getElementById('customerCPF'), {
        mask: '000.000.000-00'
    });

    var phoneMask = IMask(document.getElementById('customerPhone'), {
        mask: '(00) 90000-0000'
    });

    var cepMask = IMask(document.getElementById('customerCEP'), {
        mask: '00000-000'
    });

    return {cpf: cpfMask.unmaskedValue, phone: phoneMask.unmaskedValue, cep: cepMask.unmaskedValue};
}

function setButtonsState()
{
    if(selectedRows.length == 0){
        $('#editBtn').prop('disabled', true);
        $('#removeBtn').prop('disabled', true);
    }
    else if(selectedRows.length == 1){
        $('#editBtn').prop('disabled', false);
        $('#removeBtn').prop('disabled', false);
    }
    else if(selectedRows.length > 1){
        $('#editBtn').prop('disabled', true);
        $('#removeBtn').prop('disabled', false);
    }

}

//MODAL ADICIONAR/EDITAR
function openDataScreen(type){
    $('#customerModal').modal('show');
    $('#filterPopover').popover('hide');

    setModalButtonsState(type);

    if(type == 'add'){
        $('#modalTitle').text('Dados do Cliente');
        clearCustomerModal();
    }
    if(type == 'edit'){
        updateCustomerModal();
    }
}

function setModalButtonsState(type){
    switch(type){
        case 'add':
            $('#createCustomer').prop('hidden', false);
            $('#saveChanges').prop('hidden', true);
            break;
        case 'edit':
            $('#createCustomer').prop('hidden', true);
            $('#saveChanges').prop('hidden', false);
            break;
    }
}

function clearCustomerModal(){
    var masks = setModalFieldsMask('', '', '');

    $('#customerID').val('');
    $('#customerName').val('');
    $('#customerCPF').val('');
    $('#customerPhone').val('');
    $('#customerEmail').val('');
    $('#customerCEP').val('');
    $('#customerBairro').val('');
    $('#customerCidade').val('');
    $('#customerEstado').val('');
    $('#customerRua').val('');
    $('#customerNumero').val('');
    $('#customerComplemento').val('');
}

//MODAL EXCLUIR
function openRemoveModal(){
    $('#removeModal').modal('show');
    $('#filterPopover').popover('hide');
}

//PESQUISAR CEP E LIMPAR CAMPOS DE ENDEREÇO
function searchCEP(value){
    var cep = value.replace(/\D/g, '');

    console.log(cep);

    if(cep.length != 8){
        alert('CEP inválido')
        clearAddressFields();
        return;
    }

    var url = 'https://viacep.com.br/ws/' + cep + '/json/';

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.erro){
            alert('CEP não encontrado');
            clearAddressFields();
            return;
        }

        $('#customerBairro').val(data.bairro);
        $('#customerCidade').val(data.localidade);
        $('#customerEstado').val(data.uf);
        $('#customerRua').val(data.logradouro);
    })
}

function clearAddressFields(){
    $('#customerBairro').val('');
    $('#customerCidade').val('');
    $('#customerEstado').val('');
    $('#customerRua').val('');
}

//LÓGICA DOS FILTROS
const filters = [];
function addFilter()
{
    var filterValue = '';

    //definir valor do filtro
    if ($('#filterType').val() == 'cpf') {
        filterValue = getFilterValueInputMask().cpf;
    }
    else if ($('#filterType').val() == 'telefone')
    {
        filterValue = getFilterValueInputMask().phone;
    }
    else if ($('#filterType').val() == 'cep')
    {
        filterValue = getFilterValueInputMask().cep;
    }
    else
    {
        filterValue = $('#filterValueEmail').val();
    }

    if ($('#filterType').val() == null) {
        alert('Selecione um tipo de filtro');
        return;
    }

    //validar campos
    if (filterValue == undefined || filterValue == '') {
        alert('Preencha o campo de valor');
        return;
    }

    var filter = {
        id: filters.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: filterValue
    }

    if (filters.find(f => f.type == filter.type && f.value == filter.value)) {
        alert("Filtro já adicionado");
        return;
    }

    filters.push(filter);

    setFilterList();
}

function setFilterList()
{  
    var obj = document.querySelector('.filterList');
    obj.innerHTML = '';


    filters.forEach(filter =>{

        var operator = "a";
        if (filter.operator == "diferente") {
            operator = "de";
        }

        var html = ` 
            <ul class="list-group">
                    <li class="list-group-item">
                        ${filter.type.toUpperCase()} ${filter.operator} ${operator} ${filter.value.toUpperCase()}
                        <button type="button" class="btn btn-danger" id="removeFilterBtn" onclick="removeFilter(${filter.id})"><i class="fas fa-times"></i></button>
                    </li>
            </ul>
        `;

        obj.innerHTML += html;
    });
}

function setFilterValueInput()
{
    //hide all filter values
    $('#filterValueCPF').prop('hidden', true);
    $('#filterValueEmail').prop('hidden', true);
    $('#filterValueTelefone').prop('hidden', true);
    $('#filterValueCEP').prop('hidden', true);

    //limpar valores
    $('#filterValueCPF').val(getFilterValueInputMask().cpf);
    $('#filterValueEmail').val('');
    $('#filterValueTelefone').val('');
    $('#filterValueCEP').val('');

    setFilterValueInputMask('', '', '');

    $('#filterValueEmail').prop('readonly', false);

    var selectedType = $('#filterType');

    if (selectedType.val() == null)
    {
        $('#filterValueCPF').prop('hidden', false);
        $('#filterValueEmail').prop('readonly', true);
        return;
    }

    var obj = 'filterValue' + selectedType.find(':selected').text();
    $('#' + obj).prop('hidden', false);
}

function setFilterValueInputMask(cpf, phone, cep)
{
    var cpfMask = IMask(document.getElementById('filterValueCPF'), {
        mask: '000.000.000-00'
    });

    var phoneMask = IMask(document.getElementById('filterValueTelefone'), {
        mask: '(00) 90000-0000'
    });

    var cepMask = IMask(document.getElementById('filterValueCEP'), {
        mask: '00000-000'
    });

    cpfMask.value = cpf;
    phoneMask.value = phone;
    cepMask.value = cep;
}

function getFilterValueInputMask()
{
    var cpfMask = IMask(document.getElementById('filterValueCPF'), {
        mask: '000.000.000-00'
    });

    var phoneMask = IMask(document.getElementById('filterValueTelefone'), {
        mask: '(00) 90000-0000'
    });

    var cepMask = IMask(document.getElementById('filterValueCEP'), {
        mask: '00000-000'
    });

    return {cpf: cpfMask.unmaskedValue, phone: phoneMask.unmaskedValue, cep: cepMask.unmaskedValue};
}

function removeFilter(id)
{
    filters.splice(filters.findIndex(f => f.id == id), 1);
    setFilterList();
}

function clearFilters()
{
    filters.splice(0, filters.length);
    setFilterList();
}

//DATABASE
function updateTableInfo()
{
    fetch('http://localhost/autoparts-web/application/backend/requests/customer/getCustomerTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.message);
            return;
        }
        
        var searchBar = document.querySelector('#searchBarInput').value;
        var filteredData = data;

        if (searchBar != '' || filters.length > 0) {
            filteredData = [];
        }

        if (searchBar != '')
        {
            data.forEach(row => {
                for (var key in row) {
                    if (row[key].toString().toLowerCase().includes(searchBar.toLowerCase())) {
                        filteredData.push(row);
                        break;
                    }
                }
            });
        }

        //getFilters
        if (filters.length > 0)
        {
            data.forEach(row => {
                var valid = true;

                filters.forEach(filter => {
                    if (filter.operator == 'igual') {
                        if (row[filter.type] != filter.value) {
                            valid = false;
                        }
                    }
                    if (filter.operator == 'diferente') {
                        if (row[filter.type] == filter.value) {
                            valid = false;
                        }
                    }
                });

                if (valid) {
                    filteredData.push(row);
                }
            });
        }

        var tableObj = document.querySelector('#tableInfo');

        //clear table
        tableObj.innerHTML = '';

        filteredData.forEach(row => {

            //colocar máscaara no cpf
            var cpf = row.cpf.replace(/(\d)(\d{8})$/,"$1.$2").replace(/(\d)(\d{5})$/,"$1.$2").replace(/(\d)(\d{2})$/,"$1-$2");
            var phone = row.telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) 9$2-$3");
            var endereço = row.rua + ', ' + row.numero + ' - ' + row.bairro + ', ' + row.cidade + ' - ' + row.estado;


            var html = `
                <tr class="selectedRow" ondblclick="openDataScreen('edit')" onclick="selectRow(this, 'single'); setButtonsState();">
                    <td><input class="selectCheck" type="checkbox" onclick="selectRow(this.closest('tr'), 'multi'); event.stopPropagation(); setButtonsState();"></td>
                    <td>${row.ID}</td>
                    <td>${row.nome}</td>
                    <td>${cpf}</td>
                    <td>${phone}</td>
                    <td>${row.email}</td>
                    <td>${endereço}</td>
                </tr>
            `;

            tableObj.innerHTML += html;
        });
    })
}

function updateCustomerModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');

    var id = $(cells[1]).text();
    
    fetch('http://localhost/autoparts-web/application/backend/requests/customer/getCustomer.php?id=' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.message);
            return;
        }

        var customer = data;

        $('#modalTitle').text('Dados do Cliente: ' + customer.ID + ' - ' + customer.nome);

        setModalFieldsMask(customer.cpf, customer.telefone, customer.cep);

        $('#customerID').val(customer.ID);
        $('#customerName').val(customer.nome);
        $('#customerEmail').val(customer.email);
        $('#customerBairro').val(customer.bairro);
        $('#customerCidade').val(customer.cidade);
        $('#customerEstado').val(customer.estado);
        $('#customerRua').val(customer.rua);
        $('#customerNumero').val(customer.numero);
        $('#customerComplemento').val(customer.complemento);
    });
}

function addNewCustomer()
{
    var customer = {
        nome: $('#customerName').val(),
        cpf: getModalFieldsMask().cpf,
        telefone: getModalFieldsMask().phone,
        email: $('#customerEmail').val(),
        cep: getModalFieldsMask().cep,
        bairro: $('#customerBairro').val(),
        cidade: $('#customerCidade').val(),
        estado: $('#customerEstado').val(),
        rua: $('#customerRua').val(),
        numero: $('#customerNumero').val(),
        complemento: $('#customerComplemento').val()
    }

    if (!validateFields(customer)) {
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/customer/createCustomer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#customerModal').modal('hide');
        updateTableInfo();

        clearSelection();
        setButtonsState();
    });
}

function editCustomer()
{
    var customer = {
        ID: $('#customerID').val(),
        nome: $('#customerName').val(),
        cpf: getModalFieldsMask().cpf,
        telefone: getModalFieldsMask().phone,
        email: $('#customerEmail').val(),
        cep: getModalFieldsMask().cep,
        bairro: $('#customerBairro').val(),
        cidade: $('#customerCidade').val(),
        estado: $('#customerEstado').val(),
        rua: $('#customerRua').val(),
        numero: $('#customerNumero').val(),
        complemento: $('#customerComplemento').val()
    }

    if (!validateFields(customer)) {
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/customer/updateCustomer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#customerModal').modal('hide');
        updateTableInfo();

        clearSelection();
        setButtonsState();
    });
}

function deleteCustomer()
{
    var ids = selectedRows.map(row => {
        return $(row).find('td')[1].innerText;
    });

    fetch('http://localhost/autoparts-web/application/backend/requests/customer/deleteCustomer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#removeModal').modal('hide');
        updateTableInfo();

        clearSelection();
        setButtonsState();
    });

}

//VALIDAÇÃO DE CAMPOS

function validateFields(customer)
{
    if (customer.nome == '' || customer.cpf == '' || customer.telefone == '' || customer.email == '' || customer.cep == '' || customer.bairro == '' || customer.cidade == '' || customer.estado == '' || customer.rua == '' || customer.numero == '') {
        alert('Preencha todos os campos');
        return false;
    }

    //validar cpf
    if (!validateCPF(customer.cpf)) {
        alert('CPF inválido');
        return false;
    }

    //validar email
    if (!validateEmail(customer.email)) {
        alert('Email inválido');
        return false;
    }

    //validar cep
    if (!validateCEP(customer.cep)) {
        alert('CEP inválido');
        return false;
    }

    //validar telefone
    if (!validatePhone(customer.telefone)) {
        alert('Telefone inválido');
        return false;
    }

    return true;
}

function validateCPF(cpf)
{
    if (cpf == "00000000000") return false;
    if (cpf.length != 11) return false;

    var soma = 0;
    var resto;

    for (i = 1; i <= 9; i++) {
        soma = soma + (parseInt(cpf.substring(i - 1, i)) * (11 - i));
    }

    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;

    if (resto != parseInt(cpf.substring(9, 10)))
        return false;

    soma = 0;
    for (i = 1; i <= 10; i++) {
        soma = soma + (parseInt(cpf.substring(i - 1, i)) * (12 - i))
    };

    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;

    if (resto != parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateCEP(value)
{
    var cep = value.replace(/\D/g, '');

    if(cep.length != 8){
        return false;
    }

    return true;
}

function validatePhone(phone)
{
    //validar telefone sem o uso do nove. Exemplo: 1112345678
    if (phone.length == 10) {
        var phoneRegex = /^(?:\d{10}|\d{11})$/;
        return phoneRegex.test(phone);
    }

    return false;
}