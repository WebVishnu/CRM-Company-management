
$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
// open voucher details model
function openVoucherDetails(voucher) {
    $('body , html').css('overflow-y', 'hidden')
    keyboardJS.bind('esc', (e) => { closeVoucherDetails() });
    $('.voucher-details-container').fadeIn(100).attr("tabindex", -1).focus().css('overflow-y', 'auto')
    $('.page-title').css('left', '0em')
    keys = _.keys(voucher)
    dispatchDetailsKeys = _.keys(voucher.dispatchDetails)
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
    total = 0
    for (let i = 0; i < voucher.products.length; i++) {
        total += parseInt(products[i].grossTotal)
        productsData += `
        <tr>
            <td class="p-1">${products[i].productName}</td>
            <td class="p-1">${products[i].specification}</td>
            <td class="p-1">${products[i].qty}</td>
            <td class="p-1">${products[i].rate}</td>
            <td class="p-1">${products[i].amount}</td>
            <td class="p-1" style="position:relative;width:4.5em;">
                ${products[i].gstRate} %
            </td>
            <td class="p-1">${products[i].totalGst}</td>
            <td class="p-1">${products[i].grossTotal}</td>
        </tr>`
    }
    $('.allProductsTbody').html(productsData)
    $('.totalAmount').html(total)
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
                    <td>${payment.advanceDate}</td>
                    <td>${payment.advanceAmount}</td>
                </tr>`
        }
        $('.advanceEntryTbody').html(advanceData)
        $('.totalAdvncSpan').html(total)
    } else {
        $('.advance-payment-container').fadeOut(0)
        $('.advance-payment-heading').html('No advance Payment received')

    }
}
filterVouchers("admin")
// print data to table
function printAllVouchers(v) {
    if (v.length != 0) {
        tempData = ``
        tempDate = ``
        for (let i = v.length - 1; i >= 0; i--) {
            const voucher = v[i];
            if (tempDate != `${voucher.createdBy.createdOn}`) {
                tempData += `<h5 class="view-details-divider" style="background-color: #f7f8fa;">${(voucher.createdBy.createdOn == moment().format('L'))?"latest":voucher.createdBy.createdOn}</h5>`
                tempDate =  `${voucher.createdBy.createdOn}`
            }
            total = 0
            voucher.products.forEach(products => {
                total += parseInt(products.grossTotal)
            });
            tempData += `
                    <tr class="tb-row" onclick='openVoucherDetails(${JSON.stringify(voucher)})'>
                       <td data-label="Voucher number" class="text-truncate">${voucher.voucherNum}</td>
                       <td data-label="Created by" class="text-truncate">${voucher.createdBy.adminName}</td>
                       <td data-label="Order date" class="text-truncate">${voucher.orderDate}</td>
                       <td data-label="Total Amt." class="text-truncate">${total}</td>
                       <td data-label="Advance" class="text-truncate text-uppercase">${(voucher.advancePaymentReceived == "true")?`<span class="badge badge-success">${voucher.advancePaymentReceived}</span>`:`<span class="badge badge-danger">${voucher.advancePaymentReceived}</span>`}</td>
                       <td data-label="Dispatched By" class="text-truncate">${voucher.dispatchDetails.dispatchedBy}</td>
                    </tr>`
        }
        $('#all-delivery-voucher-tbody').html(tempData)
    } else {
        $('.delivery-order-table table').replaceWith("<h2 class='text-secondary text-center mt-5'>No vouchers found</h2>")
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
        }).catch((e)=>{
            $('.loading-spinner').html('We found some error')
        })
}



// close voucher details
function closeVoucherDetails() {
    $('body , html').css('overflow-y', 'auto')
    $('.voucher-details-container').fadeOut(100).css('overflow-y', 'hidden')
    $('.page-title').css('left', '-1.2em')
    $('.advance-payment-container').fadeIn(0)
    $('.advance-payment-heading').html('Advance Payments')
}