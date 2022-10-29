// show update profile btn
adminInputs = document.querySelectorAll('.admin-inputs')
for (let i = 0; i < adminInputs.length; i++) {
    const element = adminInputs[i];
    element.onkeyup = function(){
        $('.update-admin-profile-btn').removeClass('hide')
    }
    element.onchange = function(){
        $('.update-admin-profile-btn').removeClass('hide')
    }
}

// change profile photo
$('.upload-admin-profile-photo-input').on("change", function () {
    const file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            $('.admin-profile-img').attr('src', event.target.result);
            $('.upload-admin-profile-photo-data-url-input').val(event.target.result);
        }
        reader.readAsDataURL(file);
    }
});

// submit req (change password)
$('#reqAdminChangePass').on('submit', function (e) {
    e.preventDefault()
    password = $("#reqAdminChangePass input[name='pass']").val()
    axios.post('/vitco-impex/control/admin/send/new-notification/vitcoAdmin', {
        title:"Change Password",
        pass: password,
        message:`Hi, <br> Vitco Admin ${adminUsername} requested to change <br> Password: <h6 id="new-password" class="d-inline"> ${password}</h6>`
      })
      .then(function (response) {
        $("button[data-dismiss='modal']").click();
        $("button[data-target='#reqToChangePassModal']").replaceWith('<h6 class="text-secondary">Your request submitted to admin</h6>');
      })
      .catch(function (error) {
        $("button[data-target='#reqToChangePassModal']").replaceWith('<h6 class="text-secondary">We found some error.<br> Try again later.</h6>');
      });
})