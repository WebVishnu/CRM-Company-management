loadingHtml = `
<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
</div>`

const qrCodeInput = $('.qrCode-inputs').html()

$("form").on('submit', (e) => {
    e.preventDefault()
    fields = $("input[name='layoutFields']").map(function () { return $(this).val(); }).get();
    data = {
        title: $('input[name="layoutTitle"]').val(),
        fields: fields
    }
    $('.all-qrCodes-section button[type="submit"]').html(loadingHtml)
    axios.post('/api/v1/qr-code/layout/create-new', data).then((res) => {
        if (res.data.success) {
            TempData = ``
            res.data.layouts.forEach((layout, i) => {
                TempData += `<li data-layout-num="${i}" data-layout='${JSON.stringify(layout)}' class="layout user-select-none" onclick="$('.layout').not(this).removeClass('active');$(this).toggleClass('active')">${layout.title}</li>`
            });
            $('.all-layouts-container').html(TempData)
            $('.all-qrCodes-section button[type="submit"]').html(" Save Layout ")
            $('form input').val('')
            $('.qrCode-inputs').html(qrCodeInput)
        }
    })
})
// var typeNumber = 7;
// var errorCorrectionLevel = 'L';
// var qr = qrcode(typeNumber, errorCorrectionLevel);
// qr.addData('Hi!');
// qr.make();
// $('#qrCode').html(qr.createSvgTag(3,0))
// $('#qrCode svg rect').attr('fill','transparent')

$('.generate-new-qr-code-btn').on("click", (e) => {
    e.preventDefault()
    let fields = {}
    inputs = $('.qrCodeDetails .form-group')
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        fields[camelize(element.children[0].innerHTML)] = element.children[1].value
    }
    axios.post('/api/v1/qr-code/create-new', {
        title: $('.qrCodeDetailsTitle').html(),
        fields
    }).then((res) => {
        if (res.data.success) {
            var typeNumber = 8;
            var errorCorrectionLevel = 'L';
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(`https://${webHost}/vitco-impex/qr-code/get-info/${res.data.id}`);
            qr.make();
            $('#qrCode').html(qr.createSvgTag(4, 0)).addClass('active').css('background', '#005ba2')
            $('#qrCode svg rect').attr('fill', 'transparent')
            $('.qrCodeActionDetails').removeClass('hide')
            $('.qrCodeActionDetails a').attr('href', `http://${webHost}/vitco-impex/qr-code/get-info/${res.data.id}`)
            $('.generate-qr-code-container input').val('')
        } else {
            console.log(res)
        }
    })
})

// generate qr code
function generateQrCode(layout) {
    layout = JSON.parse(layout)
    $('.qrCodeDetailsTitle').html(layout.title)
    TempData = ``
    layout.fields.forEach((e, i) => {
        TempData += `<div class="form-group"><label for="${e}">${e}</label><input type="text" class="form-control shadow-none" id="${e}"></div>`
    });
    $(`.qrCodeDetails`).html(TempData)
}



// generate-qr-code-container
$('.generate-qr-code-btn').on('click', () => {
    selected = false
    for (let i = 0; i < $('.layout').length; i++) {
        const layout = $('.layout')[i];
        if (layout.classList.contains("active")) {
            selected = true
            generateQrCode(layout.dataset.layout)
            $('.generate-qr-code-container').removeClass('hide').fadeOut(0).fadeIn(100);
        }
    }
    if (!selected) {
        $('.all-qrCodes-section > div h6 span').html("Please select layout").css('color', 'red')
        setInterval(() => {
            $('.all-qrCodes-section > div h6 span').html("Your recent layouts").css('color', 'black')
        }, 1000);
    }
})

// get all qr codes 
$('.open-all-qr-codes-btn').on('click', () => {
    $('.allQrCodesLGmodal').html('')
    axios.get('/api/v1/qr-code/codes/all').then((response) => {
        response.data.qrCodes.forEach((qrCode,i) => {
            fields = Object.keys(qrCode.fields)
            data = `
            <span>
                <a href="javascript:void(0)" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="${qrCode.title}" style="cursor:default;"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span> ${qrCode.title}</span>  
                        <span class="badge bg-base-color rounded-0 p-2">${qrCode.createdBy.createdOn}</span>
                        <span class="badge bg-base-color p-1 cursor-pointer" style="font-size: 20px;" onclick="window.open('http://${webHost}/vitco-impex/qr-code/get-info/${qrCode._id}', '_blank');"><i class="bi bi-arrow-right-short"></i></span>
                </a>
                <div class="dropdown-menu qrCodeFieldsModal" data-qrCode="${i}" aria-labelledby="${qrCode.title}">
                    
                </div>
            </span>`
            $('.allQrCodesLGmodal').append(data)
            tempData = ``
            fields.forEach(field => {
                tempData += `<a class="dropdown-item">${field} : ${qrCode.fields[field]}</a>`
            });
            $(`.qrCodeFieldsModal[data-qrCode="${i}"]`).html(tempData)
        });
        
    })
})

// downlaod qr code
function downloadQrCode() {
    htmlToImage.toJpeg(document.getElementById('qrCode'), { quality: 0.95 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = `${$('.qrCodeDetailsTitle').html()}.jpeg`;
            link.href = dataUrl;
            link.click();
        }).catch((e) => {
            console.log(e)
            console.log("error")
        })
}

// PRINT QR CODE
function printQrCode() {
    $("#qrCode svg").css({'height': "80px", "width": "80px" })
    $("#qrCode svg").print({
        globalStyles: true,
        mediaPrint: false,
        stylesheet: null,
        noPrintSelector: ".no-print",
        iframe: true,
        append: null,
        prepend: null,
        manuallyCopyFormValues: true,
        deferred: $.Deferred(),
        timeout: 750,
        title: null,
        doctype: '<!doctype html>'
    });
    $("#qrCode svg").css({ 'margin': '0', 'height': "180px", "width": "180px" })

}

// shortcuts 
keyboardJS.bind('ctrl + q', (e) => {
    $('.qrCode-inputs').append(qrCodeInput)
});
keyboardJS.bind('esc', (e) => {
    $('.layout').removeClass('active')
    $('.generate-qr-code-container').addClass('hide').fadeIn(0).fadeOut(100);
    $('.qrCodeActionDetails').addClass('hide')
    $('#qrCode').html('<img src="/svg/yourQrCodeHere.svg">').css('background', 'transparent')
});
// bootstrap tooltips 
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// common functions
// camel case
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}