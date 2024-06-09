
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
