async function deleteAdmin(id) {
  await axios.post("/api/v1/vitco-india/control-admins/delete",{
    AdminId: id
  }).then((res)=>{
    console.log(res)
    if(res.data.success){
      location.reload(true);
    }else{

    }
  }).catch((e)=>{
    console.log(e)
  })
  // await sendAjaxRequest(
  //   (url = "/api/v1/vitco-india/control-admins/delete"),
  //   (method = "POST"),
  //   (query = { AdminId: id }),
  //   (sunccessFun = (result) => {
  //     if (result.success) {
  //       location.reload(true);
  //     }
  //   }),
  //   (completeFun = null),
  //   (showError = (e) => {
  //     console.log(e);
  //   })
  // );
}

// generate pass
function generatePassword() {
  retVal = "vitco@";
  retVal += Math.floor(Math.random() * (9999 - 1111 + 1) + 1111)
  return retVal;
}

// edit admin api req
function getAdminDetails(id) {
  const url = `/api/v1/vitco-india/control-admins/view/${id}`;
  axios.get(url).then((result) => {
    $(".edit-admin-fullName-input").val(result.data.admin[0].adminName);
    $(".edit-admin-username-input").val(result.data.admin[0].userName);
    $(".edit-admin-role-input").val(result.data.admin[0].role[0].roleName);
    $(".edit-admin-id-input").val(result.data.admin[0]._id);
    checkPermissionInput("complaints", 0, result.data);
    checkPermissionInput("machineSalesData", 4, result.data);
    checkPermissionInput("partSalesData", 8, result.data);
    checkPermissionInput("serviceReport", 12, result.data);
    checkPermissionInput("deliveryOrderVoucher", 16, result.data);
  }).catch((e) => {
    console.log(e)
  })
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
