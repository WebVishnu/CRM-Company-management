keyboardJS.bind('esc', (e) => {
    // checkclass()
    $('.complaint-details-modal').removeClass("active");
});
keyboardJS.bind('a', (e) => {
    $('.actions-dialog-box-container').toggleClass("open")
});
$('.new-action-text-area').on('focusout', (e) => {
    keyboardJS.bind('a', (e) => {
        $('.actions-dialog-box-container').toggleClass("open")
    });
})

$('.new-action-text-area').on('focus', (e) => {
    keyboardJS.unbind('a');
})




// reusable functions 
// short the string
function ShortifyString(str) {
    str = `${str}`
    if (str.length > 15) {
        return str.substr(0, 15) + ".."
    }
    return str
}



// get all complaints
async function getAllComplaints() {
    searchInput.val('')
    $('.refresh-complaints').addClass('rotate-360')
    $("li button").removeClass("active")
    $("li[data-filter='all'] button").addClass("active")
    await axios.get("/api/v1/all-users/complaints/32c1a3bf323a1e635f5f75b1726d3e5")
        .then((result) => {
            $('.refresh-complaints').removeClass('rotate-360')
            $(`.total-complaints`).html('')
            setFilterComplaintsLength('all', result.data.complaints.length)
            printComplaints(result.data.complaints)
        })
}


// change status 
async function changeStatus(status, id) {
    axios.post('/api/v1/user/complaints/update-status/eS4NYm0iT1W-YRUA%3A1657954289598&ei=8V_SYoGPJPnb4-EPs_CsWA&ved=0ah', {
        query: {
            complaintID: id,
            status
        }
    }).then((result) => {
        $('#user-details-input-current-status').html(result.data.complaintStatus)
    }).catch((error) => {
        console.log(error)
    })
}

// update status 
async function checkStatus(actions, complaintID) {
    if (actions.length > 0) {
        s = ""
        actions.forEach(element => {
            if (element.action == "done") {
                s = "Solved"
            } else {
                s = "Progress"
            }
        });
        changeStatus(s, complaintID)
        if (s == "Solved") {
            $('.add-new-action-form').addClass("hide")
            $('.add-new-action-completed-text').removeClass("hide")
        } else {
            $('.add-new-action-form').removeClass("hide")
            $('.add-new-action-completed-text').addClass("hide")

        }
    } else if (actions.length == 0) {
        $('.add-new-action-form').removeClass("hide")
        $('.add-new-action-completed-text').addClass("hide")
        changeStatus("Pending", complaintID)
    }
}


// print complaints 
async function printComplaints(complaints) {
    data = ``
    for (var i = complaints.length - 1; i >= 0; i--) {
        lastAction = complaints[i].actions[complaints[i].actions.length - 1]
        data += `
            <tr style='user-select: none' class="cursor-pointer single-complaint-row" onclick='$(".complaint-details-modal").addClass("active").trigger("classChange");viewComplaintDetails(${JSON.stringify(complaints[i])});'>
                <td data-label="Complaint ID" style="word-break: break-word;">${ShortifyString(moment(complaints[i].dateIssued).format('DD-MM-YYYY'))}</td>
                <td data-label="Seriel Number" style="word-break: break-word;">${ShortifyString(complaints[i].machineSerielNumber)}</td>
                <td data-label="Name" style="word-break: break-word;">${ShortifyString(complaints[i].userDetails.customerName)}</td>
                <td data-label="Number" style="word-break: break-word;">${ShortifyString(complaints[i].userDetails.contactNumber)}</td>
                <td data-label="Problem" style="word-break: break-word;">${ShortifyString(complaints[i].issue)}</td>
                <td data-label="Address" style='word-wrap: break-word'>${ShortifyString(complaints[i].userDetails.address)}</td>
                <td data-label="DOP" style="word-break: break-word;">${ShortifyString(complaints[i].DOP)}</td>
                <td class="complaint-status" data-status=${complaints[i].complaintStatus}><button>${(complaints[i].complaintStatus == "Solved" && complaints[i].actions.length > 0) ? `${(lastAction.action == "done") ? `${lastAction.date.split('/')[1]}/${lastAction.date.split('/')[0]}/${lastAction.date.split('/')[2]}` : checkStatus(complaints[i].actions, complaints[i]._id)}` : complaints[i].complaintStatus}</button></td>
                </tr>`
        // <button>${(complaints[i].complaintStatus == "Solved")?`<i class="bi bi-check-lg"></i>${(complaints[i].actions[complaints[i].actions.length-1].action == "done"?complaints[i].actions[complaints[i].actions.length-1].date:checkStatus(complaints[i].actions,complaints[i]._id)}`}</button></td>

    }
    $('#all-complaints-body').html(data)
    $("#loading-for-all-complaints").addClass("hide")
}

// view details
async function viewComplaintDetails(data) {
    $('.actions-dialog-box-container').removeClass("open")
    $('.req-changes-btn').removeClass('hide')
    $('.req-changes-submitted-h6').addClass('hide')
    $('.user-details-input-status').html(`<span id="user-details-input-current-status">Loading...</span><span onclick="changeStatusSingleComplaint()">(Change Status)</span>`)
    $('.user-detail-status').attr('data-status', `${data.complaintStatus}`)
    $('.user-details-input-registeration-date').val((data.dateIssued != '') ? data.dateIssued : "No date available")
    $('.user-details-input-complaintID').val(data.complaintID)
    $('.user-details-input-machine-name').val(data.machineName)
    $('.user-details-input-_id').val(data._id)
    $('.user-details-input-machineSerielNumber').val(data.machineSerielNumber)
    $('.user-details-input-customerName').val(data.userDetails.customerName)
    $('.user-details-input-contactNumber').val(data.userDetails.contactNumber)
    $('.user-details-input-DOP').val(data.DOP)
    $('.user-details-input-issue').val(data.issue)
    $('.user-details-input-address').val(data.userDetails.address)
    $('#user-details-input-current-status').html(data.complaintStatus)
    if (!data.files[0].url) {
        $('.complaint-video-outer').html(" <h6> No file Uploaded</h6>")
    } else {
        $('.complaint-video-outer').html(`<button class="btn btn-primary shadow-none" onclick="location.href='/${data.files[0].url}';"">Open Video</button>`)
    }
    updateComplaintActions(data.actions)

}



// update actions DOM
async function updateComplaintActions(actions) {
    data = ``
    complaintID = $('.user-details-input-_id').val()
    checkStatus(actions, complaintID)
    if (actions.length != 0) {
        for (var i = actions.length - 1; i >= 0; i--) {
            data += `
                <a class="list-group-item rounded-0 list-group-item-action flex-column align-items-start active cursor-pointer" style="margin:1px 0">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${actions[i].adminName}</h5>
                        <small style="color: #fff;">${actions[i].time} - ${actions[i].date.split('/')[1]}/${actions[i].date.split('/')[0]}/${actions[i].date.split('/')[2]}</small>
                    </div>
                    <p class="mb-1" style="color: #fff;">${actions[i].action}</p>
                </a>`
        }
    } else {

        data += `<h5 class="text-secondary text-center my-5">No actions</h5>`
    }
    $('.complaint-actions').html(data)
}

// add new action
async function addNewAction(id, action) {
    axios.post(`/api/v1/add-new-action/complaint/${id}`, {
        query: {
            time: moment().format('LTS'),
            date: moment().format('L'),
            action: action
        }
    }).then((result) => {
        $('.new-action-text-area').val("")
        checkclass()
        updateComplaintActions(result.data.complaint[0].actions)
    })
}

// submit add action form
$('.add-new-action-form').on('submit', (e) => {
    e.preventDefault()
    var id = $('.user-details-input-complaintID').val()
    var action = $('.new-action-text-area').val()
    addNewAction(id, action)
})

// turn On/Off readonly fields
async function toggleComplaintInputAccess(Tv) { // Tv --  toggle value
    $('.user-details-input-machineSerielNumber').attr('readonly', Tv);
    $('.user-details-input-customerName').attr('readonly', Tv);
    $('.user-details-input-contactNumber').attr('readonly', Tv);
    $('.user-details-input-DOP').attr('readonly', Tv);
    $('.user-details-input-address').attr('readonly', Tv);
}

$('.req-changes-btn').on('click', (e) => {
    toggleComplaintInputAccess(false)

    $('.req-changes-btn').addClass('hide')
    $('.req-changes-submit-btn').removeClass('hide')
    $('.req-changes-btn').css('position', 'absolute')
})


$('.req-changes-submit-btn').on('click', (e) => {
    axios.post('/vitco-impex/control/admin/send/new-notification/vitcoAdmin', {
        title: "Complaint Changes Admin",
        message: `
        ${adminName} Requested some changes in complaint <br><br>
        <input type="hidden" value="${$('.user-details-input-_id').val()}" class="complaintID">
        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th scope="row">Complaint ID</th>
                    <td style="word-break:break-all" id="complaintID">${$('.user-details-input-complaintID').val()}</td>
                </tr>
                <tr>
                    <th scope="row">M SNo.</th>
                    <td style="word-break:break-all" id="machineSerielNumber">${$('.user-details-input-machineSerielNumber').val()}</td>
                </tr>
                <tr>
                    <th scope="row">C Name</th>
                    <td style="word-break:break-all" id="customerName">${$('.user-details-input-customerName').val()}</td>
                </tr>
                <tr>
                    <th scope="row">Mob.</th>
                    <td style="word-break:break-all" id="contactNumber">${$('.user-details-input-contactNumber').val()}</td>
                </tr>
                <tr>
                    <th scope="row">DOP</th>
                    <td style="word-break:break-all" id="DOP">${$('.user-details-input-DOP').val()}</td>
                </tr>
                <tr>
                    <th scope="row">Address</th>
                    <td style="word-break:break-all" id="address">${$('.user-details-input-address').val()}</td>
                </tr>
            </tbody>
        </table>`
    }).then(() => {
        toggleComplaintInputAccess(true)
        $('.close-complaint-details-btn').click()
        $('.req-changes-submit-btn').addClass('hide')
        $('.req-changes-submitted-h6').removeClass('hide')
    })
})

// filter complaints 
async function filterComplaint(query) {
    axios.post(`/api/v1/filter-status-complaint/complaint/${query}`, {
        query
    }).then((result) => {
        $(`.total-complaints`).html('')
        setFilterComplaintsLength(query, result.data.complaints.length)
        printComplaints(result.data.complaints)
    })
}



// set total filtered complaints
function setFilterComplaintsLength(status, n) {
    $(`li[data-filter=${status}] button span`).append(`(${n})`)
}


// onclick serarch complaints
$('#search-box').keyup(() => {
    axios.post('/api/v1/user/complaints/search/eS4NYm0iT1W-YRUA%3A1657954289598&ei=8V_SYoGPJPnb4-EPs_CsWA&ved=0ah', {
        query: $('#search-box').val()
    }).then((result) => {
        printComplaints(result.data.complaints)
    })
})


// check class 
function checkclass() {
    if ($('button[data-bs-target="#pills-home"]').hasClass('active')) {
        getAllComplaints()
    } else if ($('button[data-bs-target="#pills-solved"]').hasClass('active')) {
        filterComplaint("Solved")
    } else if ($('button[data-bs-target="#pills-progress"]').hasClass('active')) {
        filterComplaint("Progress")
    } else if ($('button[data-bs-target="#pills-pending"]').hasClass('active')) {
        filterComplaint("Pending")
    } else if ($('button[data-bs-target="#pills-deleted"]').hasClass('active')) {
        filterComplaint("Deleted")
    }
}


getAllComplaints()