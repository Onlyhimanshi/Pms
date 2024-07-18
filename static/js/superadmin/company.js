import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';
// $(document).ready(function() {
//     $('#datatable-buttons').DataTable();
// });
window.Hide_Error = async function (input_id) {
    $('#'+input_id).css('border-color', '#ced4da');
    var emailInput = $('#institute_email').val()
    if (emailInput) {
        function isValidEmail(email) {
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email); // Test if the email matches the regex pattern
        }
        if (!isValidEmail(emailInput)) {
            showToastMsg('Error', 'Please enter valid email', 'error')
        }        
    }
}

window.Delete_Company = async function (id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to delete this company. This action cannot be undone.`, 'warning', 'cancel', 'Yes, delete it!', 'No')
    if (preference) {
        var data=JSON.stringify({'id':id})
        var response = await callAjax('/pms_admin/Delete_Company', data)
        if (response.status == 1) {
            var done = await sweetAlertMsg('Deleted!', response.msg, 'success');
            if (done) {
                location.reload()
            }
        }
        else {
            sweetAlertMsg('Error!', response.msg, 'error');
            
        }
    }
}



// designation related opeartions
window.Add_Company = async function (_this, action, id = null) {
    var company = $('#company_name').val()
    if (!company) {
        showToastMsg('Error', 'Please enter company name', 'error')
        $('#company_name').focus().css('border-color', '#f46a6a');
    }
    
    else {
        $('#exampleModalScrollable').hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to ${action} this company. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                "id":id,
                "action":action,
                "company": company
            })
            var response = await callAjax('/pms_admin/Add_Update_Company', data , _this,'Adding','Add',)
            if (response.status == 1) {
                $('#exampleModalScrollable').hide();
                var done  = await sweetAlertMsg('Success', response.msg, 'success', 'Okay')
                if (done) {
                    location.reload()
                }
            }
            else if(response.status == 2){
                var done = await sweetAlertMsg('Oops!', response.msg, 'warning');
                if (done) {
                    $('#exampleModalScrollable').show();
                }
            }
            else {
                var done = await sweetAlertMsg('Oops!', response.msg, 'error');
                if (done) {
                    $('#exampleModalScrollable').show();
                }
            }
        }
        else {
            $('#exampleModalScrollable').show();
        }
    }
}



window.Update_Company = async function (_this, action, id = null) {
    var company = $('#company_name' + id).val()

    if (!company) {
        showToastMsg('Error', 'Please enter company name', 'error')
        $('#designation').focus()
    }
    
    else {
        $('#exampleModalScrollable'+id).hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to ${action} this company name. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                "id":id,
                "action":action,
                "company": company
            })
            var response = await callAjax('/pms_admin/Add_Update_Company', data , _this,'Updating..','Update',)
            if (response.status == 1) {
                $('#exampleModalScrollable'+id).hide();
                var done  = await sweetAlertMsg('Success', response.msg, 'success', 'Okay')
                if (done) {
                    location.reload()
                }
            }
            else if(response.status == 2){
                var done = await sweetAlertMsg('Oops!', response.msg, 'warning');
                if (done) {
                    $('#exampleModalScrollable'+id).show();
                }
            }
            else {
                var done = await sweetAlertMsg('Oops!', response.msg, 'error');
                if (done) {
                    $('#exampleModalScrollable'+id).show();
                }
            }
        }
        else {
            $('#exampleModalScrollable'+id).show();
        }
    }
}
