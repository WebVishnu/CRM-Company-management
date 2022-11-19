// get all products
function getAllProducts() {
    axios.get(`/api/v1/warehouse/${warehouseID}/category/all`).then(res => {
        if (res.data.success) {
            printProducts(res.data.categories)
        }
    })
}
getAllProducts()

// print products
function printProducts(categories) {
    table = $('#warehouse-table-body')
    table.html('')
    categories.forEach(category => {
        category.products.forEach(product => {
            table.append(`
            <tr onclick='openProductDesc(${JSON.stringify(product)},"${category.categoryName}")'>
                <td>${product.productName}</td>
                <td>${category.categoryName}</td>
                <td>${product.rate}</td>
                <td>${product.currentStock}</td>
                <td>${product.maximumStock}</td>
                <td>${product.stockHistory}</td>
            </tr>`)
        });
    });
}


function ProductImgCmd(cmd, url) {
    if (cmd == "show") {
        $('.add-new-item-modal .product-img div').addClass('active').attr('style', `background:url('${url}')`);
        $('.add-new-item-modal .product-img div p').fadeOut(0)
        $('.add-new-item-modal .product-img div i').fadeOut(0)
        $('.add-new-item-modal .product-img div').off("click").css('cursor','auto');
        $('.add-new-item-modal .product-img').parent().children('.font-weight-bold').fadeOut(0)
        $('.add-new-item-modal input').prop('readonly',true)
        $('.add-new-category-btn').fadeOut(0)
        
    } else if (cmd == "hide") {
        $('.add-new-item-modal .product-img div').removeClass('active').attr('style', `background:url("")`);
        $('.add-new-item-modal .product-img div p').fadeIn(0)
        $('.add-new-item-modal .product-img div i').fadeIn(0)
        $('.add-new-item-modal .product-img div').on('click', (e) => {
            $('#new-product-img')[0].click();
        }).css('cursor','pointer')
        $('.add-new-item-modal .product-img').parent().children('.font-weight-bold').fadeIn(0)
        $('.add-new-item-modal input').prop('readonly',false)
        $('.add-new-category-btn').fadeIn(0)
    }
}

function openProductDesc(product, category) {
    productFields = Object.keys(product)
    $('.add-new-item-modal select[name="categoryName"]').append(`<option value="${category}">${category}</option>`).prop('disabled', true);
    productFields.forEach(field => {
        $(`.add-new-item-modal input[name="${field}"]`).val(product[field])
    });
    $('.add-new-item-modal').removeClass('hide')
    ProductImgCmd("show", `/adminUploads/products/img/${product.productImg}`)
}

// add new product
$('.add-new-item-modal .product-info form').on('submit', (e) => {
    e.preventDefault()
    data = _.object($('.add-new-item-modal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    console.log($("#new-product-img")[0].files[0])
    data['productImg'] = $("#new-product-img")[0].files[0]
    if (data['productImg'] == undefined) {
        $('.add-new-item-modal .error').html('Please select product image')
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
});
