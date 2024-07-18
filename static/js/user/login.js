import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';
$(document).ready(function() {
    $('#datatable-buttons').DataTable();
});

window.Hide_Error = async function (input_id) {
    $('#'+input_id).css('border-color', '#ced4da');
}

$(".form-control").keyup(function (event) {
    if (event.which === 13) { 
        Login()
    }
});


function isValidEmail(email) {
    var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}
window.Login = async function (_this) {
    var email = $('#email').val()
    var password = $('#password').val()
    
    if (!email) {
        showToastMsg('Error', 'Please enter email', 'error')
        $('#email').focus()
        $('#email').css('border-color', '#f46a6a');
    }
    else if (!isValidEmail(email)) {
        showToastMsg('Error', 'Please enter valid email', 'error')
        $('#email').focus()
        $('#email').css('border-color', '#f46a6a');
    } 
    else if(!password) {
        showToastMsg('Error', 'Please enter password', 'error')
        $('#password').focus()
        $('#password').css('border-color', '#f46a6a');
    }
    else {
        var data = JSON.stringify({
            'email':email,
            'password':password
        })
        let response = await callAjax('/Loginajax', data, _this, 'Processing', 'Log In');
        if (response.status == 1) {
            showToastMsg('Success', 'Please enter password', 'success')
            window.location.href = '/Dashboard';
        }
        else {
            showToastMsg('Error', response.msg, 'error')

        }
    }
    
}