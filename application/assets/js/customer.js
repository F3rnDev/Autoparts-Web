
//documentload

document.addEventListener('DOMContentLoaded', function(){
    setButtonsState();

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
    });
});

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

//ATUALIZAR COM O BANCO DE DADOS USANDO O ID DO CLIENTE
function updateCustomerModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');

    var id = $(cells[1]).text();
    var name = $(cells[2]).text();

    $('#modalTitle').text('Dados do Cliente: ' + id + ' - ' + name);
}

//PESQUISAR CEP E LIMPAR CAMPOS DE ENDEREÇO
function searchCEP(value){
    var cep = value.replace(/\D/g, '');

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
    var filter = {
        id: filters.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: $('#filterValue').val()
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
