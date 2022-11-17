// print all the warehouses
addNewBtn = $('.warehouse-container .col').html()
printWarehouses(warehouses)
function printWarehouses(warehouses) {
    data = ``
    warehouses.forEach(warehouse => {
        data += `
        <div class="card mx-3 my-3 cursor-pointer shadow-none rounded-0" style="width: 14rem;">
            <div class="card-img"
                style="background-image: url('/images/warehouse/base-img/${warehouse.warehouseImg}');background-size: cover;height: 11em;width: 100%;background-position: center;">
            </div>
            <div class="card-body py-0">
                <h5 class="text-center my-3 text-capitalize">${warehouse.warehouseName}</h5>
            </div>
        </div>`
    });
    data += addNewBtn
    $('.warehouse-container .col').html(data)
}


// create a new warehouse
$('#newWarehouseModal form').on('submit', (e) => {
    e.preventDefault();
    data = _.object($("#newWarehouseModal form").serializeArray().map(function (v) { return [v.name, v.value]; }))
    // axios.post('',{data})
    data['warehouseImgFile'] = warehouseImgFile
    console.log(data)
    axios.post('/api/v1/warehouse/create-new', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        if (res.data.success) {
            $("#newWarehouseModal .close").click();
            printWarehouses(res.data.warehouses)
        } else {
            $('#newWarehouseModal .modal-footer button').html('Error!').attr('type', 'button').removeClass('bg-text-base-color').addClass('bg-danger text-light')
        }
    })
})


// add value to input box of all permitted admins
function createPermissionsList(ele) {
    input = $('input[name=warehousePermissions]')
    if($(ele).is(':checked')){
        input.val(input.val() + $(ele).val() + '  ,  ' )
    }else{
        input.val(input.val().replaceAll(`${$(ele).val()}  ,  `,''))
    }
}
// close warehouse permissions admin list 
function closeWarehousePermssions(){
    $('#newWarehouseModal').removeClass('hide')
    $('.new-warehouse-permissions').addClass('hide')
    $('.modal-warehouse-permissions').addClass('d-none')
}

// open warehouse permissions admin list 
function openWarehousePermssions() {
    $('input[name=warehousePermissions]').val('')
    $('#newWarehouseModal').addClass('hide')
    $('.new-warehouse-permissions').removeClass('hide')
    axios.get('/api/v1/vitco-impex/admins/all').then((res) => {
        data = ``
        res.data.admins.forEach(admin => {
            data += `
            <tr>
                <input type="text" hidden value="${admin._id}">
                <th scope="row">${admin.adminName}</th>
                <td>
                    <input type="checkbox" class="form-check-input m-0 border-primary" name="${admin._id}"
                        value="${admin._id}" onchange="createPermissionsList(this)">
                </td>
            </tr>`
        });
        $('.new-warehouse-permissions .table-responsive tbody').html(data)
    })
}

// when add new ware house modal opens
$('#newWarehouseModal').on('shown.bs.modal', function () {
    $('.modal-warehouse-permissions').removeClass('d-none')
    $('#newWarehouseModal input').val(''); $('#newWarehouseModal img').attr('src', '').removeClass('active')
    $('#newWarehouseModal .modal-footer button').html('Create').attr('type', 'submit').addClass('bg-text-base-color').removeClass('bg-danger text-light')
    $('.preview-warehouse-img').addClass('hide')
})