let loadDataNum = 20
var latestReport = 20
let gotAllreports = false
let totalReports = 0
const searchTotalResultDiv = $('.total-search-results')
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
        await getsearchedSalesDataAjaxCall($('#search-form input').val())
    } else {
        $('.load-more-data-btn').attr('style', 'display:block!important')
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
keyboardJS.bind('alt + a', () => { closeEditMenu() });
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
                totalReports = response.data.totalReports
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
        await axios.get(`/api/v1/sales-data/parts/search/${query}`)
            .then(response => {
                if (response.data.salesData.length == 0) {
                    searchTotalResultDiv.removeClass('hide').html(`No results found`)
                } else if (response.data.salesData.length == 1) {
                    searchTotalResultDiv.removeClass('hide').html(`${response.data.salesData.length} result found`)
                } else {
                    searchTotalResultDiv.removeClass('hide').html(`${response.data.salesData.length} results found`)
                }
                $(".sales-data-loader").addClass("d-none");
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
    data = ``
    result.parts.forEach(element => {
        data += `
        <div class="d-flex">
        <input value="${element.partName}" readonly type="text" class="form-control shadow-none sale-details-part-name-input"
           name="partName" aria-describedby="helpId" placeholder="enter part name">
        <input value="${element.partNumber}" readonly type="text" class="form-control shadow-none sale-details-part-number-input"
           name="partNumber" aria-describedby="helpId" placeholder="enter part number">
        <input value="${element.password}" readonly type="text" class="form-control shadow-none sale-details-warranty-input"
           name="password" aria-describedby="helpId" placeholder="enter password">
            </div>
        `
    });
    $('.all-parts-sales-info').html(data)
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
        for (let i = 0; i < result.salesData.length; i++) {
            tableData += `
                    <tr style="word-break: break-word;" class="all-sale-data-row" onclick='
                            toggleSalesEditInputRead(true);
                            $(".view-sale-data-details-modal").addClass("active");
                            $("html").css({"overflow": "hidden"});
                            printSaleReport(${JSON.stringify(result.salesData[i])});
                            $(".submit-changes-sales-report-machine-details-btn").addClass("hide").css("position", "absolute");
                            $(".change-sales-report-machine-details-btn").removeClass("hide").css("position", "relative")'>
                    <td style="word-break: break-word;" data-label="Serial Num">${ShortifyString(result.salesData[i].reportNumber)}</td>  
                    <td style="word-break: break-word;" data-label="Invoice Number">${ShortifyString(result.salesData[i].invoiceDate)}</td>  
                    <td style="word-break: break-word;" data-label="Part Name">${ShortifyString(result.salesData[i].parts[0].partName)}</td>  
                    <td style="word-break: break-word;" data-label="Part Number">${ShortifyString(result.salesData[i].parts[0].partNumber)}</td>  
                    <td style="word-break: break-word;" data-label="Password">${ShortifyString(result.salesData[i].parts[0].password)}</td>  
                    <td style="word-break: break-word;" data-label="Customer Name">${ShortifyString(result.salesData[i].customerName)}</td>  
                    <td style="word-break: break-word;" data-label="Address">${ShortifyString(result.salesData[i].address)}</td>  
                    <td style="word-break: break-word;" data-label="Mobile">${ShortifyString(result.salesData[i].mobileNum)}</td>  
                    </tr> `
        }
        // <td style="word-break: break-word;" data-label="Bar Code">${ShortifyString(result.salesData[i].barCode)}</td>  
        $("#sales-data-table-body").html(tableData)

    } else {
        $("#all-complaints-main-body").html(`<h3 class="mt-5"> It's under construction</h3>`)
        console.error("Error in fetching data")
    }
}

// toggle inputs to readonly
function toggleSalesEditInputRead(state) {
    $('.sale-details-invoice-number-input').prop('readonly', state);
    $('.sale-details-CName-input').prop('readonly', state);
    $('.sale-details-Address-input').prop('readonly', state);
    $('.sale-details-Number-input').prop('readonly', state);
    $('input[name="partName"]').prop('readonly', state);
    $('input[name="partNumber"]').prop('readonly', state);
    $('input[name="password"]').prop('readonly', state);
}

// close edit menu sale data
function closeEditMenu() {
    $("html").css({ "overflow": "auto" });
    $('.view-sale-data-details-modal').removeClass('active');
    $('.sale-details-invoice-Date-input').val("Loading...")
    $('.sale-details-Nname-input').val("Loading...")
    $('.sale-details-Mnumber-input').val("Loading...")
    $('.sale-details-Code-input').val("Loading...")
    $('.sale-details-CName-input').val("Loading...")
    $('.sale-details-Address-input').val("Loading...")
    $('.sale-details-Number-input').val(("Loading..."))
    $('.sale-details-status-input').val(("Loading..."))
}

// submit edited sale data
async function editSaleData() {
    allParts = []
    tempArr = $('input[name="partName"]').map((i, e) => e.value).get()
    tempArr.forEach((element, i) => {
        allParts.push({
            partName: element,
            partNumber: $('input[name="partNumber"]')[i].value,
            password: $('input[name="password"]')[i].value,
        })
    })
    const id = $('.sale-details-id-input').val();
    const newSalesData = {
        invoiceNum: $('input[name="invoiceNum"]').val(),
        customerName: $('input[name="customerName"]').val(),
        address: $('input[name="address"]').val(),
        mobileNum: $('input[name="mobileNum"]').val(),
        parts: allParts
    }
    $('#search-form input').val("")
    $('.submit-changes-sales-report-machine-details-btn').addClass('hide').css('position', 'absolute');
    $('.change-sales-report-machine-details-btn').removeClass('hide').css('position', 'relative')
    axios.post(`/api/v1/sales-data/parts/edit/${id}`, newSalesData)
        .then((response) => {
            loadDataNum = 20
            getAllSalesDataAjaxCall(20)
            toggleSalesEditInputRead(true)
            console.log(response.data)
            printSaleReport(response.data.report)
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