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
    if (selectedRows.length == 0)
    {
        $('#executeBtn').prop('disabled', true);
    }
    else if (selectedRows.length > 1)
    {
        $('#executeBtn').prop('disabled', true);
    }
    else if (selectedRows.length == 1)
    {
        $('#executeBtn').prop('disabled', false);
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