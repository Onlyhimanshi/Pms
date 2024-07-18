import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';


window.Logout = async function () {
    var preference = await sweetAlertMsg('Question!', `Do you want logout ?`, 'question', 'cancel', 'Yes', 'No')
    if (preference) {
        window.location.href = '/Logout';  
    }
    
}

var user_id = null
window.Opend_Profile_Modal = async function (id,modal_id) {
    $("#" + modal_id).modal('show')
    user_id = id
    var data=JSON.stringify({'id':id})
    let response = await callAjax('/Get_User_Obj', data);
    if (response.status == 1) {
        var data = response.data
        console.log(data.profile_pic)
        $('#firstname').val(data.first_name)
        $('#lastname').val(data.last_name)
        $('#mobileno').val(data.mobile_number)
        if (data.profile_pic) {
            $('#user_image').attr('src', data.profile_pic);    
        }
        else {
            $('#user_image').attr('src', 'static/assets/images/users/dummy.jpg');
        }
    }
    else {
        sweetAlertMsg('Error!', response.msg, 'error');
    }    
}


window.togglePassword =  async function(inputId) {
    var x = document.getElementById(inputId);
    var icon = document.getElementById("toggleIcon_" + inputId);
    if (x.type === "password") {
        x.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        x.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

window.Change_Password = async function (_this) {
    var current_password = $('#current_password').val()
    var new_password = $('#new_password').val()
    var confirm_password = $('#confirm_password').val()
    var data = JSON.stringify({
        'id': user_id,
        'current_password': current_password,
        'new_password': new_password,
        'confirm_password':confirm_password
    })

    if (!current_password) {
        $('#current_password').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please  enter pasword', 'error');
    }
    else if (!new_password) {
        $('#new_password').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter new password ', 'error');
    }
    else if (!confirm_password) {
        $('#confirm_password').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter new password ', 'error');
    }
    else if (new_password != confirm_password) {
        $('#confirm_password').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'New password and confirm password does not match', 'error');1
    }
    else {
        $('#changepasswrod').modal('hide')
        var preference = await sweetAlertMsg('Are you sure?', `You are about to update password. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            let response = await callAjax('/Update_Password', data, _this, 'Updating..', 'Update');
            
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }    
            }
            else if(response.status == 2){
                var done = await sweetAlertMsg('Warning!', response.msg, 'warning');
                if (done) {
                    $('#changepasswrod').modal('show')
                }
            }
            else {
                var done = await sweetAlertMsg('Error!', response.msg, 'error');
                if (done) {
                    $('#changepasswrod').modal('show')
                }
            }
        }
        else {
            $('#changepasswrod').modal('show')
        }
    }
}


window.Update_Profile = async function (_this) {
    var firstname = $('#firstname').val()
    var lastname = $('#lastname').val()
    var mobileno = $('#mobileno').val()
    if (!firstname) {
        $('#firstname').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please  enter first name', 'error');
    }
    else if (!new_password) {
        $('#lastname').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter last name', 'error');
    }
    else if (!mobileno) {
        $('#mobileno').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter mobile number ', 'error');
    }
    else {
        console.log('call api here')
    }
}