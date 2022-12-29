$('.div2').html(`${$('.div2').html().split('/')[1]}/${$('.div2').html().split('/')[0]}/${$('.div2').html().split('/')[2]}`)
var pages = -1
var addPageCalled = 0

addNewPage(0)
function isOverflown(element) {
    return element.prop('scrollHeight') - 1 > element.outerHeight();
}


async function addNewPage(index) {
    pages += 1
    $('body').append(`
        <page size="A4" id="page-${pages}">
            <div class="a4-1">
                ${$('.a4-1').html()}
            </div>
            <div class="all-machines-table-${pages}" style="height:487px;overflow-y:hidden;">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Machine</th>
                        <th scope="col">Wty</th>
                        <th scope="col">Problem</th>
                        <th scope="col">Action</th>
                        <th scope="col">Parts IN</th>
                        <th scope="col">Parts OUT</th>
                        <th scope="col">Part Wty</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody class="all-machines-table-tbody-${pages}">
                </tbody>
            </table>
            <div class="container-fluid signature-container-div" style="position:absolute;right:2em;bottom: 4em;width:90%">
            ${$('.primary-container-fluid').html()}
            </div>

            <hr style="position:absolute;bottom: 3.5em;width:21cm">
            <div class="container-fluid" style="position:absolute;bottom: 2em;width:21cm">
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <h6 class="service-report-issued-by-text">For any support : <span class="text-muted"> +91
                                9319797703</span></h6>
                        <h6 class="service-report-issued-by-text mx-5">For any complaint : <a href="https://vitcoimpex.in/" target="_black" style="text-decoration:none" class="text-muted">
                        https://vitcoimpex.in/</a></h6>
                    </div>
                </div>
            </div>
            <div class="qrCode"></div>
        </page>`)
    var overflowed = false
    var lastIndex = 0
    var table = $(`.all-machines-table-${pages}`)
    for (let i = index; i < services.length; i++) {
        $(`.all-machines-table-tbody-${pages}`).append(`
            <tr data-row-index=${i} data-table-no=${pages} class="table-row-${pages}">
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${services[i].machineName}\n${services[i].machineNum.trim()}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:3em;" rows="1"
                        oninput="autosize(this)">${services[i].warranty.trim()}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${services[i].problem.trim()}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${services[i].actionTaken.trim()}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea parts-in-part-name-${i}" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)"></textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea parts-in-part-out-${i}" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)"></textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea parts-in-part-wty-${i}" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)"></textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:5em">
                    <textarea id='print-txt-area-id' data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${services[i].status.trim()}</textarea>
                </td>
            </tr>`)
        if (!(0 in services[i].partsIN[0])) {
            $(`tr[data-row-index=${i}] td:nth-child(1)`).attr('rowspan', Math.max(services[i].partsIN.length, services[i].partsOUT.length))
            $(`tr[data-row-index=${i}] td:nth-child(2)`).attr('rowspan', Math.max(services[i].partsIN.length, services[i].partsOUT.length))
            $(`tr[data-row-index=${i}] td:nth-child(3)`).attr('rowspan', Math.max(services[i].partsIN.length, services[i].partsOUT.length))
            $(`tr[data-row-index=${i}] td:nth-child(4)`).attr('rowspan', Math.max(services[i].partsIN.length, services[i].partsOUT.length))
            $(`tr[data-row-index=${i}] td:nth-child(8)`).attr('rowspan', Math.max(services[i].partsIN.length, services[i].partsOUT.length))
            $(`.parts-in-part-name-${i}`).val((services[i].partsIN[0].partSerialNumber != '') ? services[i].partsIN[0].partSerialNumber : services[i].partsIN[0].partName)
            $(`.parts-in-part-out-${i}`).val(services[i].partsOUT[0].partName)
            $(`.parts-in-part-wty-${i}`).val(services[i].partsIN[0].partWty)
            for (let j = 1; j < Math.max(services[i].partsIN.length, services[i].partsOUT.length); j++) {
                if (services[i].partsIN[j] != undefined && services[i].partsIN[j] != undefined && services[i].partsIN[j] != undefined) {
                    $(`.all-machines-table-tbody-${pages}`).append(`
                    <tr data-row-parts="part-row-${i}">
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(services[i].partsIN[j].partSerialNumber != '') ? services[i].partsIN[j].partSerialNumber : services[i].partsIN[j].partName}</textarea>
                    </td>
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(services[i].partsOUT[j] != undefined) ? services[i].partsOUT[j].partName : ''}</textarea>
                    </td>
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${services[i].partsIN[j].partWty}</textarea>
                    </td>
                    </tr>`)
                }else if(services[i].partsOUT[j] != undefined){
                    $(`.all-machines-table-tbody-${pages}`).append(`
                    <tr data-row-parts="part-row-${i}">
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)"></textarea>
                    </td>
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(services[i].partsOUT[j] != undefined) ? services[i].partsOUT[j].partName : ''}</textarea>
                    </td>
                    <td style="word-break:break-all;font-size:12px;overflow-y:hidden;width:7em;">
                    <textarea data-TextareaPageNo=${pages} class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)"></textarea>
                    </td>
                    </tr>`)
                }
            }
        } else {
            partInInputsArr = '', partOutInputsArr = '', partWtyInputsArr = ''
            for (let j = 0; j < services[i].partsIN.length; j++) {
                tempVar = ""
                for (let k = 0; k < Object.keys(services[i].partsIN).length; k++) {
                    t = services[i].partsIN[j][k]
                    ok = Object.keys(services[i].partsIN[j])[k]
                    if (t != "?" && t != ">" && ok != "partName" && ok != "partSerialNumber" && ok != "partWty") {
                        tempVar += t
                    }
                }
                partInInputsArr += `${tempVar},`
            }
            for (let j = 0; j < services[i].partsOUT.length; j++) {
                tempVar = ""
                for (let k = 0; k < Object.keys(services[i].partsOUT[0]).length; k++) {
                    t = services[i].partsOUT[j][k]
                    ok = Object.keys(services[i].partsOUT[j])[k]
                    if (t != "?" && t != ">" && ok != "partName" && ok != "partSerialNumber" && ok != "partWty") {
                        tempVar += t
                    }
                }
                partOutInputsArr += `${tempVar},`
            }
            $(`.parts-in-part-name-${i}`).val(partInInputsArr.replace(',', '\n'))
            $(`.parts-in-part-out-${i}`).val(partOutInputsArr.replace(',', '\n'))
            // $(`.parts-in-part-wty-${i}`).val(services[i].partWarranty.replaceAll(' ?>> ', '\n'))
        }
        for (let j = 0; j < $('.print-textarea').length; j++) {
            const element = $('.print-textarea')[j];
            autosize(element)
        }
        if (isOverflown(table)) {
            lastIndex = i
            if (index != lastIndex) {
                $(`tr[data-row-index=${i}]`).remove()
                $(`tr[data-row-parts="part-row-${i}"]`).remove()
                overflowed = true
            }
            break
        }
    }

    var typeNumber = 10;
    var errorCorrectionLevel = 'H';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(window.location.origin + `/user/service-report/view/${reportID}`);
    qr.make();
    $('.qrCode').html(qr.createSvgTag())
    if (overflowed) {
        addNewPage(lastIndex)
    }
}

// print file
async function printDiv() {
    $('.print-button').css('display', 'none');
    $('.back-button').css('display', 'none');
    $('.all-machines-table').css('overflow-y', 'hidden')
    $('body').attr('style', "background-color:#fff!important");
    $('.back-button').addClass('hide')
    $('.print-button').addClass('hide')
    $('.print-textarea').css('resize', 'none')
    window.print();
    $('.print-textarea').css('resize', 'none')
    $('.print-button').removeClass('hide')
    $('.back-button').removeClass('hide')
    $('.all-machines-table').css('overflow-y', 'auto')
    $('.back-button').css('display', 'inline');
    $('.print-button').css('display', 'inline')
    $('body').attr('style', "overflow-y:auto");
    $('html').attr('style', "overflow-y:auto");
}

// downlaod file
async function downloadFile() {
    $('body').attr('style', "background-color: #fff;");
    $('.back-button').css('display', 'none');
    $('.download-file-btn').html(`<div class="spinner-border spinner-border-sm" role="status"></div>`)

    var element = document.getElementById('page');
    var opt = {
        margin: 0,
        filename: 'service report.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save().then(() => {
        $('.download-file-btn').html(`<i class="bi bi-download"></i>`)
        $('.back-button').css('display', 'inline');
    });
}


function autosize(textArea) {
    textArea.style.height = (textArea.scrollHeight) + "px";
}



