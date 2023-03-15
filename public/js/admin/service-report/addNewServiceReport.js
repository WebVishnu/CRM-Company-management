$.valHooks.number = {
    get: function (elem) {
        return elem.value * 1;
    }
};
appyOnFocusShortcuts()
let cursor = 0
function appyOnFocusShortcuts() {
    $('.form-control').on('focusin', () => {
        keyboardJS.unbind('backspace')
        keyboardJS.bind('esc', (e) => {
            $('input.form-control').blur()
        });
    })
    $('.form-control').on('focusout', () => {
        keyboardJS.bind('esc', (e) => {
            if (keyboardShortcut.hasClass('active')) {
                $('html').css('overflow-y', 'auto')
                keyboardShortcut.removeClass('active')
            }
        });
        keyboardJS.bind('alt + b', (e) => {
            e.preventDefault();
            window.location.replace("/vitco-india/control/service-reports/all")
        });
    })
    keyboardJS.bind('alt + b', (e) => {
        e.preventDefault();
        window.location.replace("/vitco-india/control/service-reports/all")
    });
}



// convert 1 digit numebr to three digit
function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}
// update report number every second
async function updateServiceReportNumber() {
    axios.get("/api/v1/service-report/get-report-number").then((response) => {
        res = pad(response.data.reportNumber, 3)
        $('.report-number').html(res)
        $('.report-number-input').val(res)
    })
}
setInterval(() => { updateServiceReportNumber() }, 500);

$(".date").html(`${moment().format('L').split('/')[1]}/${moment().format('L').split('/')[0]}/${moment().format('L').split('/')[2]}`)
$('input[name="date"]').val(moment().format('L'))
$('input[name="time"]').val(moment().format('LTS'))


var allMachines = []

// shortify string
function ShortifyString(str) {
    str = `${str}`
    if (str.length > 7) {
        return str.substr(0, 7) + "..."
    }
    return str
}

function isEmpty(obj) {
    let isempty;
    $.each(obj, function (key, value) {
        if (value.length == 0) {
            isempty = true;
            return false;
        }
    });
    return isempty;
}

// customer sign canvas intillization
let customerSignatureBlob = {}
let technicianSignatureBlob = {}
const CustomerSignCanvas = document.querySelector("#customer-sign-canvas");
const CustomersignaturePad = new SignaturePad(CustomerSignCanvas);
function CustomerResizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    CustomerSignCanvas.width = CustomerSignCanvas.offsetWidth * ratio;
    CustomerSignCanvas.height = CustomerSignCanvas.offsetHeight * ratio;
    CustomerSignCanvas.getContext("2d").scale(ratio, ratio);
    $('#CustomerCanvasStartCover').css({ 'display': 'none', "opacity": "0", "visibility": "hidden" });
}
// clear the sign
$('.clear-btn-customer-canvas').on('click', () => {
    CustomersignaturePad.clear();
})
// save the sign
$('.save-btn-customer-canvas').on('click', async () => {
    blob = await dataUriToBlob(CustomersignaturePad.toDataURL())
    $('.customer-sign-input').val(CustomersignaturePad.toDataURL())
    $('.customer-sign-img').attr("src", CustomersignaturePad.toDataURL())
    $('.customer-sign-img').css({ "height": "15em", "width": "20em" })
    $('#CustomerSignatureModal .close')[0].click()
    $('.btn-primary[data-target="#CustomerSignatureModal"]').css({ 'display': 'none' })
    customerSignatureBlob = new File([blob], "customer-sign-img");

})
document.getElementById('CustomerCanvasStartCover').addEventListener('click', CustomerResizeCanvas)


// customer sign canvas intillization
const TechnicianSignCanvas = document.querySelector("#technician-sign-canvas");
const TechniciansignaturePad = new SignaturePad(TechnicianSignCanvas);
function TechnicianResizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    TechnicianSignCanvas.width = TechnicianSignCanvas.offsetWidth * ratio;
    TechnicianSignCanvas.height = TechnicianSignCanvas.offsetHeight * ratio;
    TechnicianSignCanvas.getContext("2d").scale(ratio, ratio);
    $('#TechnicianCanvasStartCover').css({ 'display': 'none', "opacity": "0", "visibility": "hidden" });
}
// clear the sign
$('.clear-technician-sign-btn').on('click', () => {
    TechniciansignaturePad.clear();
})
// save the sign
$('.save-btn-technician-canvas').on('click', async () => {
    blob = await dataUriToBlob(TechniciansignaturePad.toDataURL())
    $('.technician-sign-img').attr("src", TechniciansignaturePad.toDataURL())
    $('.technician-sign-input').val(TechniciansignaturePad.toDataURL())
    $('.technician-sign-img').css({ "height": "15em", "width": "20em" })
    $('#TechnicianSignatureModal .close').click()
    $('.btn-primary[data-target="#TechnicianSignatureModal"]').css({ 'display': 'none' })
    technicianSignatureBlob = new File([blob], "technician-sign-img");
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = function () {
    //     console.log(file)
    // }
})
document.getElementById('TechnicianCanvasStartCover').addEventListener('click', TechnicianResizeCanvas)

function dataUriToBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }
    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}


// add machine function
// ================================================================================
$('.add-new-machine-btn').on('click', async () => {
    tempPartIN = {}
    let tempPartName = $('.partName').map(function () { return this.value; }).get();
    let tempPartSno = $('.partSno').map(function () { return this.value; }).get();
    let tempPartWty = $('.partWTY').map(function () { return this.value; }).get();
    let partsIn = []
    for (let i = 0; i < tempPartName.length; i++) {
        partsIn.push({
            partName: tempPartName[i],
            partSerialNumber: tempPartSno[i],
            partWty: tempPartWty[i],
        })
    }
    const addNewMachineData = {
        "machineName": $('#machine-name-input').val(),
        "machineNum": $('#seriel-num-input').val(),
        "machinePassword": $('#machine-password-input').val(),
        "warranty": $('#warranty').val(),
        "problem": $('#problem-input').val(),
        "actionTaken": $('#action-input').val(),
        "partsIN": partsIn,
        "partsOUT": $('.partsOUT').map(function () { return { partName: this.value }; }).get(),
        "status": $('#status').val(),
    }
    if (isEmpty(addNewMachineData) == undefined) {
        $('.add-new-machine-error').css('display', 'none');
        await clearNewMachineForm()
        allMachines.push(addNewMachineData)
        $('.allMachinesJsonDataInput').val(allMachines)
        $('#all-reports-body').append(`
            <tr>
                <td data-label="M. SNo.">${ShortifyString(addNewMachineData.machineNum)}</td>
                <td data-label="M. Name">${ShortifyString(addNewMachineData.machineName)}</td>
                <td data-label="Wty">${ShortifyString(addNewMachineData.warranty)}</td>
                <td data-label="Problem">${ShortifyString(addNewMachineData.problem)}</td>
                <td data-label="Action">${ShortifyString(addNewMachineData.actionTaken)}</td>
                <td data-label="Parts IN">${ShortifyString(addNewMachineData.partsIN[0].partName)}</td>
                <td data-label="Parts OUT">${ShortifyString(addNewMachineData.partsOUT)}</td>
                <td data-label="Status">${ShortifyString(addNewMachineData.status)}</td>
            </tr>
            `)
    }
    else {
        $('.add-new-machine-error').css('display', 'block');
        $('.add-new-machine-error').html("please fill all the fields")
    }
})


// ======================================================================================================
// update all machines service report table
function updateAllMachinesServiceReport(result) {
    $('#service-report-machine-id-input').val(result.Sid)
    $('.add-new-machine-error').css('display', 'none');
    sendAjaxRequest(
        url = `/api/v1/service-report/search/${result.Sid}`,
        method = "get",
        query = null,
        sunccessFun = (result) => {
            clearNewMachineForm()
            $('#all-reports-body').html('')
            for (let i = 1; i <= result.machines.length; i++) {
                $('#all-reports-body').append(`
                    <tr>
                        <td data-label="SNo.">${i}</td>
                        <td data-label="M. SNo.">${ShortifyString(result.machines[i - 1].machineNum)}</td>
                        <td data-label="M. Name">${ShortifyString(result.machines[i - 1].machineName)}</td>
                        <td data-label="Wty">${ShortifyString(result.machines[i - 1].warranty)}</td>
                        <td data-label="Problem">${ShortifyString(result.machines[i - 1].problem)}</td>
                        <td data-label="Action">${ShortifyString(result.machines[i - 1].actionTaken)}</td>
                        <td data-label="Parts IN">${ShortifyString(result.machines[i - 1].partsIN)}</td>
                        <td data-label="Parts OUT">${ShortifyString(result.machines[i - 1].partsOUT)}</td>
                        <td data-label="Status">${ShortifyString(result.machines[i - 1].status)}</td>
                    </tr>
                `)
            }
        },
        completeFun = null,
        showError = (e) => { console.log(e) }
    )
}

const partsInHtml = $('.parts-in-inputs-container').html()
const partsOutHtml = $('.parts-out-inputs').html()
// clear add new machine form 
async function clearNewMachineForm() {
    $('.parts-in-inputs-container').html(partsInHtml)
    $('.parts-out-inputs').html(partsOutHtml)
    $('#machine-name-input').val("")
    $('#seriel-num-input').val("")
    $('#problem-input').val("")
    $('#action-input').val("")
    $('.partsIN').val("")
    $('.partsOUT').val("")
    $('.partsWTY').val("")
    $('#machine-password-input').val("")
}

// submit new service report
$('#service-report-main-form').on('submit', (e) => {
    e.preventDefault()
    const formData = _.object($('#service-report-main-form').serializeArray().map(function (v) { return [v.name, v.value]; }))
    if (allMachines.length != 0) {
        if (formData.technicianSignImgDataUrl.length != 0 && formData.customerSignImgDataUrl.length != 0) {
            $(".submit-service-report-btn").replaceWith(`
            <button class="btn btn-primary shadow-none" type="button">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </button>`)
            axios.post('/api/v1/service-report/add-new', { formData, allMachines }).then((res) => {
                location.reload(true);
            })
        } else {
            $('.submit-report-error-text').html("Please sign your report")
        }
    } else {
        $('.submit-report-error-text').html("Machines can't be empty")
    }
})


// // share report
// $('.share-service-report-btn').on('click', () => {
//     axios.get('/api/v1/service-report/share-report')
//         .then((response) => {
//             console.log(response)
//         })
// })



// add new part sin inputs
function addNewPartsIN() {
    $('.parts-in-inputs')
        .append(`
        <div class="d-flex m-3">
            <div class="w-100">
                <input type="text" class="form-control shadow-none partName">
            </div>
            <div class="w-100">
                <input type="text" class="form-control shadow-none partSno">
            </div>
            <div class="w-100">
                <input type="text" class="form-control shadow-none partWTY">
            </div>
        </div>`)
    appyOnFocusShortcuts()
}
