import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';
// $(document).ready(function() {
//     $('#datatable-buttons').DataTable();
// });
window.Hide_Error = async function (input_id) {
    $('#' + input_id).css('border-color', '#ced4da');
}


window.Open_Add_milestone_Modal = async function (counter) {
    $('#milestone' + counter).modal('show')
}


window.Remove_User_From_Milestone = async function (id,first_name , last_name) {
    var name = first_name +' '+last_name
    var preference = await sweetAlertMsg('Are you sure?', `You are about to remove ${name} from this milestone. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
    if (preference) {
        var data = JSON.stringify({
            'id': id
        })
        let response = await callAjax('/pms_admin/Remove_User_From_Milestone', data);
        if (response.status == 1) {
            var done = await sweetAlertMsg('Success!', response.msg, 'success');
            if (done) {
                location.reload()
            }
        }
        else {
            sweetAlertMsg(response.title, response.msg,response.title);

        }
    }
}


window.Add_Milestone_Member = async function (_this, counter,milestone_id) {
    var user_id = $('#user' + counter).val()
    var name = $('#user' + counter).children("option:selected").text();
    if (!user_id) {
        $('#user'+counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select member', 'error');   
    }
    else {
        $('#milestone'+counter).modal('hide')
        var preference = await sweetAlertMsg('Are you sure?', `You are about to add ${name} in this milestone. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({ 'milestone_id': milestone_id, 'user_id': user_id })
            let response = await callAjax('/pms_admin/Add_Milestone_Member', data);
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }
            }
            else {
                var done = await sweetAlertMsg(response.title, response.msg, response.title);
                if (done) {
                    $('#milestone' + counter).modal('show');
                    // $('#user' + counter).val('')    
                }
            }
        }
        else {
            $('#milestone' + counter).modal('show');
        }
    }    
}
window.Modal_Close_milestone = async function (counter) {
    $('#user' + counter).val('')
}

window.Delete_Milestone = async function (id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to remove this milestone. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
    if (preference) {
        var data = JSON.stringify({
            'id': id
        })
        let response = await callAjax('/pms_admin/Remove_Milestone', data);
        if (response.status == 1) {
            var done = await sweetAlertMsg('Success!', response.msg, 'success');
            if (done) {
                location.reload()
            }
        }
        else {
            sweetAlertMsg(response.title, response.msg,response.title);

        }
    }
}

window.Add_Milestone = async function (_this,project_id) {
    var milestone_title = $('#milestone_title').val()
    var milestone_head = $('#milestone_head').val()
    var start_date = $('#start_date').val()
    var end_date = $('#end_date').val()
    if (!milestone_title) {
        $('#umilestone_title').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter milestone title', 'error');
    }
    else if (!milestone_head) {
        $('#milestone_head').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select milestone heade', 'error');
    }
    else if (!start_date) {
        $('#start_date').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select start date', 'error');
    }
    else if (!end_date) {
        $('#end_date').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select end date', 'error');
    }
    else if (start_date >= end_date) {
        $('#end_date').focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'End date should not be less than start date', 'error');
    }
    else {
        $('#Modal_Add_Milestone').modal('hide')
        var preference = await sweetAlertMsg('Are you sure?', `You are about create milestone. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                'project_id': project_id,
                'milestone_title': milestone_title,
                'milestone_head':parseInt(milestone_head),
                'start_date': start_date,
                'end_date':end_date
            })
            let response = await callAjax('/pms_admin/Add_Milestone', data,_this,'Adding..','Add');
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }
            }
            else {
                sweetAlertMsg(response.title, response.msg,response.title);

            }
        }
        else {
            $('#Modal_Add_Milestone').modal('show')
        }
    }

}

window.Open_Update_Milestone = async function (counter) {
    $('#Modal_Add_Milestone'+counter).modal('show')
}

window.Update_Milestone = async function (_this,milestone_id,counter) {
    var milestone_title = $('#milestone_title' + counter).val()
    var milestone_head = $('#milestone_head'+counter).val()
    var start_date = $('#start_date'+counter).val()
    var end_date = $('#end_date' + counter).val()

    if (!milestone_title) {
        $('#umilestone_title'+ counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please enter milestone title', 'error');
    }
    else if (!milestone_head) {
        $('#milestone_head'+ counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select milestone heade', 'error');
    }
    else if (!start_date) {
        $('#start_date'+ counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select start date', 'error');
    }
    else if (!end_date) {
        $('#end_date'+ counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'Please select end date', 'error');
    }
    else if (start_date >= end_date) {
        $('#end_date'+ counter).focus().css('border-color', '#f46a6a');
        showToastMsg('Error', 'End date should not be less than start date', 'error');
    }
    else {
        $('#Modal_Add_Milestone'+counter).modal('hide')
        var preference = await sweetAlertMsg('Are you sure?', `You are about update this milestone. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            var data = JSON.stringify({
                'milestone_id':milestone_id,
                'milestone_title': milestone_title,
                'milestone_head':milestone_head,
                'start_date': start_date,
                'end_date':end_date
            })
            let response = await callAjax('/pms_admin/Update_Milestone', data,_this,'Adding..','Add');
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }
            }
            else {
                sweetAlertMsg(response.title, response.msg,response.title);

            }
        }
        else {
            $('#Modal_Add_Milestone'+counter).modal('show')
        }
    }
    var data = JSON.stringify({
        'milestone_id':milestone_id
    })
}