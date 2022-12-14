$(document).on('keydown', function (event) { if (event.ctrlKey && event.keyCode == 81) { addNewMachineInputs() } })
$('.common-shortcuts').append('<li class="list-group-item"><span>Backspace</span> <span>Back to all reports</span></li>')
date = moment().format('L').split('/')
$('input[name="invoiceDate"]').val(`${date[1]}/${date[0]}/${date[2]}`)
$('input[name="warrantyFrom"]').val(moment().format('DD/MM/YYYY'))
$('input[name="invoiceNum"]').focus()
$('.datepicker').datepicker({ format: 'dd/mm/yyyy' });
let newMachineInputsNumber = 0
// add new machine service report on click function
$(".add-new-machine-service-report").on("click", function () { addNewMachineInputs() });
appyOnFocusShortcuts()
function appyOnFocusShortcuts(){
    $('input.form-control').on('focusin', () => {
        keyboardJS.unbind('backspace')
        keyboardJS.bind('esc', (e) => {
            $('input.form-control').blur()
        });
    })
    $('input.form-control').on('focusout', () => {
        keyboardJS.bind('esc', (e) => {
            if (keyboardShortcut.hasClass('active')) {
                $('html').css('overflow-y', 'auto')
                keyboardShortcut.removeClass('active')
            }
        });
        keyboardJS.bind('alt + b', (e) => {
            e.preventDefault();
            window.location.replace("/vitco-impex/control/sales-report/machine/all")
        });
    })
    keyboardJS.bind('alt + b', (e) => {
        e.preventDefault();
        window.location.replace("/vitco-impex/control/sales-report/machine/all")
    });
}

// convert 1 digit numebr to 3 digit
async function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// update report number every second
async function updatesalesReportNumber() {
    axios.get("/api/v1/sales-data/get-report-number").then((response) => {
        pad(response.data.reportNumber, 3).then((res) => {
            $('.report-number').html(res)
            $('.report-number-input').val(res)
        })
    })
}
// add new machine inputs
async function addNewMachineInputs() {
    newMachineInputsNumber += 1
    $('.total-machines-added').val(newMachineInputsNumber)
    $(".service-report-all-machine-info-inputs tbody").append(`
    <tr class="row-${newMachineInputsNumber} new-part">
            <td class="position-relative">
                <button type="button" style="position: absolute;left:1em;top:-1.7em;" class="btn btn-danger shadow-none" onclick="$(this).parent().parent().remove()">Delete</button>
                <input autocomplete="off" type="text" class="form-control shadow-none mx-1"
                    required name="machineName" aria-describedby="helpId"
                    placeholder="machine name">
            </td>
            <td>
                <input autocomplete="off" type="text" class="form-control shadow-none mx-1"
                    required name="machineNum" aria-describedby="helpId" placeholder="machine sno">
            </td>
            <td>
                <input autocomplete="off" type="number" class="form-control shadow-none mx-1 warranty-input"
                    required name="warrantyPeriod" onkeyup="updateWarrantyDate(${newMachineInputsNumber})"
                    aria-describedby="helpId" style="width:2.5em;" placeholder="0">
            </td>
            <td>
                <select class="form-select warranty-select" style="width:7em ;" onchange="updateWarrantyDate(${newMachineInputsNumber})"
                    name="warrantyType">
                    <option value="years" selected>years</option>
                    <option value="months">months</option>
                    <option value="weeks">weeks</option>
                    <option value="days">days</option>
                </select>
            </td>
            <td>
                <input autocomplete="off" type="text" class="form-control shadow-none mx-1 datepicker warranty-input"
                    required name="warrantyFrom" onkeyup="updateWarrantyDate(${newMachineInputsNumber})" onchange="updateWarrantyDate(${newMachineInputsNumber})"
                    aria-describedby="helpId" placeholder="warranty from" value="${moment().format('DD/MM/YYYY')}">
            </td>
            <td>
                <input autocomplete="off" readonly type="text"
                    class="form-control shadow-none mx-1 warranty-input" required name="warrantyTo"
                    onkeyup="updateWarrantyDate(${newMachineInputsNumber})" aria-describedby="helpId"
                    placeholder="warranty till">
            </td>
        </tr>`)
        appyOnFocusShortcuts()
}

function copyUpperMachineName(n) {
    if (n == 1) {
        $(`.machineName_${n}`).val($(`input[name="machineName"]`).val())
    } else {
        $(`.machineName_${n}`).val($(`.machineName_${n - 1}`).val())

    }
}


function formFunctions(task, value) {
    tempArr = [
        $('input[name="invoiceNum"]').val(''),
        $('input[name="customerName"]').val(''),
        $('input[name="address"]').val(''),
        $('input[name="mobileNum"]').val(''),
        $('input[name="warranty"]').val(''),
        $('input[name="machineName"]').val(''),
        $('input[name="machineNum"]').val(''),
        $('input[name="machinePass"]').val('')
    ]
    if (task == "readonly") {
        tempArr.forEach(element => {
            element.prop('readonly', value)
        });
    } else if (task == "empty") {
        tempArr.forEach(element => {
            element.val('')
        });
    }

}

// submitting report form 
$("#new-machine-sale-report-form").on("submit", (e) => {
    e.preventDefault();
    allMachines = []
    tempArr = $('input[name="machineName"]').map((i, e) => e.value).get()
    tempArr.forEach((element, i) => {
        allMachines.push({
            machineName: element.replaceAll('"',''),
            machineNum: $('input[name="machineNum"]')[i].value.replaceAll('"',''),
            warranty: {
                from: $(`.row-${i + 1} input[name="warrantyFrom"]`).val(),
                to: $(`.row-${i + 1} input[name="warrantyTo"]`).val()
            },
        })
    });
    $('.submit-machine-sale-report-btn').attr('type', "button").html(`
    <div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="sr-only">Loading...</span>
    </div>`)
    axios.post(`/api/v1/sales-data/machine/add-new`, {
        invoiceDate: $('input[name="invoiceDate"]').val(),
        invoiceNum: $('input[name="invoiceNum"]').val(),
        customerName: $('input[name="customerName"]').val(),
        address: $('input[name="address"]').val(),
        mobileNum: $('input[name="mobileNum"]').val(),
        allMachines: allMachines
    }).then((response) => {
        $('input[name="invoiceNum"]').focus()
        $('.submit-machine-sale-report-btn').removeClass('btn-primary').addClass('btn-success').html(`Submitted successfully`)
        setTimeout(() => {
            $('.submit-machine-sale-report-btn').attr('type', "submit").removeClass('btn-success').addClass('btn-primary').html(`Submit`)
        }, 700)
        formFunctions("empty", '')
        $('input').not('input[name="invoiceDate"]').not('input[name="warrantyFrom"]').val('')
    })
})

// update warranty date for parts
function updateWarrantyDate(rowNum) {
    $(`.row-${rowNum} input[name="warrantyTo"]`)
        .val(moment($(`.row-${rowNum} input[name="warrantyFrom"]`).val(), 'DD/MM/YYYY')
            .add($(`.row-${rowNum} input[name="warrantyPeriod"]`).val(), $(`.row-${rowNum} select[name="warrantyType"]`).val()).format('DD/MM/YYYY'))
}