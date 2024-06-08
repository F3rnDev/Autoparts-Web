//documentload
document.addEventListener('DOMContentLoaded', function(){
    setButtonsState();

    const popover = new bootstrap.Popover(document.querySelector('#filterPopover'), {
        container: 'body',
        html: true,
        placement: 'bottom',
        sanitize: false,
        content() {
            return document.querySelector('#popoverContent').innerHTML;
        }
    })

});

var selectedRows = [];

function selectRow(row, type)
{
    switch(type){
        case 'single':
            selectSingleRow(row);
            break;
        case 'multi':
            selectMultiRow(row);
            break;
    }

    if(selectedRows.length == $('.table tbody tr').length){
        $('#allRowsCheck').prop('checked', true);
    }
    else{
        $('#allRowsCheck').prop('checked', false);
    }

    setButtonsState();
}

function selectSingleRow(row)
{
    $(row).addClass('highlight').siblings().removeClass('highlight');
    $(row).siblings().find('.selectCheck').prop('checked', false);
    $(row).find('.selectCheck').prop('checked', true);

    selectedRows = [];
    selectedRows.push(row);

    setButtonsState();
}

function selectMultiRow(row)
{
    if($(row).hasClass('highlight'))
    {
        $(row).removeClass('highlight');
        selectedRows.splice(selectedRows.indexOf(row), 1);
        $(row).find('.selectCheck').prop('checked', false);
        return;
    }

    $(row).addClass('highlight');
    $(row).find('.selectCheck').prop('checked', true);
    selectedRows.push(row);

    setButtonsState();
}

function selectAllRows()
{
    var rows = $('.table tbody tr');
    
    if(selectedRows.length == rows.length)
    {
        rows.removeClass('highlight');
        rows.find('.selectCheck').prop('checked', false);
        $('#allRowsCheck').prop('checked', false);

        selectedRows = [];
        setButtonsState();
        return;
    }
    
    rows.addClass('highlight');
    rows.find('.selectCheck').prop('checked', true);
    $('#allRowsCheck').prop('checked', true);

    rows.each(function(){
        if(selectedRows.indexOf(this) == -1){
            selectedRows.push(this);
        }
    });

    setButtonsState();
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

function openDataScreen(type){
    $('#customerModal').modal('show');
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

//ATUALIZAR COM O BANCO DE DADOS USANDO O ID DO CLIENTE
function updateCustomerModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');

    var id = $(cells[1]).text();
    var name = $(cells[2]).text();

    $('#modalTitle').text('Dados do Cliente: ' + id + ' - ' + name);
}
