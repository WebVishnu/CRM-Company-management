$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
searchInput.on('keyup', (e) => {
    e.preventDefault();
    if (searchInput.val() != "") {
        filterVouchers(`query=${searchInput.val().replaceAll("/", "-")}`)
    } else {
        checkFilters()
    }
})
// open voucher details model
function openVoucherDetails(voucher) {
    $('body , html').css('overflow-y', 'hidden')
    keyboardJS.bind('esc', (e) => { closeVoucherDetails() });
    $('.voucher-details-container').fadeIn(100).attr("tabindex", -1).focus().css('overflow-y', 'auto')
    $('.page-title').css('left', '0em')
    keys = _.keys(voucher)
    dispatchDetailsKeys = _.keys(voucher.dispatchDetails)
    //dispatch details
    $('#dispatchDOmodal input[name="DOid"]').val(voucher._id)
    if (voucher.dispatchDetails.dispatchStatus === 'Dispatched') {
        $('.dispatch-details-container').removeClass('hide d-none')
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
    // dispatch details
    for (let i = 0; i < dispatchDetailsKeys.length; i++) {
        const key = dispatchDetailsKeys[i];
        $(`.voucher-details-container input[name="${key}"]`).val(voucher.dispatchDetails[key])
        $(`.voucher-details-container textarea[name="${key}"]`).val(voucher.dispatchDetails[key])
    }
    // product details
    productsData = ``
    const products = voucher.products
    total = 0; advanceAmt = 0
    voucher.advancePayment.forEach(payment => {
        advanceAmt += parseInt((payment.advanceAmount != "")?payment.advanceAmount:0)
    });
    for (let i = 0; i < voucher.products.length; i++) {
        total += parseInt(products[i].grossTotal)
        productsData += `
        <tr>
            <td class="px-3">${products[i].productName}</td>
            <td class="px-3">${products[i].serialNum}</td>
            <td class="px-3">${products[i].qty} ${products[i].unit}</td>
            <td class="px-3">${products[i].rate}</td>
            <td class="px-3">${products[i].amount}</td>
            <td class="px-3" style="position:relative;width:4.5em;">
                ${products[i].gstRate} %
            </td>
            <td class="px-3">${products[i].totalGst}</td>
            <td class="px-3">${products[i].grossTotal}</td>
        </tr>`
    }
    $('.allProductsTbody').html(productsData)
    $('.totalAmount').html(`${total} &nbsp;&nbsp;&nbsp;<span class="text-secondary"> Due : ₹ </span> ${((total - advanceAmt) >= 0) ? (total - advanceAmt) : "Negative"}`)
    // advance payments
    if (voucher.advancePaymentReceived != "false") {
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
            total += parseInt(payment.advanceAmount)
            advanceData += `
                <tr>
                    <td class="text-capitalize">${payment.mode}  ${(payment.mode == "cash") ? '<i class="bi bi-cash-coin mx-2 text-success"></i>' : ""}</td>
                    <td>${payment.advanceDate}</td>
                    <td>${payment.advanceAmount}</td>
                </tr>`
        }
        $('.advanceEntryTbody').html(advanceData)
        $('.totalAdvncSpan').html(total)
    } else {
        $('.advance-payment-container').fadeOut(0)
        $('.advance-payment-heading').html('No advance Payment received').addClass('my-5')

    }
}
filterVouchers("admin")
// print data to table
function printAllVouchers(v) {
    if (v.length != 0) {
        $('.error').addClass('hide').html("")
        $('.delivery-order-table table').removeClass("hide")
        tempData = ``
        tempDate = ``
        for (let i = v.length - 1; i >= 0; i--) {
            const voucher = v[i];
            if (tempDate != `${voucher.createdBy.createdOn}`) {
                tempData += `<h5 class="view-details-divider" style="background-color: #f7f8fa;">${(voucher.createdBy.createdOn == moment().format('DD/MM/YYYY')) ? "Today" : voucher.createdBy.createdOn}</h5>`
                tempDate = `${voucher.createdBy.createdOn}`
            }
            totalAmount = 0; advance = 0; due = 0
            voucher.products.forEach(products => {
                totalAmount += parseInt(products.grossTotal)
            });
            if (voucher.advancePaymentReceived !== "false") {
                voucher.advancePayment.forEach(adv => {
                    advance += parseInt(adv.advanceAmount)
                });
            }
            tempData += `
                    <tr class="tb-row" onclick='openVoucherDetails(${JSON.stringify(voucher)})'>
                       <td data-label="Voucher number" class="text-truncate">${voucher.voucherNum}</td>
                       <td data-label="Created by" class="text-truncate">${voucher.createdBy.adminName}</td>
                       <td data-label="Order date" class="text-truncate">${voucher.orderDate}</td>
                       <td data-label="Total Amt." class="text-truncate">${totalAmount}</td>
                       <td data-label="Advance" class="text-truncate text-uppercase">${advance}</td>
                       <td data-label="Due amount" class="text-truncate">${((totalAmount - advance) > 0) ? `<span class="text-danger">${totalAmount - advance}</span>` : `<span class="text-success">0</span>`}</td>
                       <td data-label="Dispatch status" class="text-truncate"><span data-dispatch-status="${voucher.dispatchDetails.dispatchStatus}">${voucher.dispatchDetails.dispatchStatus}</span></td>
                    </tr>`
        }
        $('#all-delivery-voucher-tbody').html(tempData)
    } else {
        $('.error').removeClass('hide').html("No results found")
        $('.delivery-order-table table').addClass("hide")
    }
}

// filter vouchers 
async function filterVouchers(filter) {
    $('.loading-spinner').removeClass('hide')
    await axios.get(`/api/v1/vitco-impex/filter/delivery-order/${filter}`)
        .then((res) => {
            if (res.data.success) {
                $('.loading-spinner').addClass('hide')
                printAllVouchers(res.data.vouchers)
            }
        }).catch((e) => {
            $('.loading-spinner').html('We found some error')
        })
}
// check if there is any filter 
function checkFilters() {
    if ($('.my-voucher-pill').hasClass('active')) {
        filterVouchers("admin")
    } else if ($('.all-voucher-pill').hasClass('active')) {
        filterVouchers("all")
    }
}


// close voucher details
function closeVoucherDetails() {
    $('body , html').css('overflow-y', 'auto')
    $('.voucher-details-container').fadeOut(100).css('overflow-y', 'hidden')
    $('.page-title').css('left', '-1.2em')
    $('.advance-payment-container').fadeIn(0)
    $('.advance-payment-heading').html('Advance Payments')
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
    data = _.object($('#dispatchDOmodal form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    axios.post('/api/v1/vitco-impex/voucher/delivery-order/dispatch', data).then((res) => {
        if (res.data.success) {
            $('#dispatchDOmodal form .form-group').addClass('hide')
            $('#dispatchDOmodal .modal-footer').addClass('hide')
            $('#dispatchDOmodal .modal-body').addClass('d-flex justify-content-center')
            $('#dispatchDOmodal img').removeClass('hide')
            openVoucherDetails(res.data.voucher)
            checkFilters()
        }
    }).catch((e) => {
        console.log(e)
    })
})