// ajax request
async function sendAjaxRequest(url, method, query = null, sunccessFun, completeFun = null, errorFun) {
    if (query) {
        // try 
        await $.ajax({
            url: `https://${webHost}${url}`,
            cache: false,
            type: method,
            data: {
                query 
            },
            success: sunccessFun,
            complete: completeFun,
            error: errorFun,
        })
    }
    // catch (error) {
    // console.error("There was an error sending the request", error.Message);
    // }

    else {
        // try {

        await $.ajax({
            url: `https://${webHost}${url}`,
            cache: false,
            type: method,
            success: sunccessFun,
            complete: completeFun,
            error: errorFun,
        })
        // } catch (error) {
        // console.error("There was an error sending the request", error.Message);
        // }
    }
} 
