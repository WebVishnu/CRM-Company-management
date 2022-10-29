async function deleteAdmin(id) {
  await sendAjaxRequest(
    (url = "/api/v1/vitco-india/control-admins/delete"),
    (method = "POST"),
    (query = { AdminId: id }),
    (sunccessFun = (result) => {
      if (result.success) {
        location.reload(true);
      }
    }),
    (completeFun = null),
    (showError = (e) => {
      console.log("error: " + e.statusText);
    })
  );
}

// generate pass
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

// edit admin api req
function getAdminDetails(id) {
  const url = `/api/v1/vitco-india/control-admins/view/${id}`;
  axios.get(url).then((result)=>{
    console.log(result.data.admin[0]);
    $(".edit-admin-fullName-input").val(result.data.admin[0].adminName);
    $(".edit-admin-username-input").val(result.data.admin[0].userName);
    $(".edit-admin-role-input").val(result.data.admin[0].role[0].roleName);
    $(".edit-admin-id-input").val(result.data.admin[0]._id);
    checkPermissionInput("complaints", 0, result.data);
    checkPermissionInput("machineSalesData", 4, result.data);
    checkPermissionInput("partSalesData", 8, result.data);
    checkPermissionInput("serviceReport", 12, result.data);
  }).catch((e)=>{
    console.log(e)
  })
  // sendAjaxRequest(
  //   url,
  //   (method = "GET"),
  //   (query = null),
  //   (sunccessFun = (result) => {
  //     $(".edit-admin-fullName-input").val(result.admin[0].adminName);
  //     $(".edit-admin-username-input").val(result.admin[0].userName);
  //     $(".edit-admin-role-input").val(result.admin[0].role[0].roleName);
  //     $(".edit-admin-id-input").val(result.admin[0]._id);
  //     checkPermissionInput("complaints", 0, result);
  //     checkPermissionInput("machineSalesData", 4, result);
  //     checkPermissionInput("partSalesData", 8, result);
  //     checkPermissionInput("serviceReport", 12, result);
  //   }),
  //   (completeFun = null),
  //   (showError = (e) => {
  //     console.log("error: " + e.statusText);
  //   })
  // );
}

// checking inputs
function checkPermissionInput(permission_name, strPoint, result) {
  for (let i = 0; i <= result.admin[0].permissions.length - 1; i++) {
    if (result.admin[0].permissions[i].permissionName == permission_name) {
      if (result.admin[0].permissions[i].permissionKeys[0].keyName == "view") {
        $("#editAdmin :checkbox")[strPoint].checked = true;
      }
      if (result.admin[0].permissions[i].permissionKeys[1].keyName == "edit") {
        $("#editAdmin :checkbox")[strPoint + 1].checked = true;
      }
      if (result.admin[0].permissions[i].permissionKeys[2].keyName == "create") {
        $("#editAdmin :checkbox")[strPoint + 2].checked = true;
      }
      if (result.admin[0].permissions[i].permissionKeys[3].keyName == "delete") {
        $("#editAdmin :checkbox")[strPoint + 3].checked = true;
      }
    }
  }
}
