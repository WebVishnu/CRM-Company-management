// GLOBAL
gotAllVouchers = false
dataNum = 20
totalVouchers = 0



$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });

keyboardJS.bind('r', (e) => {
    e.preventDefault()
    refreshVouchers()
});
keyboardJS.bind('esc', (e) => {
    e.preventDefault()
    closeVoucherDetails()
});
// when search
searchInput.on('keyup', (e) => {
    e.preventDefault();
    if (searchInput.val() != "") {
        $('.page-right-title .nav-link').removeClass("active")
        $('.got-all-data').addClass('hide')
        filterVouchers(`query=${searchInput.val().replaceAll("/", "-")}`, 0, 20)
    } else {
        $('.all-voucher-pill').addClass('active')
        $('.got-all-data').removeClass('hide')
        gotAllVouchers = false
        dataNum = 20
        filterVouchers(checkFilters(), totalVouchers - dataNum, totalVouchers)
    }
})

// laod data when scrolled
$(window).on('scroll', () => {
    if (totalVouchers - dataNum > 0) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            if (searchInput.val() == "" && !gotAllVouchers) {
                $('.got-all-data').addClass('hide')
                filterVouchers(checkFilters(), totalVouchers - dataNum, totalVouchers)
                dataNum += 20
            }
        }
    } else {
        gotAllVouchers = true
        $('.got-all-data').removeClass('hide')
    }
})

// open voucher details model
function openVoucherDetails(voucher) {
    $('body , html').css('overflow-y', 'hidden')
    $('.voucher-details-container').fadeIn(100).attr("tabindex", -1).focus().css('overflow-y', 'auto')
    $('.print-report-btn').attr("href", `/vitco-impex/vouchers/delivery-order/print/${voucher._id}`)
    $('.page-title').css('left', '0em')
    $("input[name='paymentStatus']#paymentStatusDR").prop("checked", true);
    $('#paymentModal table tbody').html(advanceInputTBhtml)
    $("#totalPayment").html("TOTAL: ₹ 0.00")
    $('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
    keys = _.keys(voucher)
    // setting voucher number on the heading 
    $(".voucher-details-container > h3 span").html(`#${voucher.voucherNum}`)
    DOeditMenu('close')
    //dispatch details
    $('#dispatchDOmodal input[name="DOid"]').val(voucher._id)
    if (voucher.dispatchDetails.dispatchStatus === 'Dispatched') {
        $('.dispatch-details-container').removeClass('hide d-none')
        dispatchDetailsKeys = _.keys(voucher.dispatchDetails)
        // dispatch details
        for (let i = 0; i < dispatchDetailsKeys.length; i++) {
            const key = dispatchDetailsKeys[i];
            $(`.voucher-details-container .dispatch-details-container input[name="${key}"]`).val(voucher.dispatchDetails[key])
            $(`.voucher-details-container .dispatch-details-container textarea[name="${key}"]`).val(voucher.dispatchDetails[key])
        }

        $('.dispatch-details-container input[name="adminName"]').val(voucher.dispatchDetails.adminDetails.adminName)
        $('.voucher-details-container button.dispatch-btn')
            .html('<i class="bi bi-patch-check-fill mx-2"></i>Dispatched')
            .attr({ 'data-toggle': '', 'data-target': '', 'style': 'background-color:#00bc6d!important' })
    } else {
        $('.dispatch-details-container').addClass('hide d-none')
        $('.dispatch-details-container input[name="adminName"]').val('')
        $('.voucher-details-container button.dispatch-btn')
            .html('<i class="bi bi-truck mx-2"></i>Dispatch')
            .attr({ 'data-toggle': 'modal', 'data-target': '#dispatchDOmodal', 'style': 'background-color:#dc3545!important' })
    }
    // admin details 
    $('#adminName').val(voucher.createdBy.adminName)
    $('#createdOn').val(voucher.createdBy.createdOn)
    // all details
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        $(`.voucher-details-container input[name="${key}"]`).val(voucher[key])
        $(`.voucher-details-container textarea[name="${key}"]`).val(voucher[key])
    }

    // product details
    productsData = ``
    const products = voucher.products
    totalAmount = 0; advance = 0
    voucher.advancePayment.forEach(payment => {
        advance += (parseInt(payment.advanceAmount)) ? parseInt(payment.advanceAmount) : 0
    });
    let noSr = 0 // -- no seriel number --> checking if any column contains seriel number
    $("#dispatchDOmodal .voucher-details-products-container").html("")
    for (let i = 0; i < voucher.products.length; i++) {
        totalAmount += parseInt(products[i].grossTotal)
        productsData += `
        <tr>
            <td class="px-3"><textarea class="input-transparent pe-none w-100" style="max-width: 8em;">${products[i].productName}</textarea></td>
            ${(products[i].serialNum) ? `<td class="px-3 voucher-details-sr-col"><textarea style="max-width: 8em;" class="input-transparent pe-none">${products[i].serialNum}</textarea></td>` : ''}
            <td class="px-3">${products[i].qty}</td>
            <td class="px-3">${products[i].unit}</td>
            <td class="px-3">${products[i].rate}</td>
            <td class="px-3">${products[i].amount}</td>
            <td class="px-3" style="position:relative;width:4.5em;">${((products[i].totalGst / products[i].amount) * 100).toFixed(0)} %</td>
            <td class="px-3">${products[i].totalGst}</td>
            <td class="px-3">${products[i].grossTotal}</td>
        </tr>`
        $("#dispatchDOmodal .voucher-details-products-container").append(`
        <div class="row py-3" style="border-bottom: 1px solid #cbcbcb;">
            <div class="col-md-4">
                <p style="line-height: 12px;">
                    <small> ${products[i].productName} <br> Qty: ${products[i].qty}</small>
                </p>
            </div>
            <div class="col-md-8 voucher-details-product-sr-num-input-container-${i}">
                <input placeholder="serial no. ${i + 1}" onkeyup="srInputChange($(this))" type="text" class="form-control shadow-none voucher-details-product-sr-num-input-${i} product-input-col-1-row-${i}" data-input-col="1" data-input-row="${i}">
                <div style="display: flex;width: 100%;overflow: auto;" class="voucher-details-product-qty-num-${i} custom-scrollbar">
                </div>
            </div>
        </div>`)
        qty = (parseInt(products[i].qty) < 100) ? parseInt(products[i].qty) : 100
        if (qty != 1) {
            $(`#dispatchDOmodal .voucher-details-product-qty-num-${i}`).append(`<button onclick="openSrInput(${i},1)" class="btn bg-text-base-color  text-light shadow-none py-0 px-2 m-1 row-${i}-col-1" >1</button>`)
            for (let j = 1; j < qty; j++) {
                $(`#dispatchDOmodal .voucher-details-product-sr-num-input-container-${i} input:nth-child(${j})`).after(`<input placeholder="serial no. ${j + 1}" onkeyup="srInputChange($(this))" type="text" class="form-control shadow-none voucher-details-product-sr-num-input-${i} product-input-col-${j + 1}-row-${i}" style="display:none;" data-input-col="${j + 1}" data-input-row="${i}">`)
                $(`#dispatchDOmodal .voucher-details-product-qty-num-${i}`).append(`<button onclick="openSrInput(${i},${j + 1})" class="btn bg-text-base-color text-light shadow-none py-0 px-2 m-1 row-${i}-col-${j + 1}" >${j + 1}</button>`)
            }
        }
        if (products[i].serialNum == "") noSr++;
    }
    // printing all the products 
    $('.allProductsTbody').html(productsData)
    $('textarea').autoResize();
    // checking if seriel num exists then add th element otherwise remove it
    if (noSr == voucher.products.length) {
        // there is no seriel num
        $('.voucher-details-sr-col').remove()
    } else {
        if ($('#allProductsTable thead th').length == 8) {
            $('#allProductsTable thead th:first-child').after(`<th scope="col" class="voucher-details-sr-col">Serial No.</th>`)
        }
    }
    $('.voucher-details-container .totalAmount').html(`${totalAmount} &nbsp;&nbsp;&nbsp; Balance : ${(totalAmount < advance) ? `<span class="text-success">₹ ${advance - totalAmount} Cr</span>` : ((totalAmount - advance) == 0) ? `<i class="bi bi-check-circle-fill text-success"></i>` : `<span class="text-danger">₹ ${totalAmount - advance} Dr</span>`}`)
    $('#paymentModal .totalAmount').html(`STATUS: ₹ ${(totalAmount < advance) ? `<span class="text-success dueAmt">${advance - totalAmount}</span> Cr` : `<span class="text-danger dueAmt">${totalAmount - advance}</span> Dr`}`)
    // advance payments
    if (voucher.advancePaymentReceived != "false") {
        console.log(`num:#${voucher.voucherNum} result: ${voucher.advancePaymentReceived}`)
        $('.advance-payment-container').fadeIn(0).removeClass('mb-5 pb-5')
        $('.advance-payment-heading').html('Payments').removeClass('my-5')
        advanceData = ``
        // mode of payment details
        modeDetails = voucher.paymentModeDetails
        if (modeDetails) {
            $('.mode-of-payment').html(voucher.advancePayment[0].mode)
            paymentData = ``
            Object.keys(modeDetails).forEach(key => {
                paymentData += `<label class="text-capitalize">${key}</label>
                                <input type="text" value="${modeDetails[key]}" class="form-control shadow-none bg-transparent" placeholder="Enter ${key}">`
            });
            $('.advancePaymentModeDetails').html(paymentData)
        }
        // advance payment table
        total = 0
        for (let i = 0; i < voucher.advancePayment.length; i++) {
            const payment = voucher.advancePayment[i];
            if (payment.advanceAmount != "") {
                total += (parseInt(payment.advanceAmount)) ? parseInt(payment.advanceAmount) : 0
                advanceData += `
                    <tr>
                        <td class="text-capitalize">${payment.mode}  ${(payment.mode == "cash") ? '<i class="bi bi-cash-coin mx-2 text-success"></i>' : ""}</td>
                        <td>${payment.advanceDate}</td>
                        <td>${(parseInt(payment.advanceAmount)) ? parseInt(payment.advanceAmount) : 0}</td>
                    </tr>`
            }
        }
        $('.advanceEntryTbody').html(advanceData)
        $('.totalAdvncSpan').html(total)

    } else {
        $('.advance-payment-container').fadeOut(0)
        $('.advance-payment-heading').html('No advance Payment received').addClass('my-5')

    }
}

filterVouchers("all", 0, 0).then(res => { totalVouchers = res; filterVouchers("admin", totalVouchers - dataNum, totalVouchers); dataNum += 20 })

// print data to table
function printAllVouchers(v) {
    if (v.length != 0) {
        $('.delivery-order-table .error').addClass('hide').html("")
        $('.delivery-order-table table').removeClass("hide")
        tempData = ``
        tempDate = ``
        for (let i = v.length - 1; i >= 0; i--) {
            const voucher = v[i];
            if (tempDate != `${voucher.createdBy.createdOn}`) {
                tempData += `<h5 class="view-details-divider d-flex" style="background-color: #f7f8fa;min-width:17em">${(voucher.createdBy.createdOn == moment().format('DD/MM/YYYY')) ? `Today ( ${moment().format('DD/MM/YYYY')} )` : voucher.createdBy.createdOn}</h5>`
                tempDate = `${voucher.createdBy.createdOn}`
            }
            totalAmount = 0; advance = 0; due = 0
            voucher.products.forEach(products => {
                totalAmount += parseInt(products.grossTotal)
            });
            if (voucher.advancePaymentReceived !== "false") {
                voucher.advancePayment.forEach(adv => {
                    advance += (parseInt(adv.advanceAmount)) ? parseInt(adv.advanceAmount) : 0
                });
            }
            tempData += `
                    <tr class="tb-row" onclick='openVoucherDetails(${JSON.stringify(voucher)})'>
                       <td data-label="Voucher number" class="text-truncate">${voucher.voucherNum}</td>
                       <td data-label="Created by" class="text-truncate">${voucher.consignee.replaceAll("'", "")}</td>
                       <td data-label="Order date" class="text-truncate">${voucher.orderDate}</td>
                       <td data-label="Total Amt." class="text-truncate">₹ ${totalAmount}</td>
                       <td data-label="Advance" class="text-truncate text-uppercase">₹ ${advance}</td>
                       <td data-label="Balance" class="text-truncate">${(totalAmount < advance) ? `<span class="text-success">₹ ${advance - totalAmount} Cr</span>` : ((totalAmount - advance) == 0) ? `<i class="bi bi-check-circle-fill text-success"></i>` : `<span class="text-danger">₹ ${totalAmount - advance} Dr</span>`}</td>
                       <td data-label="Dispatch status" class="text-truncate"><span data-dispatch-status="${voucher.dispatchDetails.dispatchStatus}">${voucher.dispatchDetails.dispatchStatus}</span></td>
                    </tr>`
        }
        $('#all-delivery-voucher-tbody').html(tempData)
    } else {
        $('.got-all-data').addClass('hide')
        $('.error').removeClass('hide').html("No results found")
        $('.delivery-order-table table').addClass("hide")
    }
}

// filter vouchers 
async function filterVouchers(filter, from, to) {
    $('.loading-spinner').removeClass('hide')
    data = 0
    if (!gotAllVouchers || filter.includes("query=")) {
        data = await axios.get(`/api/v1/vitco-impex/filter/delivery-order/${filter}/${from}/${to}`)
            .then((res) => {
                if (from == 0 && to == 0) {
                    return res.data.vouchers.length
                } else if (res.data.success) {
                    if (res.data.vouchers.length < 40 && !gotAllVouchers) {
                        $('.got-all-data').addClass('hide')
                    }
                    $('.loading-spinner').addClass('hide')
                    printAllVouchers(res.data.vouchers)
                }
            }).catch((e) => {
                $('.loading-spinner').html('We found some error, Please wait until it is resolved')
            })
    } else {
        gotAllVouchers = true
        $('.got-all-data').removeClass('hide')
    }
    return data
}
// check if there is any filter 
function checkFilters() {
    if ($('.my-voucher-pill').hasClass('active')) {
        return "admin"
    } else if ($('.all-voucher-pill').hasClass('active')) {
        return "all"
    }
}


// close voucher details
function closeVoucherDetails() {
    $('body , html').css('overflow-y', 'auto')
    $('.voucher-details-container').fadeOut(100).css('overflow-y', 'hidden')
    $('.page-title').css('left', '-1.2em')
    $('.advance-payment-container').fadeIn(0)
    $('.advance-payment-heading').html('Payments')
}

function refreshVouchers() {
    $('.got-all-data').addClass('hide')
    searchInput.val('')
    $('#all-delivery-voucher-tbody').html("")
    setTimeout(() => {
        gotAllVouchers = false
        filterVouchers(checkFilters(), totalVouchers - 20, totalVouchers)
        dataNum = 40
    }, 50);
}
// when dispatch modal opens clear it
$('#dispatchDOmodal').on('shown.bs.modal', function (e) {
    $('#dispatchDOmodal input[name="dispatchDate"]').val(moment().format('DD/MM/YYYY'))
    $('#dispatchDOmodal input[name="dispatchVehicleNum"]').val('')
    $('#dispatchDOmodal form .form-group').removeClass('hide')
    $('#dispatchDOmodal .modal-footer').removeClass('hide')
    $('#dispatchDOmodal .modal-body').removeClass('d-flex justify-content-center')
    $('#dispatchDOmodal img').addClass('hide')
})

// dispatch order
$('#dispatchDOmodal form').on('submit', (e) => {
    e.preventDefault()
    if ($('#dispatchDOmodal #dispatchVehicleNum').val() != '' || $('#dispatchDOmodal input[name="transporterID"]').val() != "") {
        data = _.object($('#dispatchDOmodal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
        axios.post('/api/v1/vitco-impex/voucher/delivery-order/dispatch', data).then((res) => {
            if (res.data.success) {
                $('#dispatchDOmodal form .form-group').addClass('hide')
                $('#dispatchDOmodal .modal-footer').addClass('hide')
                $('#dispatchDOmodal .modal-body').addClass('d-flex justify-content-center')
                $('#dispatchDOmodal img').removeClass('hide')
                openVoucherDetails(res.data.voucher)
                filterVouchers(checkFilters(), totalVouchers - dataNum, totalVouchers)
            }
        }).catch((e) => {
            console.log(e)
        })
    }
})

// submit After Payments 
function submitAP() {
    if ($("#paymentModal .advance-money-input").val() && $("#paymentModal .input-group.date input").val() !== "") {
        let afterPayments = []
        let total = parseFloat($("#totalPayment").html().replaceAll("₹ ", ''))
        if ($("input[name='paymentStatus']:checked").val() == 'cr') {
            $.each($('#paymentModal table tbody tr'), (key, row) => {
                afterPayments.push({
                    mode: row.children[0].children[0].value,
                    advanceDate: row.children[1].children[0].value,
                    advanceAmount: `-${row.children[2].children[1].value}`
                })
            })
        } else {
            $.each($('#paymentModal table tbody tr'), (key, row) => {
                afterPayments.push({
                    mode: row.children[0].children[0].value,
                    advanceDate: row.children[1].children[0].value,
                    advanceAmount: row.children[2].children[1].value
                })
            })
        }
        axios.post("/api/v1/voucher/delivery-order/add/after-payments", {
            DOid: $('#dispatchDOmodal input[name="DOid"]').val(),
            payments: afterPayments,
            total,
        }).then((res) => {
            $('#paymentModal').modal('hide')
            openVoucherDetails(res.data.voucher)
        }).catch(e => {
            console.log(e)
        })
    } else {
        $('#paymentModal .error').removeClass('hide').html("Please fill form correctly.")
    }
}


//choose and open seriel input
function openSrInput(row, col) {
    $(`#dispatchDOmodal .voucher-details-product-sr-num-input-${row}`).fadeOut(0);
    $(`#dispatchDOmodal .product-input-col-${col}-row-${row}`).fadeIn(0).focus();
}

// change the color when any seriel num is entred
function srInputChange(ele) {
    if (ele.val() != "") {
        $(`#dispatchDOmodal .row-${ele.data("input-row")}-col-${ele.data("input-col")}`).removeClass("bg-text-base-color").addClass("bg-secondary")
    } else {
        $(`#dispatchDOmodal .row-${ele.data("input-row")}-col-${ele.data("input-col")}`).addClass("bg-text-base-color").removeClass("bg-secondary")
    }
}