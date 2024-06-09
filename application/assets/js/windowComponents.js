function header() {
    const headerTemplate = document.createElement('template');
    headerTemplate.innerHTML = `
        <header>
            <img src="assets/images/Logo.png">
        </header>
    `
    document.body.appendChild(headerTemplate.content);
}

var curMenu = null;

function sideMenu() {
    const sideMenuTemplate = document.createElement('template');
    sideMenuTemplate.innerHTML = `
        <aside>
            <div class="section">
                <a class="navBtn" href="home.html" title="Home" link="home.html">
                    <i class="fa-solid fa-house"></i>
                </a>

                <a class="navBtn" href="customer.html" title="Clientes" link="customer.html">
                    <i class="fas fa-users"></i>
                </a>

                <a class="navBtn" href="ticket.html" title="OS (Ordem de Serviço)" link="ticket.html">
                    <i class="fa-solid fa-ticket"></i>
                </a>

                <a class="navBtn" href="stock.html" title="Estoque" link="stock.html">
                    <i class="fa-solid fa-box-open"></i>
                </a>

                <a class="navBtn" href="purchase.html" title="Compras" link="purchase.html">
                    <i class="fa-solid fa-shopping-cart"></i>
                </a>
            </div>

            <div class="section">
                <div class="navBtn" href="user.html" title="Usuário" link="user.html">
                    <i class="fas fa-user"></i>
                </div>

                <div class="navBtn" title="Exit">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
            </div>
        </aside>
    `
    document.getElementById('screen').appendChild(sideMenuTemplate.content);

    setActiveMenu();
}

//get cur page and set respective sidemenu button to active
function setActiveMenu() {
    const url = window.location.pathname;
    const page = url.substring(url.lastIndexOf('/') + 1);

    const menu = document.querySelector(`[link="${page}"]`);
    menu.classList.add('active');
    curMenu = menu;
}

//LOGICA DA TELA
var selectedRows = [];

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