let loadDataNum = 20
var latestReport = 20
let gotAllreports = false
let totalReports = 0
const searchTotalResultDiv = $('.total-search-results')
$(window).on('scroll', () => {
    if (!gotAllreports) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            if (searchInput.val() == "") {
                loadDataNum += 20
                if (loadDataNum < totalReports - 20) {
                    $(".sales-data-loader").removeClass("d-none");
                    getAllSalesDataAjaxCall(loadDataNum)
                } else {
                    gotAllreports = true
                    $(".sales-data-loader").removeClass("d-none");
                    getAllSalesDataAjaxCall(0)
                    $(".got-all-reports").removeClass("d-none");
                    

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
searchInput.on('focusin', () => {
    keyboardJS.unbind('r')
})
keyboardJS.bind('r', () => {
    refreshAllReports()
})
searchInput.on('focusout', () => {
    keyboardJS.bind('r', () => {
        refreshAllReports()
    })
})
keyboardJS.bind('r', () => {
    refreshAllReports()
})


keyboardJS.bind('alt + =', (e) => {
    e.preventDefault()
    window.location.replace("/vitco-impex/control/sales-report/machine/add-new")
});
keyboardJS.bind('alt + a', () => { closeEditMenu() });
// =========================================================================
// AJAX QUERIES
// =========================================================================

// all sales data
function getAllSalesDataAjaxCall(limit) {
    try {
        searchTotalResultDiv.addClass('hide')
        axios.get(`/api/v1/sales-data/all/${limit}`)
            .then(async (response) => {
                totalReports = response.data.totalReports
                $(".sales-data-loader").addClass("d-none");
                await showAllSalesData(response.data)
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
        await axios.get(`/api/v1/sales-data/search/${query}`)
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
    url = `/api/v1/sales-data/get-single-data/${id}`
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        sunccessFun = (result) => {
            $('.sale-details-invoice-Date-input').val(result.saleData.invoiceDate)
            $('.sale-details-invoice-created-by').val(result.saleData.createdBy)
            $('.sale-details-invoice-number-input').val(result.saleData.invoiceNum)
            $('.sale-details-Nname-input').val(result.saleData.machineName)
            $('.sale-details-Mnumber-input').val(result.saleData.machineNum)
            $('.sale-details-pass-input').val(result.saleData.password)
            $('.sale-details-CName-input').val(result.saleData.customerName)
            $('.sale-details-Address-input').val(result.saleData.address)
            $('.sale-details-Number-input').val(result.saleData.mobileNum)
            $('.sale-details-id-input').val((result.saleData._id))
        },
        completeFun = null,
        showError = (e) => { console.log(e.statusText) }
    )
}

async function printSaleReport(result) {
    $('html').css('overflow', 'hidden')
    $('.sales-report-number').html(` - ${result.reportNumber}`)
    $('.sale-details-invoice-Date-input').val(result.invoiceDate)
    $('.sale-details-invoice-created-by').val(result.createdBy.adminName)
    $('.sale-details-invoice-number-input').val(result.invoiceNum)
    $('.sale-details-CName-input').val(result.customerName)
    $('.sale-details-Address-input').val(result.address)
    $('.sale-details-Number-input').val(result.mobileNum)
    $('.sale-details-warranty-input').val(result.warranty)
    data = ``
    result.machines.forEach(element => {
        data += `
        <div class="d-flex">
        <input value="${element.machineName}" readonly type="text" class="form-control shadow-none sale-details-part-name-input toggle-input"
           name="machineName" aria-describedby="helpId" placeholder="enter part name">
        <input value="${element.machineNum}" readonly type="text" class="form-control shadow-none sale-details-part-number-input toggle-input"
           name="machineNum" aria-describedby="helpId" placeholder="enter part number">
        <input value="${element.password}" readonly type="text" class="form-control shadow-none sale-details-warranty-input toggle-input"
           name="password" aria-describedby="helpId" placeholder="enter password">
            </div>
        `
    });
    $('.all-machines-container').html(data)
    $('.sale-details-id-input').val((result._id))
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
                        printSaleReport(${JSON.stringify(result.salesData[i])});
                        $(".submit-changes-sales-report-machine-details-btn").addClass("hide");
                        $(".change-sales-report-machine-details-btn").removeClass("hide").css("position", "relative")'>
                    <td style="word-break: break-word;" data-label="Serial Num">${ShortifyString(result.salesData[i].reportNumber)}</td>  
                    <td style="word-break: break-word;" data-label="Invoice Date">${ShortifyString(result.salesData[i].invoiceDate)}</td>  
                    <td style="word-break: break-word;" data-label="Machine Name">${ShortifyString(result.salesData[i].machines[0].machineName)}</td>  
                    <td style="word-break: break-word;" data-label="Machine Number">${ShortifyString(result.salesData[i].machines[0].machineNum)}</td>  
                    <td style="word-break: break-word;" data-label="Customer Name">${ShortifyString(result.salesData[i].customerName)}</td>  
                    <td style="word-break: break-word;" data-label="Address">${ShortifyString(result.salesData[i].address)}</td>  
                    <td style="word-break: break-word;" data-label="Mobile">${ShortifyString(result.salesData[i].mobileNum)}</td>  
                    <td style="word-break: break-word;" data-label="Warranty">${ShortifyString(result.salesData[i].warranty)}</td>  </tr> `
        }
        // <td style="word-break: break-word;" data-label="Bar Code">${ShortifyString(result.salesData[i].barCode)}</td>  
        $("#sales-data-table-body").html(tableData)

    } else {
        console.error("Error in fetching data")
    }
}

// toggle inputs to readonly
function toggleSalesEditInputRead(state) {
    $('.toggle-input').prop('readonly', state);
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
    const id = $('.sale-details-id-input').val();
    machines = []
    tempArr = $('input[name="machineName"]').map((i, e) => e.value).get()
    tempArr.forEach((element, i) => {
        machines.push({
            machineName: element,
            machineNum: $('input[name="machineNum"]')[i].value,
            password: $('input[name="password"]')[i].value,
        })
    })
    const newSalesData = {
        invoiceNum: $('input[name="invoiceNumber"]').val(),
        customerName: $('input[name="customerName"]').val(),
        address: $('input[name="address"]').val(),
        mobileNum: $('input[name="mobileNumber"]').val(),
        warranty: $('input[name="warranty"]').val(),
        machines: machines
    }
    $('#search-form input').val("")
    $('.submit-changes-sales-report-machine-details-btn').addClass('hide');
    $('.change-sales-report-machine-details-btn').removeClass('hide').css('position', 'relative')
    axios.post(`/api/v1/sales-data/edit/${id}`, newSalesData)
        .then((response) => {
            loadDataNum = 20
            getAllSalesDataAjaxCall(20)
            toggleSalesEditInputRead(true)
            printSaleReport(response.data.report)
        })
    // await editSaleDataAdminAjaxCall(id, newSalesData)
}

// load more data
// async function loadMoreData() { loadDataNum += 20; getAllSalesDataAjaxCall(loadDataNum) }


// for (let i = 0; i < admin.permissions.length; i++) {
//     if (admin.permissions[i].permissionName == "all") {
//         $('#UploadSalesFileForm').removeClass('d-none')
//     }
//     if (admin.permissions[i].permissionName == "all" || admin.permissions[i].permissionName == "salesData") {
//         if (admin.permissions[i].permissionKeys[1].keyName == "edit") {
//             // toggleSalesEditInputRead(false)
//             $('.sales-report-actions').append(`
//             <button class="btn border-0 bg-text-base-color shadow-none mt-3 mx-3 update-sales-report-admin" onclick="$('.view-sale-data-details-modal').removeClass('active');editSaleData()">Update Report</button>`)
//         }
//     }
// }

// convert 1 digit numebr to three digit
async function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// update report number every second
// async function updateServiceReportNumber(){
//     axios.get("/api/v1/sales-data/get-report-number").then((response) => {
//         $('.sales-length-input').val(response.data.reportNumber)
//     })
// }
// =========================================================================
// FUNCTION CALLS
// =========================================================================
getAllSalesDataAjaxCall(20)
$('#UploadSalesFileForm').on('submit', async (e) => {
    e.preventDefault()
    let formData = new FormData();
    let selectedFile = $('#upload-sale-data-input')[0].files[0];
    formData.append("file", selectedFile);
    try {
        $(".sales-data-loader").removeClass("d-none")
        await axios.post('/vitco-india/control/sales-report/upload/new', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(async () => {
            await getAllSalesDataAjaxCall(20)
                .then(() => {
                    $('.upload-sale-data-submit-btn-icon').html(`<i class="bi bi-cloud-upload"></i>`)
                    $('.upload-sale-data-submit-btn').fadeOut(0)
                    $('#upload-sale-data-input').val('')
                    window.location.reload()
                })
        }).catch(err => { console.log(err) })
    } catch (error) {
        console.log(error)
    }
})
// ================================================================
// refresh page
function refreshAllReports() {
    window.scrollTo(0, 0);
    searchInput.val('');
    $(".got-all-reports").addClass("d-none");
    $('.sales-data-table-container').css('display', 'none');
    setTimeout(() => {
        totalReports = 20;
        loadDataNum = 20;
        gotAllreports = false;
        getAllSalesDataAjaxCall(20)
        $('.sales-data-table-container').css('display', 'inline-table');
    }, 100);
}

