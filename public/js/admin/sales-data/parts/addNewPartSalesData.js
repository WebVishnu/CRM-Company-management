$(document).on('keydown', function (event) { if (event.ctrlKey && event.keyCode == 81) { addNewMachineInputs() } })
$('.common-shortcuts').append('<li class="list-group-item"><span>Backspace</span> <span>Back to all reports</span></li>')
date = moment().format('L').split('/')
$('input[name="invoiceDate"]').val(`${date[1]}/${date[0]}/${date[2]}`)
$('input[name="warrantyFrom"]').val(moment().format('DD/MM/YYYY'))
let newMachineInputsNumber = 1
$('input[name="invoiceNum"]').focus()
// add new machine service report on click function
$(".add-new-machine-service-report").on("click", function () { addNewMachineInputs() });
$('.datepicker').datepicker({ format: 'dd/mm/yyyy' });

appyOnFocusShortcuts()
function appyOnFocusShortcuts() {
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
            window.location.replace("/vitco-impex/control/sales-report/parts/all")
        });

    })

    keyboardJS.bind('alt + b', (e) => {
        e.preventDefault();
        window.location.replace("/vitco-impex/control/sales-report/parts/all")
    });
}

// convert 1 digit numebr to 3 digit
async function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// update report number every second
async function updatesalesReportNumber() {
    axios.get("/api/v1/sales-data/parts/get-report-number").then((response) => {
        pad(response.data.reportNumber, 3).then((res) => {
            $('.report-number').html(res)
            $('.report-number-input').val(res)
        })
    })
}
// add new machine inputs
async function addNewMachineInputs() {
    newMachineInputsNumber++
    $(".service-report-all-parts-info-inputs tbody").append(`
    <tr class="row-${newMachineInputsNumber} new-part">
            <td class="position-relative">
                <button type="button" style="position: absolute;left:1em;top:-1.7em" class="btn btn-danger shadow-none" onclick="$(this).parent().parent().remove()">Delete</button>
                <input autocomplete="off" type="text" class="form-control shadow-none mx-1"
                    required name="partName" aria-describedby="helpId"
                    placeholder="part name">
            </td>
            <td>
                <input autocomplete="off" type="text" class="form-control shadow-none mx-1"
                    required name="partNumber" aria-describedby="helpId" placeholder="part sno">
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
    $('.datepicker').datepicker({ format: 'dd/mm/yyyy' });
    appyOnFocusShortcuts()
}


// functions for inputs
function inputFunctions(task, value) {
    arr = [
        $('input[name="invoiceDate"]'),
        $('input[name="invoiceNum"]'),
        $('input[name="customerName"]'),
        $('input[name="address"]'),
        $('input[name="mobileNum"]'),
        $('input[name="warranty"]'),
        $('input[name="partName"]'),
        $('input[name="partNumber"]'),
        $('input[name="password"]')
    ]
    if (task == "readonly") {
        arr.forEach(element => {
            element.attr('readonly', value)
        });
    } else if (task == "empty") {
        arr.slice(1, arr.length + 1).forEach(element => {
            element.val('')
        });
    }

}

function copyUpperMachineName(n) {
    if (n == 1) {
        $(`.machineName_${n}`).val($(`input[name="machineName"]`).val())
    } else {
        $(`.machineName_${n}`).val($(`.machineName_${n - 1}`).val())

    }
}


// submit form
$('#add-new-part-sale-report-form').on('submit', (e) => {
    e.preventDefault()
    allParts = []
    tempArr = $('input[name="partName"]').map((i, e) => e.value).get()
    tempArr.forEach((partName, i) => {
        allParts.push({
            partName,
            partNumber: $('input[name="partNumber"]')[i].value,
            warranty: {
                from: $(`.row-${i + 1} input[name="warrantyFrom"]`).val(),
                to: $(`.row-${i + 1} input[name="warrantyTo"]`).val()
            },
        })
    });
    $('.submit-part-sale-report-btn').attr('type', "button").html(`
    <div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="sr-only">Loading...</span>
    </div>`)
    inputFunctions("readonly", true)
    axios.post(`/api/v1/sales-data/parts/create-new`, {
        invoiceDate: $('input[name="invoiceDate"]').val(),
        invoiceNum: $('input[name="invoiceNum"]').val(),
        customerName: $('input[name="customerName"]').val(),
        address: $('input[name="address"]').val(),
        mobileNum: $('input[name="mobileNum"]').val(),
        parts: allParts
    }).then(() => {
        $('input[name="invoiceNum"]').focus()
        $('.submit-part-sale-report-btn').removeClass('btn-primary').addClass('btn-success').html(`Submitted successfully`)
        setTimeout(() => {
            $('.submit-part-sale-report-btn').attr('type', "submit").removeClass('btn-success').addClass('btn-primary').html(`Submit`)
        }, 1000)
        inputFunctions("readonly", false)
        inputFunctions("empty", '')
    })
})



// update warranty date for parts
function updateWarrantyDate(rowNum) {
    $(`.row-${rowNum} input[name="warrantyTo"]`)
        .val(moment($(`.row-${rowNum} input[name="warrantyFrom"]`).val(), 'DD/MM/YYYY')
            .add($(`.row-${rowNum} input[name="warrantyPeriod"]`).val(), $(`.row-${rowNum} select[name="warrantyType"]`).val()).format('DD/MM/YYYY'))
}