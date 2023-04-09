// GLOBAL
let currentSignaturePad = 1

// shortcuts
keyboardJS.bind('ctrl + q', (e) => {
    addNewProduct()
});
const adminSignaturePad = new SignaturePad(document.querySelector("#adminSignaturePad"));
// const passedBySignaturePad = new SignaturePad(document.querySelector("passed-by-signature-pad"));
const receivedBySignaturePad = new SignaturePad(document.querySelector("#receivedBySignaturePad"));

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
$('#createNewDo').on('submit', (e) => { submitForm("submit", e) })
function submitForm(cmd, e) {
    if (cmd == "submit") {
        e.preventDefault()
    }
    advanceTb = $('.advanceEntryTbody')
    table = $('#allProductsTable tbody')
    if ($('.allProductsTbody tr').length == 0) {
        $('.error').html("")
        setTimeout(() => {
            $('.error').html("please add a product to the list")
        }, 200);
        $('html, body').animate({ scrollTop: $("#allProductsTable").offset().top - 20 * 16 }, 500);
    }
    // else if (parseFloat($('.totalAmount').html()) < parseFloat($('.totalAdvncSpan').html())) {
    //     $('.error').html("Advance payment can't be more than " + parseFloat($('.totalAmount').html()))
    // } 
    else if ($('.mode-of-advance-payment').val() == "null") {
        $('.error').html("")
        setTimeout(() => {
            $('.error').html("please choose the mode of payment")
        }, 200);
        // } else if ($('input').filter('[required]:visible').val() == "" || $('textarea').filter('[required]:visible').val() == "" || $('.required').val()=="") {
        //     $('.error').html("")
        //     setTimeout(() => {
        //         $('.error').html("Fill the form correctly")
        //     }, 200);
    } else {
        error = false
        for (let i = 1; i <= $('.signature-container .signature-pad').length; i++) {
            canvas = $(`.signature-container .section-${i} canvas`)
            if (eval(canvas.attr("id")).isEmpty()) {
                error = true
                break;
            }
        }
        if (!error) {
            // basic data
            var data = $('#createNewDo').serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            // products 
            data["products"] = []
            for (let i = 0; i <= $('#allProductsTable tbody tr').length - 1; i++) {
                Gtd = table.children()[i].children // array of table data ( <td></td> ) of ( row = i )
                console.log(Gtd[5].children[0].value)
                data["products"].push({
                    productName: Gtd[0].children[1].value,
                    // serialNum: Gtd[1].children[0].value,
                    qty: Gtd[1].children[0].value,
                    unit: Gtd[2].children[0].value,
                    rate: Gtd[3].children[0].value,
                    amount: Gtd[4].children[0].value,
                    gstRate: Gtd[5].children[0].value,
                    totalGst: Gtd[6].children[0].value,
                    grossTotal: Gtd[7].children[0].value,
                })
                // serialNum: Gtd[1].children[0].value,
                //     qty: Gtd[2].children[0].value,
                //     unit: Gtd[3].children[0].value,
                //     rate: Gtd[4].children[0].value,
                //     amount: Gtd[5].children[0].value,
                //     gstRate: Gtd[6].children[0].value,
                //     totalGst: Gtd[7].children[0].value,
                //     grossTotal: Gtd[8].children[0].value,
            }
            // mode of payment
            data["advancePayment"] = []
            data["advancePaymentReceived"] = ($('.advanceDetailsCheckbox').prop('checked') == true) ? true : false
            for (let i = 0; i < $('.advanceEntryTbody tr').length; i++) {
                tempElement = advanceTb.children()[i].children
                data["advancePayment"].push({
                    mode: tempElement[0].children[0].value,
                    advanceDate: tempElement[1].children[0].value,
                    advanceAmount: tempElement[2].children[0].value,
                    paymentDetails: getAdvancePaymentDetails(i)
                })
            }
            submitBtn = $('button[type="submit"]')
            submitBtn.attr('type', 'button').html(`
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="sr-only">Loading...</span>
                </div>`)
            // submitting req
            axios.post('/api/v1/vitco-impex/voucher/delivery-order/new', data).then((res) => {
                if (res.data.success == true) {
                    if (cmd == "submit") {
                        location.reload();
                    } else if (cmd == "print") {
                        window.open(`/vitco-impex/vouchers/delivery-order/print/${res.data.id}`, "_blank");
                        location.reload();
                    }
                } else {
                    submitBtn.removeClass("bg-base-color").addClass("btn-danger").html("Error !")
                    $('.error').html('Please wait until it is resolved')
                }
            }).catch((err) => { console.log(err) })
        } else {
            $('.error').html("")
            setTimeout(async () => {
                $('.error').html("Please sign your report properly.")
            }, 200);
        }
    }
}


let advanceInputNum = 0
addMoreAdvInputs()
$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
// make advance total 
function totalAdvAmt() {
    total = 0
    for (var i = 0; i < $('.advance-money-input').length; i++) {
        let tempVal = parseFloat($('.advance-money-input')[i].value)
        if (tempVal != NaN) {
            total += tempVal
        }
    }
    $('.totalAdvncSpan').html(total)
}

// get advance payment details
function getAdvancePaymentDetails(index) {
    val = $(`tr[data-advance-row="${index}"] td:nth-child(1) select`).val()
    if (val == "others") {
        return { others: $(`tr[data-advance-row="${index}"] td:nth-child(5) input`).val() }

    } else { return {} }
}

//add more advance payment inputs
function tempFunction(ele, advIn) {
    if ($(ele).val() == 'others') {
        $('.other-advance-head').removeClass('hide');
        $(`td[data-other-inp-row=${advIn}]`).removeClass('hide');
    } else {
        $(`td[data-other-inp-row=${advIn}]`).addClass('hide');
    }
}

async function addMoreAdvInputs() {
    $('.advanceEntryTbody').append(`
        <tr data-advance-row="${advanceInputNum}">
            <td>
                <select class="form-select shadow-none mode-of-advance-payment"
                onchange="tempFunction($(this),${advanceInputNum})">
                    <option value="cash" selected>Cash</option>
                    <option value="bank" >Bank</option>
                    <option value="upi">UPI </option>
                    <option value="others" >Others</option>
                </select>
            </td>
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
            <td class="hide adv-others-input" data-other-inp-row=${advanceInputNum}> <input class="form-control others-advance-input border-0 shadow-none" type="text"></td>
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
    qtyInput = $(`tr[data-product-row="${row}"] input.qty`)
    rateInput = $(`tr[data-product-row="${row}"] input.rate`)
    amountInput = $(`tr[data-product-row="${row}"] input.amount`)
    let amount = 0
    if (qtyInput.val() != "" && rateInput.val() != "") {
        amount = parseFloat(qtyInput.val()) * parseFloat(rateInput.val())
        amountInput.val(parseFloat(amount.toFixed(4))).trigger("change")
        getTotalSingleProduct(row)
    }
}
// make total count for single product
function getTotalSingleProduct(row) {
    totalInput = $(`tr[data-product-row="${row}"] input.totalPrice`)
    amountInput = $(`tr[data-product-row="${row}"] input.amount`)
    gstInput = $(`tr[data-product-row="${row}"] select.gstRate`)
    gstValInput = $(`tr[data-product-row="${row}"] input.totalGst`)
    if (amountInput.val() != "" && gstInput.val() != "") {
        totalGst = (parseFloat(amountInput.val()) * (parseFloat(gstInput.val()) / 100))
        gstValInput.val(parseFloat(totalGst.toFixed(4)))
        if (gstInput.val() == "0") {
            totalInput.val(parseFloat(amountInput.val())).trigger("change")
        } else {
            totalInput.val(parseFloat((parseFloat(totalGst) + parseFloat(amountInput.val())).toFixed(4))).trigger("change")
        }
    }
}



// make advance total 
function printTotalAmount() {
    total = 0
    for (var i = 0; i < $(`tr input.totalPrice`).length; i++) {
        let tempVal = parseFloat($(`tr input.totalPrice`)[i].value)
        if (tempVal != NaN) {
            total += tempVal
        }
    }
    $('.totalAmount').html(parseFloat(total.toFixed(4)))
}
// add new product
async function addNewProduct() {
    $('.add-product-section small').fadeOut(0)
    $('.add-product-section > .d-flex').removeClass('justify-content-between').addClass('justify-content-end')
    productCursor++
    //<td class="p-1">
    //    <input required type="text" class="product-details-input required specification w-100 form-control shadow-none">
    //</td>
    $('.allProductsTbody').append(`
        <tr class="product-tooltip" data-product-row="${productCursor}">
                <td class="p-1">
                    <span class="product-tooltiptext cursor-pointer" onclick="deleteProduct(${productCursor})"><i class="bi bi-trash3-fill"></i> Delete Row</span>
                    <input required type="text" class="product-details-input productName required w-100 form-control shadow-none">
                </td>
                <td class="p-1">
                    <input required type="number" class="product-details-input required qty w-100 form-control shadow-none" onkeyup="getAmountSingleProduct(${productCursor})">
                </td>
                <td class="p-1">
                    <input required type="text" hidden value="Pcs" class="required">
                    <select style="width: 5em!important;" onchange="$(this).parent().children('input').val($(this).val())" class="form-select w-100 border-0" aria-label="Default select example">
                      <option selected value="Pcs">Pcs</option>
                      <option value="Kg">Kg</option>
                      <option value="Ltr">Ltr</option>
                      <option value="Mtr">Mtr</option>
                      <option value="Bundle">Bundle</option>
                      <option value="Set">Set</option>
                    </select>
                </td>
                <td class="p-1">
                    <input required type="number" class="product-details-input required rate w-100 form-control shadow-none" onkeyup="getAmountSingleProduct(${productCursor})">
                </td>
                <td class="p-1">
                    <input required readonly type="number" class="product-details-input required amount w-100 form-control shadow-none" onchange="getTotalSingleProduct(${productCursor})">
                </td>
                <td class="p-1">
                    <input required type="text" class="required" hidden value="12">
                    <select style="width: 5em!important;" onchange="getTotalSingleProduct(${productCursor})" class="form-select w-100 border-0 gstRate" onchange="getTotalSingleProduct(${productCursor})">
                        <option selected value="18">18%</option>
                        <option  value="12">12%</option>
                        <option value="0">0%</option>
                    </select>
                </td>
                <td class="p-1">
                    <input required readonly type="text" class="product-details-input required totalGst w-100 form-control shadow-none">
                </td>
                <td class="p-1">
                    <input required readonly type="text" class="product-details-input totalPrice required total w-100 form-control shadow-none" onchange="printTotalAmount()">
                </td>
            </tr>`)


}


// next signature pad
function nextSignaturePad() {
    $(`.signature-container .section-${currentSignaturePad}`).fadeOut(0)
    currentSignaturePad++
    $(`.signature-container .section-${currentSignaturePad}`).fadeIn(0)
    // changing title
    $('.signature-modal #signature-modal-title').html($(`.signature-container .section-${currentSignaturePad}`).data("pad-title"))
    if ($(`.signature-container .section-${currentSignaturePad + 1}`).length == 0) {
        $('.submit-signature-btn').html("Save").attr("onclick", "submitSignature()")
    } else {
        $('.submit-signature-btn').html("Next")
    }
    if (currentSignaturePad > 1) {
        $('.previous-signature-pad').fadeIn(0)
    } else {
        $('.previous-signature-pad').fadeOut(0)

    }
}
// previous signature pad
function previousSignaturePad() {
    $('.submit-signature-btn').html("Save").attr("onclick", "nextSignaturePad()")
    $('.submit-signature-btn').html("Next")
    $(`.signature-container .section-${currentSignaturePad}`).fadeOut(0)
    currentSignaturePad--
    $(`.signature-container .section-${currentSignaturePad}`).fadeIn(0)
    // changing title
    $('.signature-modal #signature-modal-title').html($(`.signature-container .section-${currentSignaturePad}`).data("pad-title"))
    if (currentSignaturePad > 1) {
        $('.previous-signature-pad').fadeIn(0)
    } else {
        $('.previous-signature-pad').fadeOut(0)
    }
}
// clear signature 
function clearSignaturePad() {
    eval($(`.signature-container .section-${currentSignaturePad} canvas`).attr("id")).clear()
}

// submit signature to signature inputs
function submitSignature() {
    $('.add-signature-btn').html("Edit Signature")
    $('.signature-modal .close').click();
    for (let i = 1; i <= currentSignaturePad; i++) {
        canvas = $(`.signature-container .section-${i} canvas`)
        data = eval(canvas.attr("id")).toDataURL();
        $(`input[name="${canvas.attr("id")}"]`).val(data)
    }
}

// auto complete form
function autoComplete(ele, key) {
    // axios.get(`/api/v1/voucher/delivery-order/find/${key}/${(ele[0].value == "")?"@#$":ele[0].value}`).then((res) => {
    //     console.log(res.data)
    //     if(res.data.success){

    //     }
    // })
}

// MEDIA QUERIES
if (Modernizr.mq('(max-width: 363px)')) {
    $('.signature-pad')[0].setAttribute("width", 250)
} else if (Modernizr.mq('(max-width: 413px)')) {
    $('.signature-pad')[0].setAttribute("width", 300)
} else if (Modernizr.mq('(max-width: 460px)')) {
    $('.signature-pad')[0].setAttribute("width", 350)
} else if (Modernizr.mq('(max-width: 767px)')) {
    $('.signature-pad')[0].setAttribute("width", 400)
}