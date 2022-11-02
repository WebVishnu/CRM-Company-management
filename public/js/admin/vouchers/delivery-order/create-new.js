keyboardJS.bind('ctrl + q', (e) => {
    addNewProduct()
});

$.getJSON('/js/admin/vouchers/delivery-order/people.json', function (data) {
}).catch((e) => {
    console.log("error")
});
// enable tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
// enable popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
// ====================================================================================
// script
// mode of payment

$('.mode-of-advance-payment').on('change', () => {
    val = $('.mode-of-advance-payment').val()
    $('.mode-of-payment-details').addClass('d-none')
    // clear all first
    $('#upiId').val('')
    $('#otherAdvnc').val('')
    //==========
    if (val == "bank") {
        $('#upiId').val('')
    } else if (val == "upi") {
        $('.advance-upi-details').removeClass('d-none')
        $('.advance-upi-details input').prop("required", true)
    } else if (val == "others") {
        $('.advance-others-details').removeClass('d-none')
        $('.advance-others-details input').prop("required", true)
    }
})


// on form submit
$('form').on('submit', (e) => {
    if ($('.allProductsTbody tr').length == 0) {
        e.preventDefault()
        $('.error').html("please add a product to the list")
        $('html, body').animate({ scrollTop: $("#allProductsTable").offset().top - 20 * 16 }, 500);
    } else if ($('.mode-of-advance-payment').val() == "null") {
        e.preventDefault()
        $('.error').html("please choose the mode of payment")
    } else {
        e.preventDefault()
        // basic data
        var data = $('#createNewDo').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        // products 
        data["products"] = []
        table = $('#allProductsTable tbody')
        for (let i = 0; i < $('#allProductsTable tbody tr').length; i++) {
            tempElement = table.children(i).children().children(`input`)
            data["products"].push({
                productName: tempElement[0].value,
                specification: tempElement[1].value,
                qty: tempElement[2].value,
                rate: tempElement[3].value,
                amount: tempElement[4].value,
                gstRate: tempElement[5].value,
                totalGst: tempElement[6].value,
                grossTotal: tempElement[7].value,
            })
        }

        // mode of payment
        data["advancePayment"] = []
        let modeOfPayment = $('.mode-of-advance-payment').val()
        if (modeOfPayment != "not selected") {
            data["advancePayment"] = []
            data["advancePaymentReceived"] = true
            paymentModeDetails = {}
            advanceTb = $('.advanceEntryTbody')
            if (modeOfPayment === "upi") {
                paymentModeDetails["utrNum"] = $('#utrNum').val()
            } else if (modeOfPayment === "others") {
                paymentModeDetails["others"] = $('#otherAdvnc').val()
            }
            for (let i = 0; i < $('.advanceEntryTbody tr').length; i++) {
                tempElement = advanceTb.children(i).children().children(`input`)
                data["advancePayment"].push({
                    mode: modeOfPayment,
                    advanceDate: tempElement[0].value,
                    advanceAmount: tempElement[1].value,
                    paymentModeDetails,
                })
            }
        } else {
            data["advancePaymentReceived"] = false
        }
        submitBtn = $('button[type="submit"]')
        submitBtn.attr('type', 'button').html(`
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only">Loading...</span>
        </div>`)
        axios.post('/api/v1/vitco-impex/voucher/delivery-order/new', data).then((res) => {
            if (res.data.success == true) {
                location.reload();
            } else {
                submitBtn.removeClass("bg-base-color").addClass("btn-danger").html("Error !")
                $('.error').html('Please wait until it is resolved')
            }
        }).catch((err) => { console.log(err) })
    }
})


let advanceInputNum = 1
addMoreAdvInputs()
$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
// make advance total 
function totalAdvAmt() {
    total = 0
    for (var i = 0; i < $('.advance-money-input').length; i++) {
        let tempVal = parseInt($('.advance-money-input')[i].value)
        if (tempVal != NaN) {
            total += tempVal
        }
    }
    $('.totalAdvncSpan').html(total)
}
//add more advance payment inputs
async function addMoreAdvInputs() {
    $('.advanceEntryTbody').append(`
        <tr data-advance-row="${advanceInputNum}">
            <td class="input-group date">
                <input type="text" class="form-control" placeholder="dd/mm/yyyy">
                <div class="input-group-addon">
                    <span class="glyphicon glyphicon-th"></span>
                </div>
            </td>
            <td style="position:relative">
                <input type="number" maxlength="10" style="padding-left:30px" class="product-details-input advance-money-input w-100 form-control shadow-none" onkeyup="totalAdvAmt()">
                <i class="bi bi-currency-rupee" style="position:absolute;left:20px;top:30%"></i>
            </td>
            <td class="px-1">
                <button data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" type="button"
                    class="btn btn-danger shadow-none" onclick="deleteAdvInputs(${advanceInputNum})"><i class="bi bi-trash3-fill"></i></button>
            </td>
        </tr>`)
    $('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
    advanceInputNum++

}
// delete advance inputs
function deleteAdvInputs(row) {
    $(`tr[data-advance-row="${row}"]`).remove()
    totalAdvAmt()
}
//=============================== ======= ======= ======= ======= ======= =====
let productCursor = 0
// delete product
async function deleteProduct(row) {
    $(`tr[data-product-row="${row}"]`).remove()
    if ($('.allProductsTbody tr').length == 0) {
        $('.add-product-section small').fadeIn(0)
        $('.add-product-section > .d-flex').removeClass('justify-content-end').addClass('justify-content-between')
    }
    printTotalAmount()
}
// total amount for single product
function getAmountSingleProduct(row) {
    qtyInput = $(`tr[data-product-row="${row}"] td:nth-child(3) input`)
    rateInput = $(`tr[data-product-row="${row}"] td:nth-child(4) input`)
    amountInput = $(`tr[data-product-row="${row}"] td:nth-child(5) input`)
    let amount, qty, rate = 1
    if (qtyInput.val() != "" && rateInput.val() != "") {
        amount = parseInt(qtyInput.val()) * parseInt(rateInput.val())
        amountInput.val(amount).trigger("change")
        getTotalSingleProduct(row)
    }
}
// make total count for single product
function getTotalSingleProduct(row) {
    totalInput = $(`tr[data-product-row="${row}"] td:nth-child(8) input`)
    amountInput = $(`tr[data-product-row="${row}"] td:nth-child(5) input`)
    gstInput = $(`tr[data-product-row="${row}"] td:nth-child(6) input`)
    gstValInput = $(`tr[data-product-row="${row}"] td:nth-child(7) input`)
    if (amountInput.val() != "" && gstInput.val() != "") {
        totalGst = (parseInt(amountInput.val()) * parseInt(gstInput.val())) / 100
        gstValInput.val(totalGst)
        totalInput.val(parseInt(totalGst) + parseInt(amountInput.val())).trigger("change")
    }
}

// make advance total 
function printTotalAmount() {
    total = 0
    for (var i = 0; i < $(`tr td:nth-child(8) input`).length; i++) {
        let tempVal = parseInt($(`tr td:nth-child(8) input`)[i].value)
        if (tempVal != NaN) {
            total += tempVal
        }
    }
    $('.totalAmount').html(total)
}
// add new product
async function addNewProduct() {
    $('.add-product-section small').fadeOut(0)
    $('.add-product-section > .d-flex').removeClass('justify-content-between').addClass('justify-content-end')
    productCursor++


    $('.allProductsTbody').append(`
        <tr class="product-tooltip" data-product-row="${productCursor}">
                <td class="p-1">
                    <span class="product-tooltiptext cursor-pointer" onclick="deleteProduct(${productCursor})"><i class="bi bi-trash3-fill"></i> Delete Row</span>
                    <input required type="text" class="product-details-input productName w-100 form-control shadow-none">
                </td>
                <td class="p-1">
                    <input required type="text" class="product-details-input specification w-100 form-control shadow-none">
                </td>
                <td class="p-1">
                    <input required type="number" class="product-details-input qty w-100 form-control shadow-none" onkeyup="getAmountSingleProduct(${productCursor})">
                </td>
                <td class="p-1">
                    <input required type="number" class="product-details-input rate w-100 form-control shadow-none" onkeyup="getAmountSingleProduct(${productCursor})">
                </td>
                <td class="p-1">
                    <input required readonly type="number" class="product-details-input amount w-100 form-control shadow-none" onchange="getTotalSingleProduct(${productCursor})">
                </td>
                <td class="p-1" style="position:relative;width:4.5em;">
                    <input required type="number" style="padding-right:30px;" class="product-details-input gstRate w-100 form-control shadow-none" onkeyup="getTotalSingleProduct(${productCursor})">
                    <i class="bi bi-percent" style="position:absolute;right:10px;top:25%"></i>
                </td>
                <td class="p-1">
                    <input required readonly type="text" class="product-details-input totalGst w-100 form-control shadow-none">
                </td>
                <td class="p-1">
                    <input required readonly type="text" class="product-details-input total w-100 form-control shadow-none" onchange="printTotalAmount()">
                </td>
            </tr>`)

}