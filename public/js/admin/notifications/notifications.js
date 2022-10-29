
//shortify string
function ShortifyString(str) {
    str = `${str}`
    if (str.length > 60) {
        return str.substr(0, 60) + ".."
    }
    return str
}


$(window).on('hashchange', function (e) {
    if (window.location.pathname == "/vitco-india/control/admin/notifications") {
        getAllNotifications()
    }
});


async function notificationsDetails(notification) {
    $('.all-notifications-container').addClass('hide')
    $('.notification-details-container').removeClass('hide')
    $(".notification-details-container div").html(`
    <div class="row" style="margin-bottom:10em">
        <div class="col my-3 ml-2 font-spartan-400 ">
        <input type="hidden" value="${notification.adminID}" id="notificationAdminID">
        <input type="hidden" value="${notification.adminName}" id="notificationAdminName">
            <h6> <a href="/vitco-india/control/admin/notifications" class=" cursor-pointer text-secondary"> Notifications</a> / <span
                    class="text-primary text-capitalize">${notification.adminName}</span></h6>
        </div>
        <div class="col-12 ms-md-4 m-0">
            <div class="d-flex align-items-center ms-md-3">
                <img src="${notification.profilePhoto}" alt="" class="img-fluid"
                        style="border-radius:50%;max-height:3em;max-width:3em;height: 3em;width: 3em;">
                <div class="mt-3 text-capitalize ml-3">
                    <h6 class="m-0 p-0">${notification.adminName}</h6>
                    <p style="font-size:0.7em"> ${notification.time}</p>
                </div>
            </div>
        </div>
        <div class="col-12 ps-md-5 mt-4 arimo-600 text-capitalize">
            <h1 class="notification-title">${notification.notificationTitle}</h1>
        </div>
        <div class="col-md-7 ml-md-5 arimo-600">
        ${notification.message}
        </div>
        <div class="col-12"> 
        <button class="btn btn-secondary rounded-0 ms-md-5 mt-4 shadow-none" style="position:fixed;bottom:5px;right:5px" onclick="location.href='/vitco-india/control/admin/notifications'">Go back</button>
          </div>
    </div>`)

}



async function printAllNotifications(response) {
    data = ``
    if (response.data.notifications.length != 0) {
        for (let i = response.data.notifications.length - 1; i >= 0; i--) {
            const element = response.data.notifications[i];
            data += `<a class="list-group-item my-2 list-group-item-action cursor-pointer" style="user-select:none" aria-current="true">
                                <div class="d-flex w-100" onclick='notificationsDetails(${JSON.stringify(element)})'>
                                    <img src="${element.profilePhoto}" alt="" class="img-fluid"
                                    style="border-radius:50%;max-height:3em;max-width:3em;height: 3em;width: 3em;">
                                    <div class="d-flex w-100 justify-content-between align-items-center">
                                        <h5 class="mb-2 ml-3 text-capitalize">${element.adminName}</h5>
                                        <small>${element.time}</small>
                                        </div>
                                    </div>
                                <div class="d-flex align-items-center justify-content-between">
                                    <p class="my-3 ml-3" onclick='notificationsDetails(${JSON.stringify(element)})'>${ShortifyString(element.message.replace("<br>", ""))}</p>
                                    <i class="bi bi-trash delete-notification-btn" onclick="deleteNotification('${element._id}')"></i>
                                </div>
                            </a>`
        }
    } else {
        data += `
        <div class="container">
            <div class="row">
                <div class="col d-flex justify-content-center mt-5">
                    <img src="/svg/no-notifications.svg">
                </div>
            </div>
        </div>
        `
    }
    $('.all-notifications-group').html(data)
}

// get all notifications
async function getAllNotifications() {
    $('.all-notifications-container').removeClass('hide')
    $('.notification-details-container').addClass('hide')
    axios.get(`/vitco-impex/control/admin/get-notifications/${adminID}/all`)
        .then(function (response) {
            printAllNotifications(response)
            $('.notifications-loading').addClass('hide')
            $('.notifications-loading').css('position', "absolute")
        })
}


// apply changes function 
async function applyChanges() {
    taskTitle = $('.notification-title').html()
    if (taskTitle == "Complaint Changes Admin") {
        $('.apply-changes-button').html('Please wait...')
        axios.post(`/api/v1/update-complaint-details/${$('.complaintID').val()}`, {
            machineSerielNumber: $('#machineSerielNumber').html(),
            userDetails: {
                customerName: $('#customerName').html(),
                contactNumber: $('#contactNumber').html(),
                address: $('#address').html(),

            },
            DOP: $('#DOP').html(),
        }).then(() => {
            $('.apply-changes-button').replaceWith('<button class="btn btn-success shadow-none" style="position: fixed;bottom:5px;right:7em" onclick="applyChanges()">Changes Applied</button>')
        })
    } else if (taskTitle == "Change Password") {
        $('.apply-changes-button').html('Please wait...')
        axios.post('/vitco-india/control/admin/change-pass', {
            adminID: $('#notificationAdminID').val(),
            newPassword: $('#new-password').html()
        }).then(() => {
            axios.post(`/vitco-impex/control/admin/send/new-notification/${$('#notificationAdminID').val()}`, {
                title:"Your password changed",
                message:`Admin has changed your password <br> New Password :${$('#new-password').html()}`
              }).then((res)=>{
                  $('.apply-changes-button').replaceWith('<button class="btn btn-success shadow-none" style="position: fixed;bottom:5px;right:7em" onclick="applyChanges()">Changes Applied</button>')
              })
        })
    }
}



async function deleteNotification(id) {
    axios.post('/vitco-impex/control/admin/delete-notifications', {
        notificationID: id
    }).then(() => { location.reload(); })
}


getAllNotifications()