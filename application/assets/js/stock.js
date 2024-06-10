var curSubMenu = 'productsMenuBtn';

//CARREGAR DOCUMENTO
document.addEventListener('DOMContentLoaded', function(){
    setProdButtonsState();
    setInvButtonState();

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
        clearProductModal();
    }
    if(type == 'edit'){
        updateProductModal();
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

function updateProductModal(){
    var row = selectedRows[0];
    var cells = $(row).find('td');

    var id = $(cells[1]).text();
    var name = $(cells[2]).text();

    $('#modalTitle').text('Dados do Produto: ' + id + ' - ' + name);
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
    var name = $(cells[2]).text();

    $('#invModalTitle').text('Inventário do Produto: ' + id + ' - ' + name);
}

//LÓGICA DOS FILTROS (PRODUTO)
const filterProd = [];

function addProdFilter()
{
    var filter = {
        id: filterProd.length,
        type: $('#filterType').val(),
        operator: $('#filterOperator').val(),
        value: $('#filterValue').val()
    }

    if (filterProd.find(f => f.type == filter.type && f.value == filter.value)) {
        alert("Filtro já adicionado");
        return;
    }

    filterProd.push(filter);

    setProdFilterList();
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
        value: $('#filterValue').val()
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
}


