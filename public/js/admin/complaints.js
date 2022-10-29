
// reusable functions 
// ============ count characters =================================================
function count(string) {
    var count = {};
    string.split('').forEach(function (s) {
        count[s] ? count[s]++ : count[s] = 1;
    });
    return count;
}

//================== send ajax request ============================
//convert month to 2 digits
var fullDate = new Date()
var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
var date = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
var time = fullDate.getHours() + ":" + fullDate.getMinutes() + ":" + fullDate.getSeconds();

//   ===================== get input number in the form of number =============================================

$.valHooks.number = {
    get: function (elem) {
        return elem.value * 1;
    }
};


// short the string
function ShortifyString(str) {
    str = `${str}`
    if (str.length > 15) {
        return str.substr(0, 15) + ".."
    }
    return str
}

$(document).on('keydown', function (event) { if (event.keyCode == 8) { $('.complaint-details-modal').removeClass('active'); } })


// =====================================================================================================



fetchAllComplaints()
async function fetchAllComplaints() {
    $('#loading-for-searched-complaints').css('display', 'none')

    // changing filter numbers

    $('.total-pending-complaints').html(``)
    $('.total-progress-complaints').html(``)
    $('.total-solved-complaints').html(``)
    $('.total-deleted-complaints').html(``)

    // changing filter to all complaints
    $('.nav-item .nav-link-all').addClass('active')
    $('.nav-item .nav-link-solved').removeClass('active')
    $('.nav-item .nav-link-progress').removeClass('active')
    $('.nav-item .nav-link-pending').removeClass('active')
    $('.nav-item .nav-link-deleted').removeClass('active')


    const url = "/api/v1/all-users/complaints/32c1a3bf323a1e635f5f75b1726d3e5"
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        sunccessFun = showResult,
        completeFun = function () {
            $('#loading-for-all-complaints').css('display', 'none');
            $('.refresh-complaints').css({ 'transform': 'rotate(180deg)' })
        },
        showError
    )
}


async function showResult(result) {
    let data = ``

    for (var i = result.complaints.length - 1; i >= 0; i--) {
        data += `
        
            <tr style='user-select: none' class="cursor-pointer single-complaint-row" onclick="viewDetails(${result.complaints[i].complaintID});$('.complaint-details-modal').toggleClass('active')">
                <td data-label="Complaint ID" style="word-break: break-word;">${ShortifyString(moment(result.complaints[i].dateIssued).format('DD-MM-YYYY'))}</td>
                <td data-label="Seriel Number" style="word-break: break-word;">${ShortifyString(result.complaints[i].machineSerielNumber)}</td>
                <td data-label="Name" style="word-break: break-word;">${ShortifyString(result.complaints[i].userDetails.customerName)}</td>
                <td data-label="Number" style="word-break: break-word;">${ShortifyString(result.complaints[i].userDetails.contactNumber)}</td>
                <td data-label="Problem" style="word-break: break-word;">${ShortifyString(result.complaints[i].issue)}</td>
                <td data-label="Address" style='word-wrap: break-word'>${ShortifyString(result.complaints[i].userDetails.address)}</td>
                <td data-label="DOP" style="word-break: break-word;">${ShortifyString(result.complaints[i].DOP)}</td>
                <td class="complaint-status" data-label="status" data-status="${result.complaints[i].complaintStatus}"> <button>${result.complaints[i].complaintStatus}</button></td>
                </tr>
                `
        // <td class="complaint-status" data-label="Actions" style="word-break: break-word;">
        //     <span class="material-symbols-outlined" style="cursor:pointer;user-select:none" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //         more_vert
        //     </span>
        //     <div class="dropdown-menu me-5" aria-labelledby="dropdownMenuButton">
        //         <a class="dropdown-item cursor-pointer" data-toggle="modal" data-target=".bd-example-modal-lg" onclick="viewDetails(${result.complaints[i].complaintID});$('.complaint-details-modal').toggleClass('active')">View Details</a>
        //         <a class="dropdown-item cursor-pointer">View Machine History</a>
        //         <a class="dropdown-item cursor-pointer delete-btn-complaint-action" style="background-color:#FDF4F6;color:#E25D7C" onclick='deleteComplaint(${result.complaints[i].complaintID})'>Delete</a>
        //                     </div>
        //                 </td>
    }
    $('#all-complaints-body').html(data)
    if (!permissions.includes('delete')) {
        $('a').remove(".delete-btn-complaint-action")
        $('button').remove(".delete-btn-complaint-action")
    }
    if (!permissions.includes('edit')) {
        $('button').remove("#changeStatusDropDown")
        $('.add-new-action-container').html(`
        <h5 class="text-center w-100">You are not allowed to add actions</h5>
        `)
    }
}
async function showError(err) {
    console.log(err)
}


// searching complaints
//const api_token = process.env.API_VERIFICATION_TOKEN
async function searchComplaints(query) {
    const url = "/api/v1/user/complaints/search/eS4NYm0iT1W-YRUA%3A1657954289598&ei=8V_SYoGPJPnb4-EPs_CsWA&ved=0ah"
    await sendAjaxRequest(
        url,
        "POST",
        query,
        printResult,
        completeFun = null,
        errorFun = showError
    )
}


function showSearchResult(result) {
    let data = ``
    if (Object.keys(result).length > 0) {

        if (Object.keys(result).length == 1) {
            data += `
            <tr style='user-select: none' class="cursor-pointer single-complaint-row" onclick="viewDetails(${result[0].complaintID});$('.complaint-details-modal').toggleClass('active')">
            <td data-label="Complaint ID" style="word-break: break-word;">${ShortifyString(moment(result[0].dateIssued).format('DD-MM-YYYY'))}</td>
            <td data-label="Seriel Number" style="word-break: break-word;">${ShortifyString(result[0].machineSerielNumber)}</td>
            <td data-label="Name" style="word-break: break-word;">${ShortifyString(result[0].userDetails.customerName)}</td>
            <td data-label="Number" style="word-break: break-word;">${ShortifyString(result[0].userDetails.contactNumber)}</td>
            <td data-label="Problem" style="word-break: break-word;">${ShortifyString(result[0].issue)}</td>
            <td data-label="Address" style='word-wrap: break-word'>${ShortifyString(result[0].userDetails.address)}</td>
            <td data-label="DOP" style="word-break: break-word;">${ShortifyString(result[0].DOP)}</td>
            <td class="complaint-status" data-label="status" data-status="${result[0].complaintStatus}"> <button>${result[0].complaintStatus}</button></td>
            </tr>`
            // <td class="complaint-status" data-label="Actions">
            // <span class="material-symbols-outlined" style="cursor:pointer;user-select:none" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            //     more_vert
            // </span>
            //     <div class="dropdown-menu me-5" aria-labelledby="dropdownMenuButton">
            //         <a class="dropdown-item" data-toggle="modal" data-target=".bd-example-modal-lg" onclick="viewDetails(${result[0].complaintID});$('.complaint-details-modal').toggleClass('active')">View Details</a>
            //         <a class="dropdown-item">View Machine History</a>
            //         <a class="dropdown-item delete-btn-complaint-action" style="background-color:#FDF4F6;color:#E25D7C" onclick='deleteComplaint(${result[0].complaintID})'>Delete</a>
            //     </div>
            // </td>
        } else {
            for (var i = Object.keys(result).length - 1; i >= 0; i--) {
                data += `
                <tr class="cursor-pointer single-complaint-row" onclick="viewDetails(${result[0].complaintID});$('.complaint-details-modal').toggleClass('active')">
                <td data-label="Complaint ID" style="word-break: break-word;">${ShortifyString(moment(result[i].dateIssued).format('DD-MM-YYYY'))}</td>
                <td data-label="Seriel Number" style="word-break: break-word;">${ShortifyString(result[i].machineSerielNumber)}</td>
                    <td data-label="Name" style="word-break: break-word;">${ShortifyString(result[i].userDetails.customerName)}</td>
                    <td data-label="Number" style="word-break: break-word;">${ShortifyString(result[i].userDetails.contactNumber)}</td>
                    <td data-label="Problem" style="word-break: break-word;">${ShortifyString(result[i].issue)}</td>
                    <td data-label="Address" style='word-wrap: break-word'>${ShortifyString(result[i].userDetails.address)}</td>
                    <td data-label="DOP" style="word-break: break-word;">${ShortifyString(result[i].DOP)}</td>
                    <td class="complaint-status" data-label="status" data-status="${result[i].complaintStatus}"> <button>${result[i].complaintStatus}</button></td>
                    </tr>`
                // <td class="complaint-status" data-label="Actions">
                //     <span class="material-symbols-outlined" style="cursor:pointer;user-select:none" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                //         more_vert
                //     </span>
                //     <div class="dropdown-menu me-5" aria-labelledby="dropdownMenuButton">
                //         <a class="dropdown-item" data-toggle="modal" data-target=".bd-example-modal-lg" onclick="viewDetails(${result[i].complaintID});$('.complaint-details-modal').toggleClass('active')">View Details</a>

                //         <a class="dropdown-item">View Machine History</a>
                //         <a class="dropdown-item delete-btn-complaint-action" style="background-color:#FDF4F6;color:#E25D7C" onclick='deleteComplaint(${result[i].complaintID})'>Delete</a>
                //     </div>
                // </td>
            }
        }
        $('#searched-complaints-all-body').css({ "display": "flex" })
        $('#loading-for-all-complaints').css('display', 'none');
        $('#loading-for-searched-complaints').css({ "display": "none" })
        $('#searched-complaints-body').html(data)
        if (!permissions.includes('delete')) {
            $('a').remove(".delete-btn-complaint-action")
        }
        if (!permissions.includes('edit')) {
            $('button').remove("#changeStatusDropDown")
            $('.add-new-action-container').html(`
            <h5 class="text-center w-100">You are not allowed to add actions</h5>
            `)
        }
    }
    else if ($("#search-box").val().length == 0) {
        $('#loading-for-searched-complaints').css({ "display": "none" })
        $('#all-complaints-main-body').css({ "display": "flex" })
        $('#searched-complaints-all-body').css({ "display": "none" })
        fetchAllComplaints()
    }
    else if (Object.keys(result).length == 0) {
        $('#searched-complaints-all-body').css({ "display": "none" })
        $('#loading-for-searched-complaints').css({ "display": "block" })
        $("#loading-for-all-complaints").css({ "display": "none" })
    }
}

// add searched results
function printResult(result) {
    showSearchResult(result.complaints)
}


$('#search-box').keyup(() => {
    $('#all-complaints-main-body').css({ "display": "none" })
    $('#loading-for-all-complaints').css('display', 'block');
    searchComplaints($('#search-box').val())
})


// view details
async function viewDetails(cID) {
    const url = `/api/v1/find-single-user/complaints/${cID}`
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        printComplaitDetails,
        completeFun = null,
        errorFun = showError)
}
// printing complaints in html doc
function printComplaitDetails(result) {
    getComplaintActions(result.complaint[0].complaintID)
    $('.user-details-input-status').html(`
    <span id="user-details-input-current-status">Loading...</span>
    <span onclick="changeStatusSingleComplaint()">(Change Status)</span>
    `)
    $('.user-detail-status').attr('data-status', `${result.complaint[0].complaintStatus}`)
    $('.user-details-input-registeration-date').val((result.complaint[0].dateIssued != '') ? result.complaint[0].dateIssued : "No date available")
    $('.user-details-input-complaintID').val(result.complaint[0].complaintID)
    $('.user-details-input-machineSerielNumber').val(result.complaint[0].machineSerielNumber)
    $('.user-details-input-customerName').val(result.complaint[0].userDetails.customerName)
    $('.user-details-input-contactNumber').val(result.complaint[0].userDetails.contactNumber)
    $('.user-details-input-DOP').val(result.complaint[0].DOP)
    $('.user-details-input-issue').val(result.complaint[0].issue)
    $('.user-details-input-address').val(result.complaint[0].userDetails.address)
    $('#user-details-input-current-status').html(result.complaint[0].complaintStatus)
    if (!result.complaint[0].files[0].url) {
        $('.complaint-video-outer').html(" <h6> No file Uploaded</h6>")
    } else {
        $('.complaint-video-outer').html(`<button class="btn btn-primary shadow-none" onclick="location.href='/${result.complaint[0].files[0].url}';"">Open Video</button>`)
    }
}

// ============================= =================================================================

// delete complaint
async function deleteComplaint(cID) {
    const url = `/api/v1/delete-single-user/complaints/${cID}`
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        fetchAllComplaints,
        completeFun = null,
        errorFun = showError)
}

$('.delete-button').click(() => {
    const cID = $('.user-details-input-complaintID').html()
    $('.bd-example-modal-lg').css({ 'display': 'none' })
    $('.modal-backdrop').css({ 'display': 'none' })
    deleteComplaint(cID)
})



// ============================= =================================================================
// Edit complaint
async function changeStatus(status) {
    const url = `/api/v1/user/complaints/update-status/eS4NYm0iT1W-YRUA%3A1657954289598&ei=8V_SYoGPJPnb4-EPs_CsWA&ved=0ah`
    await sendAjaxRequest(
        url,
        "POST",
        query = {
            complaintID: await $('.user-details-input-complaintID').val(),
            status
        },
        changeReceivedStatus,
        completeFun = null,
        errorFun = showError)

}

function changeReceivedStatus(result) {

    $('#user-details-input-current-status').html(`${result.complaintStatus}`)
}

// filter complaints 
async function filterComplaint(status) {
    const url = `/api/v1/filter-status-complaint/complaint/${status}`
    await sendAjaxRequest(
        url,
        "POST",
        query = {
            status
        },
        updateDomForfilteredComplaint,
        completeFun = null,
        errorFun = showError)
}

function updateDomForfilteredComplaint(result) {
    if (result.complaints.length != 0) {
        $('#loading-for-searched-complaints').css('display', 'none')
        if (result.complaints[0].complaintStatus == "Solved") {
            $('.total-all-complaints').html(``)
            $('.total-progress-complaints').html(``)
            $('.total-pending-complaints').html(``)
            $('.total-solved-complaints').html(`(${result.complaints.length})`)
            $('.total-deleted-complaints').html(``)
        }
        else if (result.complaints[0].complaintStatus == "Progress") {
            $('.total-all-complaints').html(``)
            $('.total-progress-complaints').html(` (${result.complaints.length}) `)
            $('.total-pending-complaints').html(``)
            $('.total-solved-complaints').html(``)
            $('.total-deleted-complaints').html(``)
        }
        else if (result.complaints[0].complaintStatus == "Pending") {
            $('.total-all-complaints').html(``)
            $('.total-pending-complaints').html(` (${result.complaints.length}) `)
            $('.total-progress-complaints').html(``)
            $('.total-solved-complaints').html(``)
            $('.total-deleted-complaints').html(``)

        }
        else if (result.complaints[0].complaintStatus == "Deleted") {
            $('.total-all-complaints').html(``)
            $('.total-pending-complaints').html(``)
            $('.total-progress-complaints').html(``)
            $('.total-solved-complaints').html(``)
            $('.total-deleted-complaints').html(`(${result.complaints.length})`)

        }
    }
    else {
        $('.total-all-complaints').html(``)
        $('.total-pending-complaints').html(``)
        $('.total-progress-complaints').html(``)
        $('.total-solved-complaints').html(``)
        $('.total-deleted-complaints').html(``)
        $('#loading-for-searched-complaints').css('display', 'block')
    }

    showResult(result)
}












var currentMenu;
var menuLinks = document.querySelectorAll('.menu-link');

function clickMenuHandler() {
    if (currentMenu) {
        currentMenu.classList.remove('menu-active');
    }
    this.classList.add('menu-active');
    currentMenu = this;
}

for (var i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener('click', clickMenuHandler);
}




// change status
function changeStatusSingleComplaint() {
    $('.user-details-input-status').html(`
    <section class="user-details-all-status d-flex">
        <p class="user-detail-change-status" onclick='changeStatus("Pending")'>Pending</p>
        <p class="user-detail-change-status" onclick='changeStatus("Progress")'>Progress</p>
        <p class="user-detail-change-status" onclick='changeStatus("Solved")'>Solved</p>
    </section>
    `)
}


// get actions taken ona complaint
async function getComplaintActions(cID) {
    const url = `/api/v1/get-actions/complaint/${cID}`
    await sendAjaxRequest(
        url,
        "GET",
        query = null,
        updateDOMreceivedActions,
        completeFun = null,
        errorFun = showError)

}

// update html dom action list
function updateDOMreceivedActions(result) {
    data = ``
    if (result.actions.length != 0) {
        for (var i = result.actions.length - 1; i >= 0; i--) {
            if (i == result.actions.length - 1) {
                data += (`
                <a class="list-group-item rounded-0 list-group-item-action flex-column align-items-start active">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${result.actions[i].adminName}</h5>
                        <small style="color: #fff;">${result.actions[i].time} - ${result.actions[i].date}</small>
                    </div>
                    <p class="mb-1" style="color: #fff;">${result.actions[i].action}</p>
                </a>
                `)
            }
            else {
                data += (`
                <a class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${result.actions[i].adminName}</h5>
                        <small>${result.actions[i].time} - ${result.actions[i].date}</small>
                    </div>
                    <p class="mb-1">${result.actions[i].action}</p>
                </a>
            `)
            }
        }
        $('.complaint-actions').html(data)

    }
    else {
        $('.complaint-actions').html('<h5 class="mt-5 text-center text-secondary">There are no actions taken</h5>')
        $('.list-group-div').css({ "background": "white" })
    }
}



// add single complaint action
function addActionSingleComplaint() {
    var id = $('.user-details-input-complaintID').val()
    var action = $('.new-action-text-area').val()
    if ($('.new-action-text-area').val() == "") {
        $('.field-required-complaint-input-box').css({ "display": "block" })
        $('.actions-dialog-input-box').html(`
        <div class="container-fluid">
                <div class="row">
                    <div class="col my-3 d-flex">
                        <input type="text" class="form-control shadow-none new-action-text-area" name="" id="" aria-describedby="helpId"
                            placeholder="Enter your action here...">
                        <button class="btn" style="padding:0 10px 0 10px;"><i class="bi bi-caret-right-square"
                                style="font-size:30px;display:grid" onclick="addActionSingleComplaint()"></i></button>
                    </div>
                    <h6 class="field-required-complaint-input-box">This field is required</h6>
                </div>
            </div>
        `)
    } else {
        $('.field-required-complaint-input-box').css({ "display": "none" })
        $('.new-action-text-area').val('')
        addSingleComplaintRequest(id, action)
    }
}

async function addSingleComplaintRequest(cID, action) {

    const url = `/api/v1/add-new-action/complaint/${cID}`
    await sendAjaxRequest(
        url,
        "POST",
        query = {
            time: time,
            date: date,
            action: action
        },
        updateDOMreceived,
        completeFun = null,
        errorFun = showError)

}

async function updateDOMreceived(result) {

    getComplaintActions(result.complaint[0].complaintID)
}



