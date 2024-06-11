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

$(function() {
    $('.selectpicker').selectpicker();
});

function setButtonsState()
{
    if (selectedRows.length == 0)
    {
        $('#executeBtn').prop('disabled', true);
        $('#viewBtn').prop('disabled', true);
    }
    else if (selectedRows.length > 1)
    {
        $('#executeBtn').prop('disabled', true);
        $('#viewBtn').prop('disabled', true);
    }
    else if (selectedRows.length == 1)
    {
        $('#executeBtn').prop('disabled', false);
        $('#viewBtn').prop('disabled', false);
    }

    //checar coluna atual
    if ($(selectedRows[0]).closest('.kanbanColumn').attr('id') == 'progress' || selectedRows.length == 0)
    {
        $('#executeBtn').toggle(true);
        $('#viewBtn').toggle(false);
        $('#removeBtn').toggle(false);
    }
    else
    {
        $('#executeBtn').toggle(false);
        $('#viewBtn').toggle(true);
        $('#removeBtn').toggle(true);
    }
}

function openTicketModal(value)
{
    $('#ticketModal').modal('show');
    $('#filterPopover').popover('hide');

    setModalsBittonsState(value);

    if (value == 'add')
    {
        $('#modalTitle').text('Dados da OS');
        clearTicketModal();
    }
    else
    {
        updateTicketModal();
    }

    if (value == 'view')
    {
        setModalFields(true);
    }
    else
    {
        setModalFields(false);
    }

    setInsideTableBtns();
    clearInsideSelection();
}

function setModalsBittonsState(value)
{
    switch (value)
    {
        case 'add':
            $('#saveChanges').toggle(false);
            $('#executeOS').toggle(false);
            $('#cancelOS').toggle(false);
            $('#createOS').toggle(true);
            break;

        case 'execute':
            $('#saveChanges').toggle(true);
            $('#executeOS').toggle(true);
            $('#cancelOS').toggle(true);
            $('#createOS').toggle(false);
            break;

        case 'view':
            $('#saveChanges').toggle(false);
            $('#executeOS').toggle(false);
            $('#cancelOS').toggle(false);
            $('#createOS').toggle(false);
            break;
    }
}

function setModalFields(readonly)
{
    document.getElementById('selectCustomer').disabled = readonly;
    document.getElementById('selectEmployee').disabled = readonly;
    document.getElementById('selectProduct').disabled = readonly;
    $('.selectpicker').selectpicker('refresh')

    document.getElementById('qtdProd').readOnly = readonly;

    document.getElementById('serviceDescription').readOnly = readonly;

    document.getElementById('serviceValue').readOnly = readonly;

    $('.removeProduct').toggle(!readonly);
    $('.addProduct').toggle(!readonly);
    $('.editProduct').toggle(!readonly);
}

function updateTicketModal()
{
    var ticket = selectedRows[0];
    var ticketData = $(ticket).find('.kanbanCardTitle h5');

    $('#modalTitle').text('Dados da OS - ' + ticketData[0].innerText.split(' ')[1]);
}

function clearTicketModal()
{
    $('#ticketStatus').val('Em andamento');

    //pega data atual e seta no campo ticketDate
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    var today = yyyy + '-' + mm + '-' + dd;

    $('#ticketDate').val(today);

    document.getElementById('selectCustomer').value = '';
    document.getElementById('selectEmployee').value = '';
    document.getElementById('selectProduct').value = '';
    $('.selectpicker').selectpicker('refresh')

    document.getElementById('qtdProd').value = '1';

    document.getElementById('serviceDescription').value = '';

    document.getElementById('productValue').value = '';
    document.getElementById('serviceValue').value = '';
}

function openRemoveModal()
{
    $('#removeModal').modal('show');
}

var selectedInsideRows = [];
function selectInsideTableRow(row)
{
    if($(row).hasClass('highlight'))
    {
        $(row).removeClass('highlight');
        selectedInsideRows.splice(selectedInsideRows.indexOf(row), 1);
        setInsideTableBtns();
        changeProductValues();
        return;
    }

    //check siblings
    var siblings = $(row).siblings();
    siblings.removeClass('highlight');
    selectedInsideRows = [];

    $(row).addClass('highlight');
    selectedInsideRows.push(row);

    setInsideTableBtns();
    changeProductValues();
}

function clearInsideSelection()
{
    for (var i = 0; i < selectedInsideRows.length; i++)
    {
        $(selectedInsideRows[i]).removeClass('highlight');
    }

    selectedInsideRows = [];

    setInsideTableBtns();
}

function changeProductValues()
{
    if (selectedInsideRows.length == 0)
    {
        document.getElementById('selectProduct').value = '';
        $('#selectProduct').selectpicker('refresh')
        document.getElementById('qtdProd').value = '1';

        return;
    }

    var product = $(selectedInsideRows[0]).find('td')[1].innerText;
    var qtd = $(selectedInsideRows[0]).find('td')[2].innerText;

    document.getElementById('selectProduct').value = product;
    $('#selectProduct').selectpicker('refresh')
    document.getElementById('qtdProd').value = qtd;

}

function setInsideTableBtns()
{
    if (selectedInsideRows.length == 0)
    {
        $('.editProduct').hide();
        $('.addProduct').show();
    }
    else
    {
        $('.editProduct').show();
        $('.addProduct').hide();
    }
}

function addProduct()
{
    var product = document.getElementById('selectProduct').value;
    var qtd = document.getElementById('qtdProd').value;

    if (product == '' || qtd == '')
    {
        alert('Selecione um produto e informe a quantidade');
        return;
    }

    //check if product already exists in the table
    var table = document.getElementById('productTable');

    for (var i = 0; i < table.rows.length; i++)
    {
        var row = table.rows[i];
        if (row.cells[1].innerText == product)
        {
            alert('Produto já adicionado');
            return;
        }
    }

    //get more database data

    var rowHtml = `
        <tr onclick="selectInsideTableRow(this);">
            <td id="insideRowId" hidden class="align-middle">COLOCAR ID DO BANCO DE DADOS</td>
            <td class="align-middle">${product}</td>
            <td class="align-middle">${qtd}</td>
            <td class="align-middle">R$ 0,00</td>
            <td class="align-middle">R$ 0,00</td>
            <td class="align-middle align-right">
                <button type="button" class="btn btn-danger" id="removeProductBtn" onclick="deleteProduct(this.closest('tr')); event.stopPropagation()"><i class="fas fa-xmark"></i></button>
            </td>
        </tr>
    `

    table.innerHTML += rowHtml;

    document.getElementById('selectProduct').value = '';
    $('#selectProduct').selectpicker('refresh')
    document.getElementById('qtdProd').value = '1';
}

function deleteProduct(row)
{
    if (selectedInsideRows.includes(row) != undefined)
    {
        selectedInsideRows = [];
    }

    row.remove();

    document.getElementById('selectProduct').value = '';
    $('#selectProduct').selectpicker('refresh')
    document.getElementById('qtdProd').value = '1';
}

function editProduct()
{
    var product = document.getElementById('selectProduct').value;
    var qtd = document.getElementById('qtdProd').value;

    if (product == '' || qtd == '')
    {
        alert('Selecione um produto e informe a quantidade');
        return;
    }

    var table = document.getElementById('productTable');

    for (var i = 0; i < table.rows.length; i++)
    {
        var row = table.rows[i];
        if (row.cells[1].innerText == product && row != selectedInsideRows[0])
        {
            alert('Produto já adicionado');
            document.getElementById('selectProduct').value = selectedInsideRows[0].cells[1].innerText;
            $('#selectProduct').selectpicker('refresh')
            return;
        }
    }

    var row = selectedInsideRows[0];
    row.cells[1].innerText = product;
    row.cells[2].innerText = qtd;

    clearInsideSelection();
}

const filterList = [];

function addFilter()
{
    var filter = {
        id: filterList.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: $('#filterValue').val()
    }

    if (filterList.find(f => f.type == filter.type && f.value == filter.value)) {
        alert("Filtro já adicionado");
        return;
    }

    filterList.push(filter);

    setFilterList();
}

function setFilterList()
{
    var obj = document.querySelector('.filterList');
    obj.innerHTML = '';

    filterList.forEach(filter => {

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
    filterList.splice(filterList.findIndex(f => f.id == id), 1);
    setFilterList();
}

function clearFilters()
{
    filterList.splice(0, filterList.length);
    setFilterList();
}