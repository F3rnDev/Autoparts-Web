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
    });
});

$(function() {
    $('.selectpicker').selectpicker();
});

function setModalFieldMask(serviceValue)
{
    var mask = IMask(document.getElementById('serviceValue'), {
        mask: 'R$00.00'
    });

    mask.value = serviceValue;
}

function getModalFieldMask()
{
    var mask = IMask(document.getElementById('serviceValue'), {
        mask: 'R$00.00'
    });

    //retornar valor sem mascara, separar os dois ultimos digitos com um ponto
    var value = mask.unmaskedValue.slice(0, -2) + "." + mask.unmaskedValue.slice(-2);

    return value;
}

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
        setCustomerList();
        setEmployeeList();
        setProductList();
    }
    else
    {
        $('#setProductSection').prop('hidden', false);
        $('#valueSection').prop('hidden', false);
        setModal();
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

function setModal()
{
    setCustomerList(true);
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

var isView = false;
function setModalFields(readonly)
{
    document.getElementById('ticketType').disabled = readonly;

    document.getElementById('selectCustomer').disabled = readonly;
    document.getElementById('selectEmployee').disabled = readonly;
    document.getElementById('selectProduct').disabled = readonly;
    $('.selectpicker').selectpicker('refresh')

    document.getElementById('qtdProd').readOnly = readonly;

    document.getElementById('serviceDescription').readOnly = readonly;

    document.getElementById('serviceValue').readOnly = readonly;

    $('.addProduct').prop('hidden', readonly);
    $('.editProduct').prop('hidden', readonly);

    isView = readonly;
}

function clearTicketModal()
{
    $('#setProductSection').prop('hidden', true);
    $('#valueSection').prop('hidden', true);
    $('#ticketID').val('');
    $('#ticketStatus').val('Em andamento');
    $('#ticketType').val('');

    //pega data atual e seta no campo ticketDate
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    var today = yyyy + '-' + mm + '-' + dd;

    $('#ticketDate').val(today);
    $('#ticketEndDate').val('').attr('type', 'text').attr('type', 'date');

    document.getElementById('selectCustomer').value = '';
    document.getElementById('selectEmployee').value = '';
    document.getElementById('selectProduct').value = '';
    $('.selectpicker').selectpicker('refresh')

    document.getElementById('qtdProd').value = '1';
    
    var table = document.getElementById('productTable');
    table.innerHTML = '';

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
    setMaxProdQuantity();
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

    var product = $(selectedInsideRows[0]).find('td')[0].innerText;
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

    //checar se produto já foi adicionado
    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/getTicketData.php?id=' + $('#ticketID').val(), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        for (var i = 0; i < data.products.length; i++)
        {
            if (data.products[i].prodID == product)
            {
                alert('Produto já adicionado');
                return;
            }
        }

        fetch('http://localhost/autoparts-web/application/backend/requests/ticket/addTicketProd.php?',
        {
            method: 'POST',
            body: JSON.stringify({
                product: product,
                qtd: qtd,
                os: $('#ticketID').val()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error)
            {
                alert(data.error);
                return;
            }

            updateInsideTable();

            document.getElementById('selectProduct').value = '';
            $('#selectProduct').selectpicker('refresh')
            document.getElementById('qtdProd').value = '1';
        });
    });
}

function updateInsideTable()
{
    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/getTicketData.php?id=' + $('#ticketID').val(), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        var table = document.getElementById('productTable');
        table.innerHTML = '';

        data.products.forEach(product => {
            fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryProduct.php?id=' + product.prodID, 
            {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error)
                {
                    alert(data.error);
                    return;
                }

                var total = parseFloat(data.valorUn) * parseFloat(product.quant);

                //colocar zero no total
                var total = total.toFixed(2);

                //excluir o botão caso isView seja true
                var btnHtml = '';
                document.getElementById('removeBtnHead').hidden = true;
                if (!isView)
                {
                    btnHtml = `
                        <td class="align-middle align-right">
                            <button type="button" class="btn btn-danger" id="removeProductBtn" onclick="deleteProduct(this.closest('tr')); event.stopPropagation()"><i class="fas fa-xmark"></i></button>
                        </td>  
                    `

                    //excluir campo do botão da header da tabela
                    document.getElementById('removeBtnHead').hidden = false;
                }

                var rowHtml = `
                    <tr onclick="selectInsideTableRow(this);">
                        <td id="insideRowId" hidden class="align-middle">${data.ID}</td>
                        <td class="align-middle">${data.produto} (${data.filial})</td>
                        <td class="align-middle">${product.quant}</td>
                        <td class="align-middle">R$ ${data.valorUn}</td>
                        <td class="align-middle">R$ ${total}</td>
                        ${btnHtml}
                    </tr>
                `

                table.innerHTML += rowHtml;

                updateFinalValue();
            });
        });

        updateFinalValue();
    });
}

function deleteProduct(row)
{
    if (selectedInsideRows.includes(row) != undefined)
    {
        selectedInsideRows = [];
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/deleteTicketProd.php?',
    {
        method: 'POST',
        body: JSON.stringify({
            id: $(row).find('td')[0].innerText,
            os: $('#ticketID').val()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        updateInsideTable();
        selectedInsideRows = [];
        setInsideTableBtns();

        document.getElementById('selectProduct').value = '';
        $('#selectProduct').selectpicker('refresh')
        document.getElementById('qtdProd').value = '1';
    });
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

    //checar se produto já foi adicionado
    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/getTicketData.php?id=' + $('#ticketID').val(), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        for (var i = 0; i < data.products.length; i++)
        {
            if (data.products[i].prodID == product && data.products[i].prodID != $(selectedInsideRows[0]).find('td')[0].innerText)
            {
                alert('Produto já adicionado');
                return;
            }
        }

        fetch('http://localhost/autoparts-web/application/backend/requests/ticket/editTicketProd.php?',
        {
            method: 'POST',
            body: JSON.stringify({
                product: product,
                qtd: qtd,
                os: $('#ticketID').val(),
                id: $(selectedInsideRows[0]).find('td')[0].innerText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error)
            {
                alert(data.error);
                return;
            }
            
            updateInsideTable();
            selectedInsideRows = [];
            setInsideTableBtns();

            document.getElementById('selectProduct').value = '';
            $('#selectProduct').selectpicker('refresh')
            document.getElementById('qtdProd').value = '1';
        });
    });
}

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

    filters.forEach(filter => {

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

//DATABASE
function updateTableInfo()
{   
    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/getTicketTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.message);
            return;
        }

        var searchBar = document.querySelector('#searchBarInput').value;
        var filteredData = data

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

        var progressColumn = document.querySelector('#progress .kanbanColumnContent');
        var doneColumn = document.querySelector('#done .kanbanColumnContent');
        var cancel = document.querySelector('#cancelled .kanbanColumnContent');

        progressColumn.innerHTML = '';
        doneColumn.innerHTML = '';
        cancel.innerHTML = '';

        filteredData.forEach(row => {
            //definir formato da data
            row.dataInicio = new Date(row.dataInicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            row.dataFim = new Date(row.dataFim).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

            var curDate = "Data de Inicio: " + row.dataInicio;
            if (row.status != 'em andamento') {
                curDate = "Data de Término: " + row.dataFim;
            }

            //filtrar tipo de serviço 
            // <option value="vendaPeca">Venda de Peça</option>
            // <option value="trocaPeca">Troca de Peça</option>
            // <option value="manutencao">Manutenção</option>
            // <option value="reparo">Reparo</option>
            // <option value="instalacao">Instalação</option>
            // <option value="diagnostico">Diagnóstico</option>
            // <option value="garantia">Garantia</option>
            // <option value="consulta">Consulta/Orçamento</option>
            // <option value="emergencia">Serviço de Emergência</option>
            
            switch(row.tipo)
            {
                case 'vendaPeca':
                    row.tipo = 'Venda de Peça';
                    break;
                case 'trocaPeca':
                    row.tipo = 'Troca de Peça';
                    break;
                case 'manutencao':
                    row.tipo = 'Manutenção';
                    break;
                case 'reparo':
                    row.tipo = 'Reparo';
                    break;
                case 'instalacao':
                    row.tipo = 'Instalação';
                    break;
                case 'diagnostico':
                    row.tipo = 'Diagnóstico';
                    break;
                case 'garantia':
                    row.tipo = 'Garantia';
                    break;
                case 'consulta':
                    row.tipo = 'Consulta/Orçamento';
                    break;
                case 'emergencia':
                    row.tipo = 'Serviço de Emergência';
                    break;
            }



            var html = `
                <div class="kanbanCard" onclick="selectRow(this, 'single'); setButtonsState();">
                    <div class="kanbanCardTitle kanbanCardSection">
                        <h5>ID: ${row.ID}</h5>
                        
                        <div class="form-check">
                            <input class="form-check-input selectCheck" type="checkbox" value="" onclick="selectRow(this.closest('.kanbanCard'), 'multi'); event.stopPropagation(); setButtonsState();">
                        </div>
                    </div>

                    <div class="kanbanCardSection">
                        <h5>Cliente: ${row.cliente}</h5>
                    </div>
                    
                    <div class="kanbanCardSection">
                        <h5>Responsável: ${row.funcionario}</h5>
                    </div>
                    
                    <br>

                    <div class="kanbanCardSection">
                        <h5>Tipo de Serviço: ${row.tipo}</h5>
                    </div>

                    <div class="kanbanCardSection">
                        <h5>${curDate}</h5>
                    </div>
                </div> 
            `;

            if (row.status == 'em andamento') {
                progressColumn.innerHTML += html;
            }
            if (row.status == 'concluido') {
                doneColumn.innerHTML += html;
            }
            if (row.status == 'cancelado') {
                cancel.innerHTML += html;
            }
        });
        
    });
}

function updateTicketModal()
{
    var ticket = selectedRows[0];
    var ticketData = $(ticket).find('.kanbanCardTitle h5');
    var id = ticketData[0].innerText.split(' ')[1];

    $('#modalTitle').text('Dados da OS - ' + id);
    $('#ticketID').val(id);

    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/getTicketData.php?id=' + id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        var curStatus = data.status;

        switch(data.status)
        {
            case 'em andamento':
                curStatus = 'Em andamento';
                break;
            case 'concluido':
                curStatus = 'Concluído';
                break;
            case 'cancelado':
                curStatus = 'Cancelado';
                break;
        }

        $('#ticketStatus').val(curStatus);
        $('#ticketType').val(data.tipo);

        $('#selectCustomer').val(data.clientID);
        $('#selectEmployee').val(data.funcID);
        $('.selectpicker').selectpicker('refresh');

        $('#ticketDate').val(data.dataInicio);
        $('#ticketEndDate').val(data.dataFim);

        $('#serviceDescription').val(data.descrição);

        if (data.valorServiço != null){
            setModalFieldMask(data.valorServiço)
        }
        else
        {
            setModalFieldMask("");
        }

        $('#selectProduct').val('');
        $('#qtdProd').val('1');

        updateInsideTable();
    });
}

function updateFinalValue()
{
    var table = document.getElementById('productTable');
    var total = 0;

    for (var i = 0; i < table.rows.length; i++)
    {
        var row = table.rows[i];
        total += parseFloat(row.cells[4].innerText.split(' ')[1]);
    }

    if (table.rows.length == 0)
    {
        document.getElementById('productValue').value = '';
    }
    else
    {
        document.getElementById('productValue').value = 'R$' + total.toFixed(2);
    }

    //separar dois ultimos digitos com um ponto
    var serviceValue = getModalFieldMask();

    document.getElementById('totalVal').innerHTML = "Total: R$" + (total + parseFloat(serviceValue)).toFixed(2);
}

function setCustomerList(wait = false)
{
    fetch('http://localhost/autoparts-web/application/backend/requests/customer/getCustomerTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        var select = document.getElementById('selectCustomer');
        select.innerHTML = '';

        data.forEach(customer => {
            var option = document.createElement('option');
            option.value = customer.ID;
            option.text = customer.ID + " - " + customer.nome;
            select.add(option);
        });

        $('.selectpicker').selectpicker('refresh');

        if (wait) {
            setEmployeeList(true);
        }
    });
}

function setEmployeeList(wait = false)
{
    fetch('http://localhost/autoparts-web/application/backend/requests/employee/getEmployeeTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        var select = document.getElementById('selectEmployee');
        select.innerHTML = '';

        data.forEach(employee => {
            var option = document.createElement('option');
            option.value = employee.ID;
            option.text = employee.ID + " - " + employee.nome;
            select.add(option);
        });

        $('.selectpicker').selectpicker('refresh');

        if (wait) {
            setProductList(true);
        }
    });
}

function setProductList(wait = false)
{
    fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        var select = document.getElementById('selectProduct');
        select.innerHTML = '';

        data.forEach(product => {
            var option = document.createElement('option');
            option.value = product.ID;
            option.text = product.ID + " - " + product.produto + " (" + product.filial + ")";
            select.add(option);
        });

        $('.selectpicker').selectpicker('refresh');

        if (wait) {
            updateTicketModal();
        }
    });
}

function addOS()
{
    var customer = document.getElementById('selectCustomer').value;
    var employee = document.getElementById('selectEmployee').value;
    var type = document.getElementById('ticketType').value;
    var date = document.getElementById('ticketDate').value;
    var description = document.getElementById('serviceDescription').value;
    var status = "em andamento";

    console.log(date);

    if (customer == '' || employee == '' || type == '' || description == '')
    {
        alert('Preencha todos os campos');
        return;
    }


    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/addTicket.php?', {
        method: 'POST',
        body: JSON.stringify({
            customer: customer,
            employee: employee,
            type: type,
            date: date,
            description: description,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        updateTableInfo();
        $('#ticketModal').modal('hide');
    });
}

function editOS(status = undefined)
{
    var id = $('#ticketID').val();
    var customer = document.getElementById('selectCustomer').value;
    var employee = document.getElementById('selectEmployee').value;
    var type = document.getElementById('ticketType').value;
    var date = document.getElementById('ticketDate').value;
    var description = document.getElementById('serviceDescription').value;
    var value = getModalFieldMask();
    var endDate = document.getElementById('ticketEndDate').value;

    if (customer == '' || employee == '' || type == '' || description == '' || value == '.')
    {
        alert('Preencha todos os campos');
        return;
    }

    if (status == undefined)
    {
        status = $('#ticketStatus').val();

        if (status == 'Em andamento')
        {
            status = 'em andamento';
        }
        else if (status == 'Concluído')
        {
            status = 'concluido';
        }
        else if (status == 'Cancelado')
        {
            status = 'cancelado';
        }
    }
    else
    {
        endDate = new Date();
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/ticket/editTicket.php?', {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            customer: customer,
            employee: employee,
            type: type,
            date: date,
            endDate: endDate,
            description: description,
            value: value,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        updateTableInfo();
        $('#ticketModal').modal('hide');
    });
}

function deleteOS()
{
    for (var i = 0; i < selectedRows.length; i++)
    {
        var id = selectedRows[i].querySelector('.kanbanCardTitle h5').innerText.split(' ')[1];

        fetch('http://localhost/autoparts-web/application/backend/requests/ticket/deleteTicket.php?', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error)
            {
                alert(data.error);
                return;
            }

            $('#removeModal').hide();
            updateTableInfo();
        });
    }
}

function setMaxProdQuantity()
{
    var product = document.getElementById('selectProduct').value;

    fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryProduct.php?id=' + product, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        document.getElementById('qtdProd').max = data.quantidade;
        document.getElementById('qtdProd').value = 1;
    });
}