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
window.Delete_Employee = async function (id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to delete this employee. This action cannot be undone.`, 'warning', 'cancel', 'Yes, delete it!', 'No')
    if (preference) {
        var data=JSON.stringify({'id':id})
        var response = await callAjax('/pms_admin/Delete_Employee', data)
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


window.Change_Contributor_Status = async function (id,change_status_to) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to ${change_status_to === 'Approved' ? 'approve' : 'reject'} this contributor. This action cannot be undone.`, 'warning', 'cancel', `Yes, ${change_status_to === 'Approved' ? 'approve' : 'reject'} it!`, 'No')
    if (preference) {
        var data = JSON.stringify({
            'id': id,
            'change_status_to':change_status_to
        })
        var response = await callAjax('/Superadmin/Change_Contributor_Status/', data)
        if (response.status == 1) {
            var done = await sweetAlertMsg(`${change_status_to}!`, response.msg, 'success');
            if (done) {
                // location.reload()    
                $('#rendered_list').html(response.rendered)
                $('#datatable-buttons').DataTable();     
            }
        }
        else {
            sweetAlertMsg('Error!', response.msg, 'error');
            
        }
    }
    
}

// add employee
window.Add_Employee_By_SuperAdmin = async function (_this) {
    var fk_company = $('#company').val() 
    var fk_designation = $('#designation').val()
    var first_name = $('#first_name').val()
    var last_name = $('#last_name').val()
    var email = $('#email').val()
    var mobile_no = $('#mobile_number').val()
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var is_email_valid = emailRegex.test(email);
    if (!fk_company) {
        showToastMsg('Error', 'Please select Company', 'error')
        $('#company').focus().css('border-color', '#f46a6a');        
    }
    else if (!fk_designation) {
        showToastMsg('Error', 'Please select designation', 'error')
        $('#designation').focus().css('border-color', '#f46a6a');
    }
    else if (!first_name) {
        showToastMsg('Error', 'Please enter first name', 'error')
        $('#first_name').focus().css('border-color', '#f46a6a');    
    }
    else if (!last_name) {
        showToastMsg('Error', 'Please enter last name ', 'error')
        $('#last_name').focus().css('border-color', '#f46a6a');
    }
    else if (!email) {
        showToastMsg('Error', 'Please enter email', 'error')
        $('#email').focus().css('border-color', '#f46a6a');
    }
    else if (!is_email_valid) {
        showToastMsg('Error', 'Please enter valid email', 'error')
        $('#email').focus().css('border-color', '#f46a6a');
    }
    
    else if (!mobile_no) {
        showToastMsg('Error', 'Please enter mobile number', 'error')
        $('#mobile_number').focus().css('border-color', '#f46a6a');
    }
    else if (mobile_no.length < 10) {
        showToastMsg('Error', 'Please enter valid mobile number', 'error')
        $('#mobile_number').focus().css('border-color', '#f46a6a');
    }
    else {
        $('#exampleModalScrollable').hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to add this employee. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                'fk_company':fk_company,
                "fk_designation":fk_designation,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'mobile_no':mobile_no
                
            })
            var response = await callAjax('/pms_admin/Add_Employee_By_SuperAdmin', data , _this,'Adding','Add',)
            if (response.status == 1) {
                $('#exampleModalScrollable').hide();
                var done  = await sweetAlertMsg('Success', response.msg, 'success', 'Okay')
                if (done) {
                     window.location.href = "/pms_admin/Employee_List";
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


window.Update_Employee_By_SuperAdmin = async function (_this, id) {
    var fk_company = $('#company' + id).val()
    var fk_designation = $('#designation'+id).val()
    var first_name = $('#first_name'+id).val()
    var last_name = $('#last_name'+id).val()
    var email = $('#email'+id).val()
    var mobile_no = $('#mobile_number'+id).val()
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var is_email_valid = emailRegex.test(email);
    
    if (!fk_company) {
        showToastMsg('Error', 'Please select company', 'error')
        $('#company'+id).focus()
    }
    else if (!fk_designation) {
        showToastMsg('Error', 'Please select designation', 'error')
        $('#designation').focus()
    }
    else if (!first_name) {
        showToastMsg('Error', 'Please enter first name', 'error')
        $('#first_name').focus()
        $('#first_name').css('border-color', '#f46a6a');    
    }
    else if (!last_name) {
        showToastMsg('Error', 'Please enter last name ', 'error')
        $('#last_name').focus()
        $('#last_name').css('border-color', '#f46a6a');
    }
    else if (!email) {
        showToastMsg('Error', 'Please enter email', 'error')
        $('#email').focus()
        $('#email').css('border-color', '#f46a6a');
    }
    else if (!is_email_valid) {
        showToastMsg('Error', 'Please enter valid email', 'error')
        $('#email').focus()
        $('#email').css('border-color', '#f46a6a');
    }
    
    else if (!mobile_no) {
        showToastMsg('Error', 'Please enter mobile number', 'error')
        $('#mobile_number').focus()
        $('#mobile_number').css('border-color', '#f46a6a');
    }
    else if (mobile_no.length < 10) {
        showToastMsg('Error', 'Please enter valid mobile number', 'error')
        $('#mobile_number').focus()
        $('#mobile_number').css('border-color', '#f46a6a');
    }
    else {
        $('#exampleModalScrollable'+id).hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to update this employee. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                "id": id,
                'fk_company':fk_company,
                "fk_designation":fk_designation,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'mobile_no':mobile_no
                
            })
            var response = await callAjax('/pms_admin/Update_Employee_By_SuperAdmin', data , _this,'Updating','Update',)
            if (response.status == 1) {
                $('#exampleModalScrollable'+id).hide();
                var done  = await sweetAlertMsg('Success', response.msg, 'success', 'Okay')
                if (done) {
                     window.location.href = "/pms_admin/Employee_List";
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



// designation related opeartions
window.Add_Designation = async function (_this, action, id = null) {
    var designation = $('#designation').val()
    if (!designation) {
        showToastMsg('Error', 'Please enter designation', 'error')
        $('#designation').focus()
    }
    
    else {
        $('#exampleModalScrollable').hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to ${action} this designation. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                "id":id,
                "action":action,
                "designation": designation
            })
            var response = await callAjax('/pms_admin/Add_Update_Designation', data , _this,'Adding','Add',)
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


window.Update_Designation = async function (_this, action, id = null) {
    var designation = $('#designation' + id).val()

    if (!designation) {
        showToastMsg('Error', 'Please enter designation', 'error')
        $('#designation').focus()
    }
    
    else {
        $('#exampleModalScrollable'+id).hide();
        var preference = await sweetAlertMsg('Are you sure?', `You are about to ${action} this designation. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                "id":id,
                "action":action,
                "designation": designation
            })
            var response = await callAjax('/pms_admin/Add_Update_Designation', data , _this,'Updating..','Update',)
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


window.Delete_Designation = async function (id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to delete this designation. This action cannot be undone.`, 'warning', 'cancel', 'Yes, delete it!', 'No')
    if (preference) {
        var data=JSON.stringify({'id':id})
        var response = await callAjax('/pms_admin/Delete_Designation', data)
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

window.Close_modal = async function (id, action, db_value = null) {
    if (action=='add') {
        $('#'+id).val('')    
    }
    else if (action == 'update') {
        $('#'+id).val(db_value)    
    }
    
}