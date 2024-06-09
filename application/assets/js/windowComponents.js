function header() {
    const headerTemplate = document.createElement('template');
    headerTemplate.innerHTML = `
        <header>
            <img src="assets/images/Logo.png">
        </header>
    `
    document.body.appendChild(headerTemplate.content);
}

function sideMenu() {
    const sideMenuTemplate = document.createElement('template');
    sideMenuTemplate.innerHTML = `
        <aside>
            <div class="section">
                <a class="navBtn" href="home.html" title="Home">
                    <i class="fa-solid fa-house"></i>
                </a>

                <a class="navBtn" href="customer.html" title="Clientes" link="customer.html">
                    <i class="fas fa-users"></i>
                </a>

                <a class="navBtn" href="ticket.html" title="OS (Ordem de Serviço)">
                    <i class="fa-solid fa-ticket"></i>
                </a>

                <a class="navBtn" href="stock.html" title="Estoque">
                    <i class="fa-solid fa-box-open"></i>
                </a>

                <a class="navBtn" href="purchase.html" title="Compras">
                    <i class="fa-solid fa-shopping-cart"></i>
                </a>
            </div>

            <div class="section">
                <div class="navBtn" href="user.html" title="Usuário">
                    <i class="fas fa-user"></i>
                </div>

                <div class="navBtn" title="Exit">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </aside>
    `
    document.getElementById('screen').appendChild(sideMenuTemplate.content);
}

//LOGICA DA TELA
var selectedRows = [];
const filters = [];

//LÓGICA DA SELEÇÃO NA TABELA
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
}

function selectSingleRow(row)
{
    $(row).addClass('highlight').siblings().removeClass('highlight');
    $(row).siblings().find('.selectCheck').prop('checked', false);
    $(row).find('.selectCheck').prop('checked', true);

    selectedRows = [];
    selectedRows.push(row);
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
}

//LÓGICA DOS FILTROS
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