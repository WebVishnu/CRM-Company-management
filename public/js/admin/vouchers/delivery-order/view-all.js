$('.input-group.date').datepicker({ format: "dd/mm/yyyy" });
$('.voucher-details-container').fadeOut(0)
// open voucher details model
function openVoucherDetails(voucher) {
    keyboardJS.bind('esc', (e) =>{closeVoucherDetails()});
    $('.voucher-details-container').fadeIn(100)
    keys = _.keys(voucher)
    dispatchDetailsKeys = _.keys(voucher.dispatchDetails)
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
    const products =  voucher.products
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
                <i class="bi bi-percent" style="position:absolute;right:20px;top:15%"></i>
                ${products[i].gstRate}
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
        $('.mode-of-payment').html(voucher.advancePayment[0].mode)
        total = 0
        for (let i = 0; i < voucher.advancePayment.length; i++) {
            const payment = voucher.advancePayment[i];
            total  += parseInt(payment.advanceAmount)
            advanceData += `
                <tr>
                    <td>${payment.advanceDate}</td>
                    <td>${payment.advanceAmount}</td>
                </tr>`
        }
        $('.advanceEntryTbody').html(advanceData)
        $('.totalAdvncSpan').html(total)
    }else{
        $('.advance-payment-container').remove()
        $('.advance-payment-heading').html('No advance Payment received').removeClass("mb-4")

    }
}


// print data to tbale 
printAllVouchers(vouchers)
console.log(vouchers)
function printAllVouchers(v) {
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
}


// close voucher details
function closeVoucherDetails(){
    $('.voucher-details-container').fadeOut(100);
    keyboardJS.unbind('esc');
}