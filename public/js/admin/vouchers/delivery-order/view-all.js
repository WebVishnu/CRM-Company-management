$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
$('.voucher-details-container').fadeOut(0)
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
                                <input readonly type="email" value="${modeDetails[key]}" class="form-control shadow-none bg-transparent" placeholder="Enter ${modeDetails[key]}">`
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
        for (let i = v.length - 1; i >= 0; i--) {
            const voucher = v[i];
            tempData += `
                <tr class="tb-row" onclick='openVoucherDetails(${JSON.stringify(voucher)})'>
                   <td>${voucher.voucherNum}</td>
                   <td>${voucher.orderDate}</td>
                   <td>${voucher.consignee}</td>
                   <td>${voucher.gstInNum}</td>
                   <td>${voucher.advancePaymentReceived}</td>
                   <td>${voucher.dispatchDetails.dispatchedBy}</td>
                </tr>`
        }
        $('#all-delivery-voucher-tbody').html(tempData)
    } else {
        $('.delivery-order-table table').replaceWith("<h2 class='text-secondary text-center mt-5'>No vouchers found</h2>")
    }
}

// filter vouchers 
async function filterVouchers(filter) {
    await axios.get(`/api/v1/vitco-impex/filter/delivery-order/${filter}`)
        .then((res) => {
            if (res.data.success) {
                printAllVouchers(res.data.vouchers)
            }
        })
}



// close voucher details
function closeVoucherDetails() {
    $('body , html').css('overflow-y', 'auto')
    $('.voucher-details-container').fadeOut(100).css('overflow-y', 'hidden')
    $('.page-title').css('left', '-1.2em')
    $('.advance-payment-container').fadeIn(0)
    $('.advance-payment-heading').html('Advance Payments')
    keyboardJS.unbind('esc');
}