const tableBody = $('#warehouse-table-body')
const tableHead = $('.warehouse-table-container thead')
const tableHeadHtml = $('.warehouse-table-container thead').html()
const bottomRightSectionHtml = $('.bottom-right-section').html()
const productUnitHtml = $(`.add-new-item-modal select[name="unit"]`).html()
// get all products
function getAllProducts() {
    axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        $('.bottom-right-section').html(bottomRightSectionHtml)
        if (res.data.success) {
            $('.top-header-middle .reports').fadeOut(0)
            tableHead.html(tableHeadHtml)
            printProducts(res.data.categories)
        }
    })
}
inventory()
// PRINT INVENTORY 
function inventory() {
    $('.top-header-middle .reports').fadeIn(0)
    axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        if (res.data.success) {
            $('.bottom-right-section').html(`
            <button class="btn bg-text-base-color shadow-none">Check In</button>
            <button class="btn bg-text-base-color shadow-none">Check Out</button>`)
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
            res.data.categories.forEach(category => {
                category.products.forEach(product => {
                    if(parseInt(product.currentStock) != 0){
                        tableBody.append(`
                            <tr>
                                <td class="text-truncate px-3">${product.productName}</td>
                                <td class="text-truncate px-3">${category.categoryName}</td>
                                <td class="text-truncate px-3">₹ ${product.rate}</td>
                                <td class="text-truncate px-3">${product.currentStock}</td>
                                <td class="text-truncate px-3">${product.minimumStock}</td>
                                <td class="text-truncate px-3">${product.unit}</td>
                                <td class="text-truncate px-3"">${parseInt(product.currentStock) > parseInt(product.minimumStock) ? `<span class="stock-status-in" data-toggle="tooltip" data-placement="top" title="In stock"><i class="bi bi-check2-circle"></i></span>` : `<span class="stock-status-out" data-toggle="tooltip" data-placement="top" title="Out of stock"><i class="bi bi-x-circle"></i></span>`}</td>
                                <td class="text-truncate px-3">₹ ${parseInt(product.rate) * parseInt(product.currentStock)}</td>
                            </tr>`)
                    }
                });
            });
            $('[data-toggle="tooltip"]').tooltip()
        }
    })

}

// check 


// print products
function printProducts(categories) {
    tableBody.html('')
    categories.forEach(category => {
        category.products.forEach(product => {
            tableBody.append(`
            <tr onclick='openProductDesc(${JSON.stringify(product)},"${category.categoryName}")'>
                <td class="text-truncate px-3">${product.productName}</td>
                <td class="text-truncate px-3">${category.categoryName}</td>
                <td class="text-truncate px-3">₹ ${product.rate}</td>
                <td class="text-truncate px-3">${product.minimumStock}</td>
                <td class="text-truncate px-3">${product.unit}</td>
            </tr>`)
        });
    });
}


// ADD NEW ITEM MODAL
function openNewItemModal() {
    $('.add-new-item-modal').removeClass('hide')
    $('.add-new-item-modal input').val('')
    ProductImgCmd("hide", "")
    $('.add-new-item-modal select[name="categoryName"]').html('')
    $(`.add-new-item-modal select[name="unit"]`).html(productUnitHtml).prop('disabled', false);
    $('.add-new-item-modal .error').html('')
    addNewCategory("remove")
    axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        if (res.data.success) {
            if (res.data.categories.length > 0) {
                res.data.categories.forEach(category => {
                    $('.add-new-item-modal select[name="categoryName"]').append(`<option value="${category.categoryName}">${category.categoryName}</option>`).prop('disabled', false);
                });
            } else {
                $('.add-new-item-modal select[name="categoryName"]').append(`<option value="null">Please add new category</option>`).prop('disabled', false);;
            }
        } else {
            $('.add-new-item-modal .error').html('We found some error')
        }
    })
}

// PRODUCT IMG CMD
function ProductImgCmd(cmd, url) {
    if (cmd == "show") {
        // HIDE BACKGROUND OF PRODUCT IMG
        $('.add-new-item-modal .product-img div').addClass('active').attr('style', `background:url('${url}')`);
        $('.add-new-item-modal .product-img div p').fadeOut(0)
        $('.add-new-item-modal .product-img div i').fadeOut(0)
        $('.add-new-item-modal .product-img div').off("click").css('cursor', 'auto');
        $('.add-new-item-modal .product-img').parent().children('.font-weight-bold').fadeOut(0)
        $('.add-new-item-modal input').prop('readonly', true)
        $('.add-new-item-modal h4').html('Product Details')
        $('.add-new-category-btn').fadeOut(0)
        $('.add-new-item-modal .newProductFooterSec').fadeOut(0)
        addNewCategory("remove")
    } else if (cmd == "hide") {
        // SHOW BACKGROUND OF PRODUCT IMG
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

    }
}

function openProductDesc(product, category) {
    ProductImgCmd("show", `/adminUploads/products/img/${product.productImg}`)
    productFields = Object.keys(product)
    $('.add-new-item-modal select[name="categoryName"]').html(`<option value="${category}">${category}</option>`).prop('disabled', true);
    productFields.forEach(field => {
        $(`.add-new-item-modal input[name="${field}"]`).val(product[field])
        $(`.add-new-item-modal select[name="${field}"]`).html(`<option value="${product[field]}">${product[field]}</option>`).prop('disabled', true);
    });
    $('.add-new-item-modal').removeClass('hide')
}

// add new product
$('.add-new-item-modal .product-info form').on('submit', (e) => {
    e.preventDefault()
    data = _.object($('.add-new-item-modal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    data['productImg'] = $("#new-product-img")[0].files[0]
    if (data['productImg'] == undefined) {
        $('.add-new-item-modal .error').html('Please select product image')
    } else if (($('.add-new-item-modal select[name="categoryName"]').val() == "null" && $('.add-new-item-modal .newCategoryName').prop('hidden')) || $('.add-new-item-modal select[name="unit"]').val() == "null") {
        console.log($('.add-new-item-modal select[name="unit"]').val())
        console.log($('.add-new-item-modal select[name="categoryName"]').val())
        $('.add-new-item-modal .error').html('Please fill the form correctly')
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


// shortcuts
keyboardJS.bind('esc', (e) => {
    $('.add-new-item-modal').addClass('hide')
    $('.right-side-l-navbar').removeClass('show')
});
