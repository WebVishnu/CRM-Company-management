
var pages = -1
var addPageCalled = 0

addNewPage(0)
function isOverflown(element) {
    return element.prop('scrollHeight') - 1 > element.outerHeight();
}


function addNewPage(index) {
    pages += 1
    $('body').append(`
        <page size="A4" id="page-${pages}">
            <div class="a4-1">
                ${$('.a4-1').html()}
            </div>
            <div class="all-parts-table-${pages}" style="height:720px;overflow-y:hidden;display: flex;justify-content: center;align-items: flex-start;">
            <table class="table table-sm all-machine-table-${pages}">
                <thead>
                    <tr>
                        <th scope="col">${(option == "machine") ? "Machine" : "Part"} name</th>
                        <th scope="col">Seriel Num</th>
                        <th scope="col">Password</th>
                        <th scope="col">Warranty from</th>
                        <th scope="col">Warranty Till</th>
                    </tr>
                </thead>
                <tbody class="all-parts-table-tbody-${pages}">
                </tbody>
            </table>

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
    var tableBody = $(`.all-parts-table-tbody-${pages}`)
    var table = $(`.all-parts-table-${pages}`)
    for (let i = index; i < allParts.length; i++) {
        const part = allParts[i];
        tableBody.append(`
        <tr class="row-${i}">
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(option == "machine") ? part.machineName : part.partName}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(option == "machine") ? part.machineNum : part.partNumber}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                <textarea id='print-txt-area-id' class="print-textarea" spellcheck="false" type="text"
                    style="word-break:break-word;border:none;width:100%;" rows="1"
                    oninput="autosize(this)">${part.password}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${part.warranty.from}</textarea>
                </td>
                <td style="word-break:break-all;font-size:12px;overflow-y:hidden">
                    <textarea id='print-txt-area-id' class="print-textarea" spellcheck="false" type="text"
                        style="word-break:break-word;border:none;width:100%;" rows="1"
                        oninput="autosize(this)">${(part.warranty.to == 0) ? report.warranty : part.warranty.to}</textarea>
                </td>
            </tr>
        `)
        if (isOverflown(table)) {
            console.log("overflown: " + i)
            lastIndex = i
            if (index != lastIndex) {
                $(`tr[data-row-index=${i}]`).remove()
                $(`tr[data-row-parts="part-row-${i}"]`).remove()
                overflowed = true
            }
            break
        }
    }
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



