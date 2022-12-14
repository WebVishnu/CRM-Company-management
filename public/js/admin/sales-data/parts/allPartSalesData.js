let loadDataNum = 20
var latestReport = 20
let gotAllreports = false
let totalReports = 0
const searchTotalResultDiv = $('.total-search-results')
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
results = []
axios.get(`/api/v1/sales-data/parts/all/0`)
    .then((response) => {
        results = response.data.salesData
    })
    .catch(err => { console.log(err); })
// date range picker
$('input[name="daterange"]').daterangepicker({
    locale: {
        format: 'DD/MM/YYYY'
    }
});

$(window).on('scroll', async () => {
    if (!gotAllreports) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            if (searchInput.val() == "") {
                loadDataNum += 20
                if (loadDataNum <= totalReports - 20) {
                    $(".sales-data-loader").removeClass("d-none")
                    getAllSalesDataAjaxCall(loadDataNum)
                } else {
                    $(".sales-data-loader").removeClass("d-none")
                    gotAllreports = true
                    await getAllSalesDataAjaxCall(0)
                    $(".got-all-reports").removeClass("d-none")
                }
            }
        }
    }
})

// short the string
function ShortifyString(str) {
    str = `${str}`
    if (str.length > 10) {
        return str.substr(0, 10) + ".."
    }
    return str
}
$('#search-form input').get(0).type = "text"
$('#search-form input').on('keyup', async function () {
    if ($('#search-form input').val() != '') {
        $('.load-more-data-btn').attr('style', 'display:none!important')
        // $(".filter-results-btn").fadeIn(0)
        await getsearchedSalesDataAjaxCall($('#search-form input').val())
    } else {
        $('.load-more-data-btn').attr('style', 'display:block!important')
        // $(".filter-results-btn").fadeOut(0)
        getAllSalesDataAjaxCall(20)
    }
});
$('.upload-sale-data-submit-btn').fadeOut(0)
// show submit sale data button
$('#upload-sale-data-input').on("change", function (e) {
    $('.upload-sale-data-submit-btn-icon').html(`${e.target.files[0].name} (Click to change)`)
    $('.upload-sale-data-submit-btn').fadeIn()
});
// shortcuts
keyboardJS.bind('esc', () => { closeEditMenu() });
keyboardJS.bind('alt + =', (e) => {
    e.preventDefault()
    window.location.replace("/vitco-impex/control/sales-report/parts/add-new")
});
searchInput.on('focusin', () => {
    keyboardJS.unbind('r')
})
searchInput.on('focusout', () => {
    keyboardJS.bind('r', () => { refreshAllReports() })
})
keyboardJS.bind('r', () => { refreshAllReports() })
// =========================================================================
// AJAX QUERIES
// =========================================================================

// all sales data
function getAllSalesDataAjaxCall(limit) {
    try {
        searchTotalResultDiv.addClass('hide')
        axios.get(`/api/v1/sales-data/parts/all/${limit}`)
            .then((response) => {
                // totalReports = response.data.totalReports
                $(".sales-data-loader").addClass("d-none");
                showAllSalesData(response.data)
            })
            .catch(err => { console.log(err) })
    } catch (error) {
        console.log(error)
    }
}



// get search results
async function getsearchedSalesDataAjaxCall(query) {
    $(".sales-data-loader").removeClass("d-none");
    try {
        await axios.get(`/api/v1/sales-data/parts/search/${query.replaceAll("/", "-")}`)
            .then(response => {
                if (response.data.salesData.length == 0) {
                    searchTotalResultDiv.removeClass('hide').html(`No results found`)
                } else if (response.data.salesData.length == 1) {
                    searchTotalResultDiv.removeClass('hide').html(`${response.data.salesData.length} result found`)
                } else {
                    searchTotalResultDiv.removeClass('hide').html(`${response.data.salesData.length} results found`)
                }
                $(".sales-data-loader").addClass("d-none");
                results = response.data.salesData
                showAllSalesData(response.data)

            })
            .catch(err => { console.log(err) })
    } catch (error) {
        console.log(error)
    }
}
//get on sale data
async function getSingleSaleDataAjaxCall(id) {
    url = `/api/v1/sales-data/parts/get-single-data/${id}`
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        sunccessFun = printSaleReport(result.saleData),
        completeFun = null,
        showError = (e) => { console.log(e.statusText) }
    )
}

async function printSaleReport(result) {
    $("html").css({ "overflow": "hidden" });
    $('.sale-details-invoice-Date-input').val(result.invoiceDate)
    $('.sale-details-invoice-created-by').val(result.createdBy.adminName)
    $('.sale-details-invoice-number-input').val(result.invoiceNum)
    $('.sale-details-CName-input').val(result.customerName)
    $('.sale-details-Address-input').val(result.address)
    $('.sale-details-Number-input').val(result.mobileNum)
    $('.sale-details-id-input').val((result._id))
    $('.print-sale-report-btn').attr({ 'href': `/vitco-impex/control/sales-report/parts/print/${result._id}` })

    data = ``
    result.parts.forEach((part, i) => {
        data += `
            <tr class="row-${i}">
                <td>
                    <input readonly autocomplete="off" type="text" class="form-control shadow-none mx-1 toggle-input"
                        required name="partName" aria-describedby="helpId" placeholder="part name" value="${part.partName}">
                </td>
                <td>
                    <input readonly autocomplete="off" type="text" class="form-control shadow-none mx-1 toggle-input"
                        required name="partNumber" aria-describedby="helpId" placeholder="part sno" value="${part.partNumber}">
                </td>
                <td>
                    <input readonly autocomplete="off" type="text"
                        class="form-control shadow-none mx-1 datepicker warranty-input toggle-input" required
                        name="warrantyFrom" aria-describedby="helpId"
                        placeholder="warranty from" required value="${part.warranty.from}">
                </td>
                <td>
                    <input readonly autocomplete="off" readonly type="text"
                        class="form-control shadow-none mx-1 warranty-input toggle-input datepicker" name="warrantyTo" aria-describedby="helpId"
                        placeholder="warranty till" value="${(part.warranty.to == 0) ? result.warranty : part.warranty.to}">
                </td>
            </tr>`});
    $('.all-parts-sales-info table tbody').html(data)
}



// =================================================================================================
// FUNCTIONS
//  =================================================================================================
// print all the sales data to the html page
async function showAllSalesData(result) {
    if (result.success) {
        if (result.salesData.length < 20) {
            $('.load-more-data-btn').attr('style', 'display:none!important')
        }
        tableData = ``;
        $(".print-results-table tbody").html('')
        for (let i = 0; i < result.salesData.length; i++) {
            data = result.salesData[i]
            $(".print-results-table tbody").append(`
            <tr style="">
                <td ${(data.parts.length > 0) ? `rowspan="${data.parts.length + 1}"` : ""} >${data.reportNumber}</td>
                <td ${(data.parts.length > 0) ? `rowspan="${data.parts.length + 1}"` : ""}>${data.invoiceDate}</td>
                <td ${(data.parts.length > 0) ? `rowspan="${data.parts.length + 1}"` : ""}>${data.invoiceNum}</td>
                <td ${(data.parts.length > 0) ? `rowspan="${data.parts.length + 1}"` : ""}>${data.customerName}</td>
                <td>${(data.parts.length > 0) ? `${data.parts[0].partName}` : ""}</td>
                <td>${(data.parts.length > 0) ? `${data.parts[0].partNumber}` : ""}</td>
                <td>${(data.parts.length > 0) ? `${data.parts[0].warranty.from}` : ""}</td>
                <td>${(data.parts.length > 0) ? `${data.parts[0].warranty.to}` : ""}</td>
            </tr>`)
            data.parts.forEach(part => {
                $(".print-results-table tbody").append(`
                        <tr>
                            <td>${part.partName}</td>
                            <td>${part.partNumber}</td>
                            <td>${part.warranty.from}</td>
                            <td>${part.warranty.to}</td>
                        </tr>`)
            });
            tableData += `
                    <tr style="word-break: break-word;" class="all-sale-data-row" onclick='
                            $(".toggle-input").prop("readonly", true);
                            $(".view-sale-data-details-modal").addClass("active");
                            $("html").css({"overflow": "hidden"});
                            printSaleReport(${JSON.stringify(data)});
                            $(".submit-changes-sales-report-machine-details-btn").addClass("hide").css("position", "absolute");
                            $(".change-sales-report-machine-details-btn").removeClass("hide").css("position", "relative")'>
                    <td class="text-truncate" data-label="Serial Num">${data.reportNumber}</td>  
                    <td class="text-truncate" data-label="Serial Num">${data.createdBy.adminName}</td>  
                    <td class="text-truncate" data-label="Invoice Number">${data.invoiceDate}</td>  
                    <td class="text-truncate" data-label="Customer Name">${data.customerName}</td>  
                    <td class="text-truncate" data-label="Mobile">${data.mobileNum}</td>  
                    </tr> `
        }
        // <td style="word-break: break-word;" data-label="Bar Code">${ShortifyString(result.salesData[i].barCode)}</td>  
        $("#sales-data-table-body").html(tableData)

    } else {
        $("#all-complaints-main-body").html(`<h3 class="mt-5"> It's under construction</h3>`)
        console.error("Error in fetching data")
    }
}

// switch report edit mode 
function switchEditMode(cmd) {
    if (cmd == "ON") {
        $('.submit-changes-sales-report-machine-details-btn').removeClass('hide').css('position', 'relative');
        $(".change-sales-report-machine-details-btn").addClass('hide').css('position', 'absolute');
        $('.toggle-input').prop('readonly', false);
        $('.datepicker').datepicker({ format: 'dd/mm/yyyy' });
    } else if (cmd == "OFF") {
        $('.submit-changes-sales-report-machine-details-btn').addClass('hide').css('position', 'absolute')``;
        $(".change-sales-report-machine-details-btn").removeClass('hide').css('position', 'relative');
        $('.toggle-input').prop('readonly', true);
    }
}
// close edit menu sale data
function closeEditMenu() {
    $("html").css({ "overflow": "auto" });
    $('.view-sale-data-details-modal').removeClass('active');
}
// submit edited sale data
async function applyChangeSaleData() {
    allParts = []
    tempArr = $('input[name="partName"]').map((i, e) => e.value).get()
    tempArr.forEach((partName, i) => {
        allParts.push({
            partName,
            partNumber: $('input[name="partNumber"]')[i].value,
            warranty: {
                from: $(`input[name="warrantyFrom"]`).val(),
                to: $(`input[name="warrantyTo"]`).val()
            },
        })
    });
    const id = $('.sale-details-id-input').val();
    axios.post(`/api/v1/sales-data/parts/edit/${id}`, {
        invoiceNum: $('input[name="invoiceNum"]').val(),
        customerName: $('input[name="customerName"]').val(),
        address: $('input[name="address"]').val(),
        mobileNum: $('input[name="mobileNum"]').val(),
        parts: allParts
    }).then((response) => {
        // loadDataNum = 20
        // getAllSalesDataAjaxCall(20)
        // toggleSalesEditInputRead(true)
        // console.log(response.data)
        printSaleReport(response.data.report)
        switchEditMode("OFF")
    })
}

function toDate(dateStr) {
    var parts = dateStr.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0])
}
// filter by DATE

function filterByDate() {
    from = toDate($(".date-filter-input").val().split("-")[0])
    to = toDate($(".date-filter-input").val().split("-")[1])
    filteredData = results.filter(data => {
        invoiceDate = toDate(data.invoiceDate)
        if (invoiceDate >= from && invoiceDate <= to) {
            return data
        }
    })
    $('.container got-all-reports').fadeOut(0)
    gotAllreports = true
    results = filteredData
    showAllSalesData({
        success: true,
        salesData: filteredData
    })
}

// convert 1 digit numebr to three digit
async function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// =========================================================================
// FUNCTION CALLS
// =========================================================================
getAllSalesDataAjaxCall(20)
// ================================================================

// refresh all reports
function refreshAllReports() {
    $('.filter-result-menu').removeClass('active')
    searchInput.val('')
    window.scrollTo(0, 0);
    $(".got-all-reports").addClass("d-none");
    $('.sales-data-table-container').css('display', 'none');
    setTimeout(() => {
        loadDataNum = 20;
        gotAllreports = false;
        getAllSalesDataAjaxCall(20);
        $('.sales-data-table-container').css('display', 'inline-table');
    }, 100);
}

// print results 
function printReports() {
    $('.print-results-table').fadeIn(0).addClass("active")
    printJS('print-results-table', 'html')
    $('.print-results-table').fadeOut(0).removeClass("active")

}
