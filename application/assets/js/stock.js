var curSubMenu = 'productsMenuBtn';

//CARREGAR DOCUMENTO
document.addEventListener('DOMContentLoaded', function(){
    setProdButtonsState();
    setInvButtonState();

    updateProdTableInfo();
    updateInvTableInfo();

    changeProdFilterType();
    //prod popup
    var prodPopupData = document.querySelector('#prodPopoverContent').innerHTML;
    document.querySelector('#prodPopoverContent').remove();

    const prodPopover = new bootstrap.Popover(document.querySelector('#prodFilterPopover'), {
        container: 'body',
        html: true,
        placement: 'bottom',
        sanitize: false,
        content() {
            var content = prodPopupData;
            return content
        }
    });

    $('#prodFilterPopover').on('shown.bs.popover', function(){
        setProdFilterList();
    });

    //inv popup
    var invPopupData = document.querySelector('#invPopoverContent').innerHTML;
    document.querySelector('#invPopoverContent').remove();

    const invPopover = new bootstrap.Popover(document.querySelector('#invFilterPopover'), {
        container: 'body',
        html: true,
        placement: 'bottom',
        sanitize: false,
        content() {
            var content = invPopupData;
            return content
        }
    });

    $('#invFilterPopover').on('shown.bs.popover', function(){
        setInvFilterList();
    });

    selectMenu(curSubMenu);
});

//DEFINIR BOTÕES
function setProdButtonsState()
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

function setInvButtonState()
{
    if(selectedRows.length == 1){
        $('#viewBtn').prop('disabled', false);
        $('#requestBtn').prop('disabled', false);
    }
    else
    {
        $('#viewBtn').prop('disabled', true);
        $('#requestBtn').prop('disabled', true);
    }
}

//SELECIONAR BOTÃO DO MENU
function selectMenu(subMenu)
{
    $('#'+curSubMenu).removeClass('active');
    $('#'+subMenu).addClass('active');
    curSubMenu = subMenu;

    switch(subMenu){
        case 'productsMenuBtn':
            $('#invMenu').prop('hidden', true);
            $('#prodMenu').prop('hidden', false);
            break;
        case 'inventoryMenuBtn':
            $('#invMenu').prop('hidden', false);
            $('#prodMenu').prop('hidden', true);
            break;
    }

    clearSelection();
    $('#prodFilterPopover').popover('hide');
    $('#invFilterPopover').popover('hide');
}

//MODAL PRODUTOS
function openProdDataScreen(type){
    $('#productModal').modal('show');
    $('#prodFilterPopover').popover('hide');
    $('#invFilterPopover').popover('hide');

    setModalButtonsState(type);

    if(type == 'add'){
        $('#modalTitle').text('Dados do Produto');
        document.getElementById('productID').readOnly = false;
        clearProductModal();
    }
    if(type == 'edit'){
        updateProductModal();
        document.getElementById('productID').readOnly = true;
    }
}

function setModalButtonsState(type){
    switch(type){
        case 'add':
            $('#createProduct').prop('hidden', false);
            $('#saveChanges').prop('hidden', true);
            break;
        case 'edit':
            $('#createProduct').prop('hidden', true);
            $('#saveChanges').prop('hidden', false);
            break;
    }
}

function clearProductModal(){
    $('#productID').val('');
    $('#productName').val('');
    $('#productType').val('');
    $('#productDesc').val('');
    $('#productPrice').val('');
}

//MODAL EXCLUIR
function openRemoveModal(){
    $('#removeModal').modal('show');
    $('#prodFilterPopover').popover('hide');
    $('#invFilterPopover').popover('hide');
}

//MODAL INVENTÁRIO
function openInvDataScreen(type){
    $('#invModal').modal('show');
    $('#filterPopover').popover('hide');

    updateInvModal();
}

function updateInvModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');
    var id = $(cells[1]).text();

    fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryProduct.php?id='+id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        $('#invModalTitle').text('Dados do Estoque: ' + data.ID + ' - ' + data.produto);

        $('#invID').val(data.ID);
        $('#invProd').val(data.produto);
        $('#invFilial').val(data.filial);
        $('#invQtd').val(data.quantidade);
    })
}

//LÓGICA DOS FILTROS (PRODUTO)
const filterProd = [];

function addProdFilter()
{
    var type = $('#filterType').val();
    var value = '';

    if (type == 'tipo') {
        value = $('#prodFilterValueSelect').val();
    }
    else if (type == 'valorUn') {
        value = $('#prodfilterValueNumber').val();
    }
    else {
        value = $('#prodFilterValue').val();
    }

    console.log(value);

    var filter = {
        id: filterProd.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: value
    }

    if (filterProd.find(f => f.type == filter.type && f.value == filter.value)) {
        alert("Filtro já adicionado");
        return;
    }

    filterProd.push(filter);

    setProdFilterList();
}

function changeProdFilterType()
{
    var type = $('#filterType').val();

    if (type == 'tipo') {
        $('#prodFilterValue').prop('hidden', true);
        $('#prodFilterValueSelectDiv').prop('hidden', false);
        $('#prodFilterValueNumberDiv').prop('hidden', true);
    }
    else if (type == 'valorUn') {
        $('#prodFilterValue').prop('hidden', true);
        $('#prodFilterValueSelectDiv').prop('hidden', true);
        $('#prodFilterValueNumberDiv').prop('hidden', false);
    }
    else if (type == 'nome') {
        $('#prodFilterValue').prop('hidden', false);
        $('#prodFilterValue').prop('readonly', false);
        $('#prodFilterValueSelectDiv').prop('hidden', true);
        $('#prodFilterValueNumberDiv').prop('hidden', true);
    }
    else
    {
        $('#prodFilterValue').prop('hidden', false);
        $('#prodFilterValue').prop('readonly', true);
        $('#prodFilterValueSelectDiv').prop('hidden', true);
        $('#prodFilterValueNumberDiv').prop('hidden', true);
    }
}

function setProdFilterList()
{  
    var obj = document.querySelector('.filterList');
    obj.innerHTML = '';


    filterProd.forEach(filter =>{

        var operator = "a";
        if (filter.operator == "diferente") {
            operator = "de";
        }

        var html = ` 
            <ul class="list-group">
                    <li class="list-group-item">
                        ${filter.type.toUpperCase()} ${filter.operator} ${operator} ${filter.value.toUpperCase()}
                        <button type="button" class="btn btn-danger" id="removeFilterBtn" onclick="removeProdFilter(${filter.id})"><i class="fas fa-times"></i></button>
                    </li>
            </ul>
        `;

        obj.innerHTML += html;
    });

}

function removeProdFilter(id)
{
    filterProd.splice(filterProd.findIndex(f => f.id == id), 1);
    setProdFilterList();
}

function clearProdFilters()
{
    filterProd.splice(0, filterProd.length);
    setProdFilterList();
}

//LÓGICA DOS FILTROS (INVENTÁRIO)
const filterInv = [];

function addInvFilter()
{
    var filter = {
        id: filterInv.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: $('#invFilterValue').val()
    }

    if (filterInv.find(f => f.type == filter.type && f.value == filter.value)) {
        alert("Filtro já adicionado");
        return;
    }

    filterInv.push(filter);

    setInvFilterList();
}

function setInvFilterList()
{  
    var obj = document.querySelector('.filterList');
    obj.innerHTML = '';

    filterInv.forEach(filter =>{

        var operator = "a";
        if (filter.operator == "diferente") {
            operator = "de";
        }

        var html = ` 
            <ul class="list-group">
                    <li class="list-group-item">
                        ${filter.type.toUpperCase()} ${filter.operator} ${operator} ${filter.value.toUpperCase()}
                        <button type="button" class="btn btn-danger" id="removeFilterBtn" onclick="removeInvFilter(${filter.id})"><i class="fas fa-times"></i></button>
                    </li>
            </ul>
        `;

        obj.innerHTML += html;
    });
}

function removeInvFilter(id)
{
    filterInv.splice(filterInv.findIndex(f => f.id == id), 1);
    setInvFilterList();
}

function clearInvFilters()
{
    filterInv.splice(0, filterInv.length);
    setInvFilterList();
}

//SOLICITAR BAIXA DE ESTOQUE
function openRequestModal(){
    $('#requestModal').modal('show');
    $('#invFilterPopover').popover('hide');

    var row = selectedRows[0];
    var cells = $(row).find('td');
    var id = $(cells[1]).text();

    fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryProduct.php?id='+ id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        $('#invCurQtd').val(data.quantidade);
        $('#invReqQtd').prop('max', data.quantidade);

        if (data.quantidade <= 0) {
            $('#invReqQtd').prop('readonly', true);
            $('#invReqQtd').val(0);
            $('#requestProduct').prop('disabled', true);
        }
        else {
            $('#invReqQtd').val(1);
            $('#invReqQtd').prop('readonly', false);
            $('#requestProduct').prop('disabled', false);
        }

        document.getElementById('invReason').value = '';
    })
}

//DATABASE
function updateProdTableInfo(){
    fetch('http://localhost/autoparts-web/application/backend/requests/product/getProductTable.php',
    {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        var searchBar = document.querySelector('#searchBarProdInput').value;
        var filteredData = data;

        if (searchBar != '' || filterProd.length > 0) {
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
        if (filterProd.length > 0)
        {
            data.forEach(row => {
                var valid = true;

                filterProd.forEach(filter => {
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


        var table = document.querySelector('.productTable tbody');
        table.innerHTML = '';

        filteredData.forEach(row => {
            //formatar descrição para exibição
            if(row.descricao.length > 30){
                row.descricao = row.descricao.substring(0, 30) + '...';
            }

            //definir tipo de produto
            switch(row.tipo){
                case 'peca':
                    row.tipo = 'Peça';
                    break;
                case 'acessorio':
                    row.tipo = 'Acessório';
                    break;
                case 'ferramenta':
                    row.tipo = 'Ferramenta';
                    break;
            }

            var html = `
                <tr class="selectedRow" ondblclick="openProdDataScreen('edit')" onclick="selectRow(this, 'single'); setProdButtonsState();">
                    <td><input class="selectCheck" type="checkbox" onclick="selectRow(this.closest('tr'), 'multi'); event.stopPropagation(); setProdButtonsState();"></td>
                    <td>${row.ID}</td>
                    <td>${row.nome}</td>
                    <td>${row.tipo}</td>
                    <td>${row.descricao}</td>
                    <td> R$${row.valorUn} </td>
                </tr>
            `;

            table.innerHTML += html;
        });
    })
}

function updateProductModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');
    var id = $(cells[1]).text();

    fetch('http://localhost/autoparts-web/application/backend/requests/product/getProductData.php?id='+id,
    {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        $('#modalTitle').text('Dados do Produto: ' + data.ID + ' - ' + data.nome);

        $('#productID').val(data.ID);
        $('#productName').val(data.nome);
        $('#productType').val(data.tipo);
        $('#productDesc').val(data.descricao);
        $('#productPrice').val(data.valorUn);
    })
}

function addProduct()
{
    var id = $('#productID').val();
    var name = $('#productName').val();
    var type = $('#productType').val();
    var desc = $('#productDesc').val();
    var price = $('#productPrice').val();

    //checar campos
    if(id == '' || name == '' || type == '' || desc == '' || price == ''){
        alert('Preencha todos os campos');
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/product/createProduct.php',
    {
        method: 'POST',
        body: JSON.stringify({
            ID: id,
            nome: name,
            tipo: type,
            descricao: desc,
            valorUn: price
        }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#productModal').modal('hide');
        updateProdTableInfo();
    })
}

function editProduct()
{
    var id = $('#productID').val();
    var name = $('#productName').val();
    var type = $('#productType').val();
    var desc = $('#productDesc').val();
    var price = $('#productPrice').val();

    //checar campos
    if(id == '' || name == '' || type == '' || desc == '' || price == ''){
        alert('Preencha todos os campos');
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/product/updateProduct.php',
    {
        method: 'POST',
        body: JSON.stringify({
            ID: id,
            nome: name,
            tipo: type,
            descricao: desc,
            valorUn: price
        }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#productModal').modal('hide');
        updateProdTableInfo();
    })
}

function deleteProduct()
{
    for (var i = 0; i < selectedRows.length; i++) {
        var row = selectedRows[i];
        var cells = $(row).find('td');
        var id = $(cells[1]).text();

        fetch('http://localhost/autoparts-web/application/backend/requests/product/deleteProduct.php?',
        {
            method: 'POST',
            body: JSON.stringify({
                ID: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.error)
            {
                alert(data.error);
                return;
            }

            alert(data.success);
            $('#removeModal').modal('hide');
            updateProdTableInfo();
        })
    }
}

//DATABASE INVENTORY
function updateInvTableInfo()
{
    fetch('http://localhost/autoparts-web/application/backend/requests/product/getInventoryTable.php',
    {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        var searchBar = document.querySelector('#searchBarInvInput').value;
        var filteredData = data;

        if (searchBar != '' || filterInv.length > 0) {
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
        if (filterInv.length > 0)
        {
            data.forEach(row => {
                var valid = true;

                filterInv.forEach(filter => {
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

        var table = document.querySelector('.invTable tbody');
        table.innerHTML = '';

        filteredData.forEach(row => {
            var html = `
                <tr class="selectedRow" ondblclick="openInvDataScreen('view')" onclick="selectRow(this, 'single'); setInvButtonState();">
                    <td><input class="selectCheck" type="checkbox" onclick="selectRow(this.closest('tr'), 'multi'); event.stopPropagation(); setInvButtonState();"></td>
                    <td>${row.ID}</td>
                    <td>${row.prodID} - ${row.produto}</td>
                    <td>${row.filial}</td>
                    <td>${row.quantidade}</td>
                </tr>
            `;

            table.innerHTML += html;
        });
    })
}

function solBaixa()
{
    var row = selectedRows[0];
    var cells = $(row).find('td');
    var id = $(cells[1]).text();

    var finalQtd = $('#invCurQtd').val() - $('#invReqQtd').val();

    //checar campos
    if(document.getElementById('invReason').value == ''){
        alert('Preencha todos os campos');
        return;
    }

    fetch('http://localhost/autoparts-web/application/backend/requests/product/requestInventory.php',
    {
        method: 'POST',
        body: JSON.stringify({
            ID: id,
            quantidade: finalQtd
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error)
        {
            alert(data.error);
            return;
        }

        alert(data.success);
        $('#requestModal').modal('hide');
        updateInvTableInfo();
    })
}


