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

window.Login = async function (_this) {
    var username = $('#username').val()
    var password = $('#password').val()
    
    if (!username) {
        showToastMsg('Error', 'Please enter username', 'error')
        $('#username').focus()
        $('#username').css('border-color', '#f46a6a');
    }
    else if(!password) {
        showToastMsg('Error', 'Please enter password', 'error')
        $('#password').focus()
        $('#password').css('border-color', '#f46a6a');
    }
    else {
        var data = JSON.stringify({
            'username':username,
            'password':password
        })
        let response = await callAjax('/pms_admin/Loginajax', data, _this, 'Processing', 'Log In');
        if (response.status == 1) {
            window.location.href = '/pms_admin/Dashboard';
        }
        else {
            showToastMsg('Error', response.msg, 'error')

        }
    }
    
}