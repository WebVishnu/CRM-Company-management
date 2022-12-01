const tableBody = $('#warehouse-table-body')
const tableHead = $('.warehouse-table-container thead')
const tableHeadHtml = $('.warehouse-table-container thead').html()
const bottomRightSectionHtml = $('.bottom-right-section').html()
const productUnitHtml = $(`.add-new-item-modal select[name="unit"]`).html()
const formError = $('.add-new-item-modal .error')
// get all products
function getAllProducts() {
    axios.get(`/api/v1/warehouse/${warehouseID}/products/all`).then(res => {
        $('.bottom-right-section').html(bottomRightSectionHtml)
        if (res.data.success) {
            $('.top-header-middle .reports').fadeOut(0)
            tableHead.html(`
                <th scope="col" class="text-truncate">Name</th>
                <th scope="col" class="text-truncate">Category</th>
                <th scope="col" class="text-truncate">Rate</th>
                <th scope="col" class="text-truncate">Min stock</th>
                <th scope="col" class="text-truncate">Unit</th>`)
            printProducts(res.data.products)
        }
    })
}



inventory()
// PRINT INVENTORY 
function inventory() {
    $('.top-header-middle .reports').fadeIn(0)
    axios.get(`/api/v1/warehouse/${warehouseID}/products/all`).then(res => {
        if (res.data.success) {
            var totalStockValue = 0
            var totalOS = 0 //  total out of stock
            var totalIS = 0 // total in stock
            res.data.products.forEach(product => {
                totalStockValue += parseInt(product.rate) * parseInt(product.currentStock)
                if (product.currentStock < parseInt(product.minimumStock)) {
                    totalOS += 1
                } else if (product.currentStock > parseInt(product.minimumStock)) {
                    totalIS += 1
                }
            });
            $('.reports .total-stock-value h2').html("₹" + totalStockValue)
            $('.reports .total-out-of-stock h2').html(totalOS)
            $('.reports .total-in-stock h2').html(totalIS)
            $('.bottom-right-section').html(`
            <button class="btn bg-text-base-color shadow-none" data-toggle="modal" data-target="#checkInModal"> <span class="d-md-inline d-none" style="color:#003153;"> ( F1 )</span> Check In</button>
            <button class="btn bg-text-base-color shadow-none" data-toggle="modal" data-target="#checkOutModal"> <span class="d-md-inline d-none" style="color:#003153;"> ( F2 )</span> Check Out</button>`)
            tableHead.html(`
                <th scope="col" class="text-truncate">Name</th>
                <th scope="col" class="text-truncate">Category</th>
                <th scope="col" class="text-truncate">Rate</th>
                <th scope="col" class="text-truncate">Quantity</th>
                <th scope="col" class="text-truncate">Min stock</th>
                <th scope="col" class="text-truncate">Unit</th>
                <th scope="col" class="text-truncate">Status</th>
                <th scope="col" class="text-truncate">Value</th>`)
            tableBody.html('')
            res.data.products.forEach(product => {
                tableBody.append(`
                            <tr onclick='openInventoryProductDesc(${JSON.stringify(product)},${JSON.stringify(product.productCategory)})'>
                                <td class="text-truncate px-3">${product.productName}</td>
                                <td class="text-truncate px-3">${product.productCategory}</td>
                                <td class="text-truncate px-3">₹ ${product.rate}</td>
                                <td class="text-truncate px-3">${product.currentStock}</td>
                                <td class="text-truncate px-3">${product.minimumStock}</td>
                                <td class="text-truncate px-3">${product.unit}</td>
                                <td class="text-truncate px-3"">${parseInt(product.currentStock) >= parseInt(product.minimumStock) ? `<span class="stock-status-in" data-toggle="tooltip" data-placement="top" title="In stock"><i class="bi bi-check2-circle"></i></span>` : `<span class="stock-status-out" data-toggle="tooltip" data-placement="top" title="Out of stock"><i class="bi bi-x-circle"></i></span>`}</td>
                                <td class="text-truncate px-3">₹ ${parseInt(product.rate) * parseInt(product.currentStock)}</td>
                            </tr>`)
            });
            $('[data-toggle="tooltip"]').tooltip()
        }
    }).catch(err => {
        console.log(err)
    })

}

printProductsCheckinOut()
// print all prodcuts in check in 
async function printProductsCheckinOut() { // check in and check out
    productSelCheckIn = $(`.checkInModal #selProductName`)
    productSelCheckOut = $(`.checkOutModal #selProductName`)
    productSelCheckIn.html(`<option value='null'>Choose product</option>`)
    productSelCheckOut.html(`<option value='null'>Choose product</option>`)
    await axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        if (res.data.success) {
            res.data.categories.forEach((category, ci) => { // ci == category index
                category.products.forEach((product, pi) => { // pi == product index
                    productSelCheckIn.append(`<option value='${product.productName} >> ${product._id} >> ${pi} >> ${ci} >> ${product.unit}'>${product.productName}</option>`)
                    productSelCheckOut.append(`<option value='${product.productName} >> ${product._id} >> ${pi} >> ${ci} >> ${product.unit}'>${product.productName}</option>`)
                });
            });
            productSelCheckIn.searchableSelect();
            productSelCheckOut.searchableSelect();
            return true
        }
    })

}


// print products
function printProducts(products) {
    tableBody.html('')
    products.forEach(product => {
        tableBody.append(`
        <tr onclick='openProductDesc(${JSON.stringify(product)},"${product.productCategory}")'>
            <td class="text-truncate px-3">${product.productName}</td>
            <td class="text-truncate px-3">${product.productCategory}</td>
            <td class="text-truncate px-3">₹ ${product.rate}</td>
            <td class="text-truncate px-3">${product.minimumStock}</td>
            <td class="text-truncate px-3">${product.unit}</td>
        </tr>`)
    });
}


// ADD NEW ITEM MODAL
function openNewItemModal() {
    $('.add-new-item-modal').removeClass('hide')
    $('.add-new-item-modal input').val('')
    ProductImgCmd("hide", "")
    $('.add-new-item-modal select[name="categoryName"]').html('')
    $(`.add-new-item-modal select[name="unit"]`).html(productUnitHtml).prop('disabled', false);
    formError.html('')
    addNewCategory("remove")
    axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        if (res.data.success) {
            if (res.data.categories.length > 0) {
                res.data.categories.forEach(category => {
                    $('.add-new-item-modal select[name="categoryName"]').append(`<option value="${category.categoryName}">${category.categoryName}</option>`).prop('disabled', false);
                })
            } else {
                $('.add-new-item-modal select[name="categoryName"]').append(`<option value="null">Please add new category</option>`).prop('disabled', false);;
            }
        } else {
            formError.html('We found some error')
        }
    })
}

// PRODUCT IMG CMD
function ProductImgCmd(cmd, url) {
    if (cmd == "show") {
        // ADD NEW BACKGROUND IMAGE TO PRODUCT IMAGE
        $('.add-new-item-modal .product-img div').addClass('active').attr('style', `background:url('${url}')`);
        $('.add-new-item-modal .product-img div p').fadeOut(0)
        $('.add-new-item-modal .product-img div i').fadeOut(0)
        $('.add-new-item-modal .stockHistory').fadeIn(0)
        $('.add-new-item-modal .product-img div').off("click").css('cursor', 'auto');
        $('.add-new-item-modal .product-img').parent().children('.font-weight-bold').fadeOut(0)
        $('.add-new-item-modal input').prop('readonly', true)
        $('.add-new-item-modal h4').html('Product Details')
        $('.add-new-category-btn').fadeOut(0)
        $('.add-new-item-modal .newProductFooterSec').fadeOut(0)
        $('.add-new-item-modal .sku-input i').fadeOut(0)
        addNewCategory("remove")
    } else if (cmd == "hide") {
        // SET DEFAULT STYLE TO PRODUCT IMAGE
        $('.add-new-item-modal .product-img div').removeClass('active').attr('style', `background:url("")`);
        $('.add-new-item-modal .product-img div p').fadeIn(0)
        $('.add-new-item-modal .product-img div i').fadeIn(0)
        $('.add-new-item-modal .product-img div').on('click', (e) => {
            $('#new-product-img')[0].click();
        }).css('cursor', 'pointer')
        $('.add-new-item-modal .product-img').parent().children('.font-weight-bold').fadeIn(0)
        $('.add-new-item-modal input').prop('readonly', false)
        $('.add-new-category-btn').fadeIn(0)
        $('.add-new-item-modal h4').html('Create new product')
        $('.add-new-item-modal .newProductFooterSec').fadeIn(0)
        $('.add-new-item-modal .sku-input i').fadeIn(0)
        $('.add-new-item-modal .stockHistory').fadeOut(0)
    }
}

// product description
function openInventoryProductDesc(product, category) {
    productFields = Object.keys(product)
    $(`.inventary-product-details`).fadeIn(0)
    $(`.inventary-product-details h5[data-info="category"]`).html(category).attr({ "data-bs-original-title": category })
    $(`.inventary-product-details .heading span`).html(product.productName)
    $('.inventary-product-details .filterStockHistory').val("all").change();
    $('.inventary-product-details .filterStockHistory').attr('onclick', `filterStockHistory(${JSON.stringify(product.stockHistory)})`)
    $(`.inventary-product-details .heading img`).attr("src", `/adminUploads/products/img/${product.productImg}`)
    productFields.forEach(field => {
        $(`.inventary-product-details h5[data-info="${field}"]`).html(product[field])
    });
    $(`.inventary-product-details .stock-history`).html('')
    product.stockHistory.forEach(info => {
        $(`.inventary-product-details .stock-history`).append(`
        <a href="javascript:void(0)" class="list-group-item my-2 list-group-item-action flex-column align-items-start ${(info.cmd == "-") ? "danger" : "success"}">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${info.createdBy.adminName}</h5>
                <small>${info.createdBy.date}</small>
            </div>
            <h6>Quantity : ${info.quantity}</h6>
            <p class="mb-1">${info.description}</p>
        </a>`)
    });

}

// product description
function openProductDesc(product, category) {
    ProductImgCmd("show", `/adminUploads/products/img/${product.productImg}`)
    productFields = Object.keys(product)
    $('.add-new-item-modal select[name="categoryName"]').html(`<option value="${category}">${category}</option>`).prop('disabled', true);
    productFields.forEach(field => {
        $(`.add-new-item-modal input[name="${field}"]`).val(product[field])
        $(`.add-new-item-modal select[name="${field}"]`).html(`<option value="${product[field]}">${product[field]}</option>`).prop('disabled', true);
    });
    $('.add-new-item-modal .stockHistory .list-group').html('')
    printStockHistory(product.stockHistory, ".add-new-item-modal .stockHistory .list-group")
    $('.add-new-item-modal').removeClass('hide')
}

// add new product
$('.add-new-item-modal .product-info form').on('submit', (e) => {
    e.preventDefault()
    data = _.object($('.add-new-item-modal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    data['productImg'] = $("#new-product-img")[0].files[0]
    if (data['productImg'] == undefined) {
        formError.html('Please select product image')
    } else if (($('.add-new-item-modal select[name="categoryName"]').val() == "null" && $('.add-new-item-modal .newCategoryName').prop('hidden')) || $('.add-new-item-modal select[name="unit"]').val() == "null") {
        formError.html('Please fill the form correctly')
    } else {
        axios.post(`/api/v1/warehouse/${warehouseID}/products/add-new`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if (res.data.success) {
                getAllProducts()
                $('.add-new-item-modal').addClass('hide')

            } else {
                console.log("error")
            }
        })
    }
})

// GENERATE stock keeping unit ( SKU )
async function generateSKU(form) {
    formError.html('')
    data = _.object(form.serializeArray().map(function (v) { return [v.name, v.value]; }))
    if (data.productName == "") {
        formError.html('Enter product name')
        return ""
    } else {
        sku = ''
        productName = data.productName.split(" ").filter(element => element)
        sku += `${productName[0][0].toUpperCase()}${(productName[1]) ? productName[1][0].toUpperCase() : "2"}`
        sku += `${String(new Date().getFullYear())[2]}${String(new Date().getFullYear())[3]}`
        sku += `${Math.floor(Math.random() * (9999999 - 1111111 + 1) + 1111111)}`
        isSku = await axios.get(`/api/v1/warehouse/${warehouseID}/products/check/sku/${sku}`).then(res => {
            if (res.data.sku) {
                return true
            } else {
                return false
            }
        })
        if (!isSku) {
            return sku
        } else {
            generateSKU(form)
        }

    }
}



//add new stock
$('#checkInModal form').on('submit', (e) => {
    e.preventDefault()
    data = _.object($('.checkInModal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    if (data.quantity == "0") {
        $("#checkInModal .error").html("Quantity must be greater than 0")
    } else if (data.product) {
        axios.post(`/api/v1/warehouse/${warehouseID}/products/stock/add`, data).then(res => {
            if (res.data.success) {
                $('#checkInModal button.close').click()
                $("#checkInModal").modal('hide')
                inventory()
            } else {
                $('#checkInModal button.close').click()
            }
        })
    } else {
        $("#checkInModal .error").html("Please choose a product")
    }
})

//add new stock
$('#checkOutModal form').on('submit', (e) => {
    e.preventDefault()
    data = _.object($('.checkOutModal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    if (data.quantity == "0") {
        $("#checkOutModal .error").html("Quantity must be greater than 0")
    } else if (data.product) {
        axios.post(`/api/v1/warehouse/${warehouseID}/products/stock/remove`, data).then(res => {
            if (res.data.success) {
                $('#checkOutModal button.close').click()
                $("#checkOutModal").modal('hide')
                inventory()
            } else {
                console.log("error")
                throw "There is not enough stock to check out"
            }
        }).catch(err => {
            $("#checkOutModal .error").html(`${err}`)
            console.log(err)
        })
    } else {
        $("#checkOutModal .error").html("Please choose a product")
    }
})

// WHEN CHECK IN MODAL OPENS
$("#checkInModal").on('shown.bs.modal', () => {
    $('#checkInModal .searchable-select').remove()
    $('#checkInModal input').val('')
    $('#checkInModal textarea').val('')
    $('#checkInModal .error').html('')
    $('.checkInModal input[name="date"]').val(moment().format('DD/MM/YYYY'))
    $('.checkInModal input[name="quantity"]').focus()
    printProductsCheckinOut()
});

// WHEN CHECK OUT MODAL OPENS
$("#checkOutModal").on('shown.bs.modal', () => {
    $('#checkOutModal .searchable-select').remove()
    $('#checkOutModal input').val('')
    $('#checkOutModal textarea').val('')
    $('#checkOutModal .error').html('')
    $('#checkOutModal input[name="date"]').val(moment().format('DD/MM/YYYY'))
    $('#checkOutModal input[name="quantity"]').focus()
    printProductsCheckinOut()
});

// shortcuts
keyboardJS.bind('esc', (e) => {
    $('.add-new-item-modal').addClass('hide')
    $('.right-side-l-navbar').removeClass('show')
    $(`.inventary-product-details`).fadeOut(10)
    $('#viewProductStockHistory').fadeOut(100)
});

keyboardJS.bind('f1', (e) => {
    e.preventDefault()
    $('#checkInModal').modal('show');
    $('#checkOutModal button.close').click()
    $("#checkOutModal").modal('hide')
    inventoryHeader = $(`.top-header-filter .new-design-button[data-filter="inventory"]`)
    if (!inventoryHeader.hasClass('active')) {
        $('.top-header-filter .new-design-button').removeClass('active')
        inventoryHeader.addClass('active')
        inventory()
    }

});

keyboardJS.bind('f2', (e) => {
    e.preventDefault()
    $('#checkOutModal').modal('show');
    $('#checkInModal button.close').click()
    $("#checkInModal").modal('hide')
    inventoryHeader = $(`.top-header-filter .new-design-button[data-filter="inventory"]`)
    if (!inventoryHeader.hasClass('active')) {
        $('.top-header-filter .new-design-button').removeClass('active')
        inventoryHeader.addClass('active')
        inventory()
    }
});


// FILTER ARRAY OF OBJECT
// =================================================================
// filter date
function filterArrDate(from, to, arr) {
    var filteredArr = arr.filter(({ createdBy }) => {
        dateArr = createdBy.date.split('/')
        date = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
        return date >= from && date <= to
    })

    return filteredArr
}

//SORT INVENTORY
function sortInventory(cmd, arr) {
    if (cmd == "status") {
    }
}

// PRINT STOCK HISTORY ARRAY 
function printStockHistory(arr, eleSelector) {
    $(`${eleSelector}`).html('')
    arr.forEach(info => {
        $(`${eleSelector}`).append(`
        <a href="javascript:void(0)" class="list-group-item my-2 list-group-item-action flex-column align-items-start ${(info.cmd == "-") ? "danger" : "success"}">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${info.createdBy.adminName}</h5>
                <small>${info.createdBy.date}</small>
            </div>
            <h6>Quantity : ${info.quantity}</h6>
            <p class="mb-1">${info.description}</p>
        </a>`)
    })
}