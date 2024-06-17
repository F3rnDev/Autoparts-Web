document.addEventListener('DOMContentLoaded', function(){
    setButtonsState();
    updateTableInfo();
    // setFilterValueField();

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

    // $('#filterPopover').on('shown.bs.popover', function(){
    //     setFilterList();
    // });
});

$(function() {
    $('.selectpicker').selectpicker();
});

const filters = [];

function setButtonsState()
{
    if(selectedRows.length == 0){
        $('#executeBtn').prop('disabled', true);
        $('#removeBtn').prop('disabled', true);
        $('#viewBtn').prop('disabled', true);
    }
    else if(selectedRows.length == 1){
        $('#executeBtn').prop('disabled', false);
        $('#removeBtn').prop('disabled', false);
        $('#viewBtn').prop('disabled', false);
    }
    else if(selectedRows.length > 1){
        $('#executeBtn').prop('disabled', true);
        $('#removeBtn').prop('disabled', false);
        $('#viewBtn').prop('disabled', false);
    }

    //check row status
    if (selectedRows.length == 1)
    {
        var status = $(selectedRows[0]).find('td')[2].innerText;
        if (status == 'A caminho' || status == 'Entregue') {
            $('#executeBtn').prop('hidden', true);
            $('#removeBtn').prop('hidden', false);
            $('#viewBtn').prop('hidden', false);

            if (status == 'A caminho')
            {
                $('#removeBtn').prop('disabled', true);
            }
        }
        else {
            $('#executeBtn').prop('hidden', false);
            $('#removeBtn').prop('hidden', true);
            $('#viewBtn').prop('hidden', true);
        }
    }
    else if (selectedRows.length > 1)
    {
        var allStatus = [];
        for (var i = 0; i < selectedRows.length; i++)
        {
            var status = $(selectedRows[i]).find('td')[2].innerText;
            if (status == 'A caminho' || status == 'Entregue') {
                allStatus.push(status);
            }
        }

        console.log(allStatus);
        //botão de remover só aparece no caso de todos os status serem iguais a 'Entregue'
        if (allStatus.length == selectedRows.length)
        {
            $('#executeBtn').prop('hidden', true);
            $('#removeBtn').prop('hidden', false);
            $('#viewBtn').prop('hidden', false);
        }
        else
        {
            $('#executeBtn').prop('hidden', false);
            $('#removeBtn').prop('hidden', true);
            $('#viewBtn').prop('hidden', true);
        }
    }
    else
    {
        $('#executeBtn').prop('hidden', false);
        $('#removeBtn').prop('hidden', true);
        $('#viewBtn').prop('hidden', true);
    }
}

var isView = false;
function openDataScreen(type)
{
    $('#purchaseModal').modal('show');
    $('#filterPopover').popover('hide');

    setModalButtonsState(type);
    setModalInsideButtons();

    if (type == 'add') {
        $('#purchaseModalTitle').text('Adicionar Compra');
        $('#setProductSection').prop('hidden', true);
        clearModalFields();
        setProductList();
    }
    else if (type == 'edit') {
        $('#purchaseModalTitle').text('Editar Compra');
        $('#setProductSection').prop('hidden', false);
        setModal();
    }
    else {
        $('#purchaseModalTitle').text('Visualizar Compra');
        $('#setProductSection').prop('hidden', false);
        setModalFields();
    }
}

function clearModalFields()
{
    $('#modalTitle').text('Nova Compra');
    $('#statusModal').val('Em processamento');
    $('#filialSelectModal').val('');
    $('#productSelectModal').val('');
    $('#purchaseID').val('');
}

var selectedInsideRows = [];

function setModalInsideButtons()
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

function setModal()
{
    setProductList(true);
}

function addProduct()
{
    var product = document.getElementById('selectProduct').value;
    var qtd = document.getElementById('qtdProd').value;

    console.log(product);

    if (product == '' || qtd == '')
    {
        alert('Selecione um produto e informe a quantidade');
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/getPurchaseInfo.php?id=' + $('#purchaseID').val(), 
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

        for (var i = 0; i < data.products.length; i++)
        {
            if (data.products[i].prodID == product)
            {
                alert('Produto já adicionado');
                return;
            }
        }       

        var table = document.getElementById('productTable');
        table.innerHTML = '';

        fetch('http://localhost/autoparts-web/application/backend/requests/purchase/addProductToPurchase.php', {
            method: 'POST',
            body: JSON.stringify({
                purchaseID: $('#purchaseID').val(),
                prodId: product,
                qtd: qtd
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
        });

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

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/editProduct.php', {
        method: 'POST',
        body: JSON.stringify({
            purchaseID: $('#purchaseID').val(),
            prodId: product,
            qtd: qtd
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
    });
}

function deleteProduct(row)
{
    if (selectedInsideRows.includes(row) != undefined)
    {
        selectedInsideRows = [];
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/deleteProduct.php', {
        method: 'POST',
        body: JSON.stringify({
            purchaseID: $('#purchaseID').val(),
            prodId: $(row).find('td')[0].innerText
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
    });
}

function updateInsideTable()
{
    var table = document.getElementById('productTable');
    table.innerHTML = '';

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/getPurchaseInfo.php?id=' + $('#purchaseID').val(), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }
        var table = document.getElementById('productTable');
        table.innerHTML = '';

        data.products.forEach(product => {
            fetch ('http://localhost/autoparts-web/application/backend/requests/product/getProductData.php?id=' + product.prodID, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error)
                {
                    alert(data.error);
                    return;
                }
                var total = parseFloat(data.valorUn) * parseFloat(product.quantidade);

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

                    document.getElementById('totalFooter').innerHTML = `
                        <td></td>
                        <td colspan="3" class="text-end">Total:</td>
                        <td id="totalValue">R$ 0,00</td>
                    `
                }
                else
                {
                    document.getElementById('totalFooter').innerHTML = `
                        <td colspan="3" class="text-end">Total:</td>
                        <td id="totalValue">R$ 0,00</td>
                    `
                }

                console.log(data);

                var rowHtml = `
                    <tr onclick="selectInsideTableRow(this);">
                        <td id="insideRowId" hidden class="align-middle">${data.ID}</td>
                        <td class="align-middle">${data.nome}</td>
                        <td class="align-middle">${product.quantidade}</td>
                        <td class="align-middle">R$ ${data.valorUn}</td>
                        <td class="align-middle">R$ ${total}</td>
                        ${btnHtml}
                    </tr>
                `
                table.innerHTML += rowHtml;

                updateTotalValue();
            });
        });

        updateTotalValue();
    });

}

function updateTotalValue()
{
    var table = document.getElementById('productTable');
    var rows = table.getElementsByTagName('tr');
    var total = 0;

    for (var i = 0; i < rows.length; i++)
    {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
        var value = cells[4].innerText;
        value = value.replace('R$ ', '');
        total += parseFloat(value);
    }

    //definir digitos do valor, caso seja necessário
    total = total.toFixed(2);

    document.getElementById('totalValue').innerHTML = 'R$ ' + total;
}

function setProductList(wait = false)
{
    fetch('http://localhost/autoparts-web/application/backend/requests/product/getProductTable.php', {
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
            option.text = product.ID + " - " + product.nome;
            select.add(option);
        });

        select.value = '';

        $('.selectpicker').selectpicker('refresh');

        if (wait) {
            setModalFields();
        }
    });

}

function setModalFields()
{
    var row = selectedRows[0];
    var cells = $(row).find('td');
    var id = $(cells[1]).text();

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/getPurchaseInfo.php?id=' + id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }
        $('#modalTitle').text('Dados da Compra - ' + id);

        var curStatus = data.status;

        if (curStatus == 'caminho') {
            data.status = 'A caminho';
        }
        else if (curStatus == 'entregue')
        {
            data.status = 'Entregue';
        }
        else if (curStatus == 'processamento')
        {
            data.status = 'Em processamento';
        }

        $('#statusModal').val(data.status);
        $('#filialSelectModal').val(data.filial);
        $('#productSelectModal').val(data.product);
        $('#purchaseID').val(data.ID);
        
        updateInsideTable();
    });
}

function setModalButtonsState(type)
{
    if (type != 'view'){
        setFieldsToReadonly(false);
    }

    if(type == 'add'){
        $('#createPurchase').prop('hidden', false);
        $('#saveChanges').prop('hidden', true);
        $('#submitPurchase').prop('hidden', true);
        $('#endPurchase').prop('hidden', true);
    }
    else if(type == 'edit'){
        $('#createPurchase').prop('hidden', true);
        $('#saveChanges').prop('hidden', false);
        $('#submitPurchase').prop('hidden', false);
        $('#endPurchase').prop('hidden', true);
    }
    else
    {
        $('#createPurchase').prop('hidden', true);
        $('#saveChanges').prop('hidden', true);
        $('#submitPurchase').prop('hidden', true);
        $('#endPurchase').prop('hidden', false);

        setFieldsToReadonly(true);

        if (selectedRows.length == 1)
        {
            var status = $(selectedRows[0]).find('td')[2].innerText;
            if (status == 'Entregue')
            {
                $('#endPurchase').prop('hidden', true);
            }
        }
    }
}

function setFieldsToReadonly(value = false)
{
    document.getElementById('statusModal').readOnly = value;
    document.getElementById('filialSelectModal').disabled = value;
    document.getElementById('selectProduct').disabled = value;
    $('#selectProduct').selectpicker('refresh');

    document.getElementById('qtdProd').readOnly = value;

    $('.addProduct').prop('hidden', value);
    $('.editProduct').prop('hidden', value);

    isView = value;
}

function updateTableInfo()
{
    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/getPurchaseTable.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error);
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

            var curStatus = row.status;

            if (curStatus == 'caminho') {
                row.status = 'A caminho';
            }
            else if (curStatus == 'processamento')
            {
                row.status = 'Em processamento';
            }
            else if (curStatus == 'entregue')
            {
                row.status = 'Entregue';
            }

            var html = `
                <tr class="selectedRow" ondblclick="openDataScreen('edit')" onclick="selectRow(this, 'single'); setButtonsState();">
                    <td><input class="selectCheck" type="checkbox" onclick="selectRow(this.closest('tr'), 'multi'); event.stopPropagation(); setButtonsState();"></td>
                    <td>${row.ID}</td>
                    <td>
                        <div class="tableStatus ${curStatus}">${row.status}</div>
                    </td>
                    <td>${row.filial}</td>
                </tr>
            `
            tableObj.innerHTML += html;
        });
    });
}

function selectInsideTableRow(row)
{
    if($(row).hasClass('highlight'))
    {
        $(row).removeClass('highlight');
        selectedInsideRows.splice(selectedInsideRows.indexOf(row), 1);
        setModalInsideButtons();
        changeProductValues();
        return;
    }

    //check siblings
    var siblings = $(row).siblings();
    siblings.removeClass('highlight');
    selectedInsideRows = [];

    $(row).addClass('highlight');
    selectedInsideRows.push(row);

    setModalInsideButtons();
    changeProductValues();
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

function addPurchase()
{
    var status = document.getElementById('statusModal').value;
    var filial = document.getElementById('filialSelectModal').value;

    if (status == '' || filial == '')
    {
        alert('Preencha todos os campos');
        return;
    }

    //deine status
    if (status == 'A caminho') {
        status = 'caminho';
    }
    else if (status == 'Entregue')
    {
        status = 'entregue';
    }
    else if (status == 'Em processamento')
    {
        status = 'processamento';
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/addPurchase.php', {
        method: 'POST',
        body: JSON.stringify({
            status: status,
            filial: filial
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        $('#purchaseModal').modal('hide');
        updateTableInfo();
    });
}

function editPurchase(value = '')
{
    var status = document.getElementById('statusModal').value;
    var filial = document.getElementById('filialSelectModal').value;

    if (status == '' || filial == '')
    {
        alert('Preencha todos os campos');
        return;
    }

    //deine status
    if (value == '' || value == null)
    {
        if (status == 'A caminho') {
            status = 'caminho';
        }
        else if (status == 'Entregue')
        {
            status = 'entregue';
        }
        else if (status == 'Em processamento')
        {
            status = 'processamento';
        }
    }
    else
    {
        status = value;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/purchase/editPurchase.php', {
        method: 'POST',
        body: JSON.stringify({
            ID: $('#purchaseID').val(),
            status: status,
            filial: filial
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error)
        {
            alert(data.error);
            return;
        }

        console.log(data);

        $('#purchaseModal').modal('hide');
        updateTableInfo();
    });
}

function openRemoveModal()
{
    $('#removeModal').modal('show');
}

function deletePurchase()
{
    for(var i = 0; i < selectedRows.length; i++)
    {
        var id = $(selectedRows[i]).find('td')[1].innerText;

        fetch('http://localhost/autoparts-web/application/backend/requests/purchase/deletePurchase.php', {
            method: 'POST',
            body: JSON.stringify({
                ID: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error)
            {
                alert(data.error);
                return;
            }

            $('#removeModal').modal('hide');
            updateTableInfo();
        });
    }
}