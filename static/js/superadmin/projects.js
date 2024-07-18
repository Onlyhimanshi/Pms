import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';
// $(document).ready(function() {
//     $('#datatable-buttons').DataTable();
// });
window.Hide_Error = async function (input_id) {
    $('#' + input_id).css('border-color', '#ced4da');
}

window.Get_State_List = async function () {
    var country_id = $('#country').val()
    if (country_id) {
        var data = JSON.stringify({'country_id':country_id})
        var response = await callAjax('/pms_admin/Get_State_List', data);
        var selectElement = $('#state');
        selectElement.empty();
        selectElement.append($('<option>', { value: '', text: 'Select State' }));
        $('#city').empty().append($('<option>', { value: '', text: 'Select City' }));
        console.log(response.data)
        $.each(response.data, function (index, obj) {
            var option = $('<option>', {value: obj.id,text: obj.state});
            selectElement.append(option);
        });
    }
}



window.Get_City_List = async function () {
    var state_id = $('#state').val()
    if (state_id) {
        var data = JSON.stringify({'state_id':state_id})
        var response = await callAjax('/pms_admin/Get_City_List', data);
        var selectElement = $('#city');
        selectElement.empty();
        selectElement.append($('<option>', { value:'',text:'Select City'}));
        $.each(response.data, function (index, city) {
            var option = $('<option>', {value: city.id,text: city.city});
            selectElement.append(option);
        });
    }
}


window.Verify_Condition = async function (array) {
    for (var key in array) {
        if (!$('#'+key).val()) {
            $('#'+key).focus().css('border-color', '#f46a6a');
            showToastMsg('Error', array[key], 'error');
            return true;
        }
        if (key === 'end_date' && new Date($('#start_date').val()) > new Date($('#end_date').val())) {
            showToastMsg('Error', 'End date should not be less than start date', 'error');
            $('#end_date').focus().css('border-color', '#f46a6a');
            return true;
        }
        if (key === 'team_members' && $('#'+key).val().length === 0) {
            $('#'+key).focus().css('border-color', '#f46a6a');
            showToastMsg('Error', array[key], 'error');
            return true;
        }
    }
    return false;
}


// Add fields by jquery
var dynamic_id = 1;
var array = [1]
window.Add_Fields = async function () {
    if (array.length >= 3) {
        showToastMsg('Error', 'You cannot upload more than 3 files.', 'error');
    }
    else {
        dynamic_id += 1
        var field_set = $('<div class="row mb-4" id="child_div'+ dynamic_id +'">' +
            '<div class="col-lg-6">' +
            '<label class="col-form-label col-lg-3">File Description</label>' +
            '<input onkeyup="Hide_Error(id)" id="filedesc'+dynamic_id+'" class="form-control" type="text" placeholder="Please add descripiton " >' +
            '</div>' +
            '<div class="col-lg-6">' +
            '<label class="col-form-label col-lg-6">Select File</label>' +
            '<div class="input-group">' +
            '<input type="file" onclick="Hide_Error(id)" id="file'+dynamic_id+'" accept=".pdf, .doc, .docx"   class="form-control"  aria-describedby="inputGroupFileAddon04" aria-label="Upload">' +
            '<button onclick="Remove_Fields('+ dynamic_id +')" id="closebtn'+dynamic_id+'" class="btn btn-danger" type="button" ><i class="fa fa-times"></i></button>' +
            '</div>' +
            '</div>' +
            '</div>');

        $('#parent_element').append(field_set)
        array.push(dynamic_id)
    }
}

// Remove fields by jquery
window.Remove_Fields = async function (id) {
    if (array.length==1) {
        showToastMsg('Error', 'You cannot remove all fields', 'error');
    }
    else {
        $('#child_div' + id).remove();    
        var index = array.indexOf(id);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }
}

// milestone artray start
var milestone_dynamic_id = 1;
var milestone_list = [1]
window.Add_Milestone_Fields = async function () {
    if (milestone_list.length == 3) {
        showToastMsg('Error', 'You cannot create more than four milestone','error');
    }
    else {
        Set_Milestone_Head('team_members')
        milestone_dynamic_id += 1
        var milestone_field_set = $(
            '<div class= "row mb-4" id = "milestone_child_div' + milestone_dynamic_id + '" > ' +
                '<div class="col-lg-5">' +
                    '<label class="col-form-label col-lg-3">Milestone Title</label>' +
                    '<input onkeyup="Hide_Error(id)" id="milestone_title'+ milestone_dynamic_id +'" class="form-control" type="text" placeholder="Please enter milestone">' +
                '</div>' +
                
                '<div class="col-lg-3">' +
                    '<label class="col-form-label">Milestone Head</label>' +
                    '<select class="form-control append_option" id="milestone_head' + milestone_dynamic_id +'">' +
                        '<option value="">Select head</option>' +
                    '</select>' +
                '</div>' +
                
                '<div class="col-lg-2">' +
                    '<label class="col-form-label">Start Date</label>' +
                    '<input type="date" onclick="Hide_Error(id)" id="milestone_start_date'+ milestone_dynamic_id +'" class="form-control" min="{{ today|date:"Y-m-d" }}" placeholder="Start Date" name="start">' +
                '</div>' +
                
                '<div class="col-lg-2">' +
                    '<label class="col-form-label">End Date</label>' +
                    '<div class="input-group">' +
                        '<input type="date" onclick="Hide_Error(id)" id="milestone_end_date'+ milestone_dynamic_id +'" class="form-control" min="{{ today|date:"Y-m-d" }}" placeholder="End Date" name="end">' +
                        '<button onclick="Remove_milestone_Fields('+ milestone_dynamic_id +')" id="milestone_closebtn'+ milestone_dynamic_id +'" class="btn btn-danger" type="button"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                '</div>' +
            
            '</div>');

        $('#milestone_parent_element').append(milestone_field_set)
        milestone_list.push(milestone_dynamic_id)
        
    }
    $('.select2').select2();
}


window.Remove_milestone_Fields = async function (id) {
    if (milestone_list.length == 1) {
        showToastMsg('Error', 'You have to create atlest one milestone', 'error');
    }
    else {
        $('#milestone_child_div' + id).remove();    
        var index = milestone_list.indexOf(id);
        if (index !== -1) {
            milestone_list.splice(index, 1);
        }
    }
}

// create project start
window.Create_Project = async function () {
    var project_title = $('#project_title').val()
    var projectdesc = $('#projectdesc').val()
    var start_date = $('#start_date').val()
    var end_date = $('#end_date').val()
    var country = $('#country').val()
    var state = $('#state').val()
    var city = $('#city').val()
    var priority = $('#priority').val()
    var projectstatus = $('#projectstatus').val()
    var team_members = $('#team_members').val()
    var cloud_url = $('#cloud_url').val()
    var project_logo = document.getElementById('project_logo').files[0];
    var description_array = [];
    var files = [];
    var check_obj_state = false
    var myArray = { 'project_title': 'Please enter project title', 'projectdesc': 'Please enter project description', 'priority': 'Please select project priority', 'projectstatus': 'Please select project status', 'start_date': 'Please select start date','end_date': 'Please select end date','country':'Please Select Country','state': 'Please select state', 'city': 'Please select city',  'team_members': 'Please select project members' };
    var check_milestone_obj = false
    var milestone_object = {};
    var milestone_array = [];
    var res = await Verify_Condition(myArray)
    var formData = new FormData();
    

    for (var i = 0; i < array.length; i++) {
        var id = array[i]; //this value will give the id
        var file = document.getElementById('file' + id).files[0];
        var desc = document.getElementById('filedesc' + id).value
        
        if (file || desc) {
            if (!file) {
                $('#file'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please select file', 'error');
                check_obj_state = true
                check_milestone_obj =  true
            }
            else if (!desc) {
                $('#filedesc'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please select description', 'error');
                check_obj_state = true
                check_milestone_obj =  true
            }
            else {
                files.push(file)
                formData.append('files[]', files[i]);

                description_array.push(desc)
                formData.append('description_array[]', description_array[i])
            }
        }
    }
    
    for (var i = 0; i < milestone_list.length; i++) {
        if (res) {
            return true
        }
        else {
            var id = milestone_list[i];
            var milestone_title = $('#milestone_title' + id).val()
            var milestone_head = $('#milestone_head' + id).val()
            var milestone_start_date = $('#milestone_start_date' + id).val()
            var milestone_end_date = $('#milestone_end_date' + id).val()
            if (!milestone_title) {
                $('#milestone_title'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please enter milestone title', 'error');
                check_milestone_obj =  true
            }
            else if (!milestone_head) {
                $('#milestone_head'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please enter milestone head', 'error');
                check_milestone_obj =  true
            }
            else if (!milestone_start_date) {
                $('#milestone_start_date'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please select start date', 'error');
                check_milestone_obj =  true
            }
            else if (!milestone_end_date) {
                $('#milestone_end_date'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Please select end date', 'error');
                check_milestone_obj =  true
            }
            else if (milestone_start_date>=milestone_end_date) {
                $('#milestone_end_date'+id).focus().css('border-color', '#f46a6a');
                showToastMsg('Error', 'Milestone start date should not be less than end date', 'error');
                check_milestone_obj =  true

            }
            else{
                milestone_object['milestonetitle'] = milestone_title;
                milestone_object['milestone_head'] = milestone_head;
                milestone_object['milestone_start_date'] = milestone_start_date;
                milestone_object['milestone_end_date'] = milestone_end_date;
                check_milestone_obj = false
                milestone_array.push(milestone_object)
                milestone_object = {};
            }
            console.log(milestone_array)
        }

    }

    if (!res && !check_obj_state && !check_milestone_obj) {
        formData.append('project_title', project_title);
        formData.append('projectdesc', projectdesc);
        formData.append('start_date', start_date);
        formData.append('end_date', end_date);
        formData.append('country', country);
        formData.append('state', state);
        formData.append('city', city);
        formData.append('priority', priority);
        formData.append('projectstatus', projectstatus);
        formData.append('team_members', team_members);
        formData.append('description_array', description_array)
        formData.append('project_logo', project_logo)
        formData.append('cloud_url',cloud_url)
        console.log(milestone_array)
        formData.append('milestone_object', JSON.stringify(milestone_array));
        var preference = await sweetAlertMsg('Are you sure?', `You are about to create project. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            let response = await callAjax('/pms_admin/Create_Project_By_Admin',formData, null, null,null,true);
            
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    window.location.href='/pms_admin/Open_Projects'
                }    
            }
            else {
                sweetAlertMsg('Error!', response.msg, 'error');
            }
        }
    }
}


window.Update_Project = async function (id, _this) {
    var project_title = $('#project_title').val()
    var projectdesc = $('#projectdesc').val()
    var start_date = $('#start_date').val()
    var end_date = $('#end_date').val()
    var country = $('#country').val()
    var state = $('#state').val()
    var city = $('#city').val()
    var priority = $('#priority').val()
    var projectstatus = $('#projectstatus').val()
    var team_members = $('#team_members').val()
    var cloud_url = $('#cloud_url').val()
    var myArray = { 'project_title': 'Please enter project title', 'projectdesc': 'Please enter project description', 'start_date': 'Please select start date', 'end_date': 'Please select end date', 'state': 'Please select state', 'city': 'Please select city', 'priority': 'Please select project priority', 'projectstatus': 'Please select project status', 'team_members': 'Please select project members' };
    var res = await Verify_Condition(myArray)
    if (!res) {
        var data = JSON.stringify({
            "id":id,
            "project_title": project_title,
            "projectdesc": projectdesc,
            "start_date": start_date,
            "end_date": end_date,
            'country':country,
            "state": state,
            "city": city,
            "priority": priority,
            "projectstatus": projectstatus,
            "team_members": team_members,
            'cloud_url':cloud_url
        })
        var preference = await sweetAlertMsg('Are you sure?', `You are about to update project. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            let response = await callAjax('/pms_admin/Update_Project_By_Admin', data, _this, 'Updating..', 'Update');
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    window.location.href='/pms_admin/Open_Projects'
                }    
            }
            else {
                sweetAlertMsg('Error!', response.msg, 'error');
            }
        }
    }

}
window.Delete_Project = async function (id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to delete this project. This action cannot be undone.`, 'warning', 'cancel', 'Yes, delete it!', 'No')
    if (preference) {
        var data=JSON.stringify({'id':id})
        var response = await callAjax('/pms_admin/Delete_Project', data)
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

// close modal
window.Modal_Close = async function () {
    var option = $('<option>',{value: user.id,text: user.first_name + ' ' + user.last_name });
    $('#fk_task_members').append(option);
}




window.Delete_Task = async function (task_id) {
    var preference = await sweetAlertMsg('Are you sure?', `You are about to delete this task. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
    if (preference) {
        var data=JSON.stringify({'task_id':task_id})
        var response = await callAjax('/pms_admin/Delete_Task', data)
        if (response.status == 1) {
            showToastMsg('Success', response.msg, 'success');
            $('#upcoming-task').html(response.rendered.pending_rendered)
            $('#inprogress-task').html(response.rendered.progress_rendered)
            $('#complete-task').html(response.rendered.completed_rendered)
        }
        else {
            showToastMsg('Error!', response.msg, 'error');
            
        }
    }
}



        
var task_id = null
window.Update_Task_Modal = async function (id) {
    $('#update_task_modal').modal('show')
    task_id = id
    var data = JSON.stringify({'task_id':id})
    let response = await callAjax('/pms_admin/Get_Task_Obj',data);
    if (response.status == 1) {
        var selectElement = $('#update_fk_task_members');
        selectElement.empty();
        selectElement.append($('<option>', { value:'',text:'Select Member'}));
        $.each(response.user_obj, function (index, user) {
            var option = $('<option>', {
                value: user.id,
                text: user.first_name + ' ' + user.last_name 
            });
            selectElement.append(option);
        })
        var obj = response.obj 
        $('#update_task_title').val(obj.title)
        $('#update_task_priority').val(obj.priority)
        $('#update_fk_task_members').val(obj.fk_task_member)
        $('#update_start_date').val(obj.start_date.split("T")[0])
        $('#update_end_date').val(obj.end_date.split("T")[0])
        $('#taskdesc-editor-update').val(obj.description)
        tinymce.get('taskdesc-editor-update').setContent(obj.description);
    }
    else {
        sweetAlertMsg('Error!', response.msg, 'error');
    }

}


window.Update_Task = async function (_this) {
    var task_title = $('#update_task_title').val()
    var start_date = $('#update_start_date').val()
    var end_date = $('#update_end_date').val()
    var priority = $('#update_task_priority').val()
    var fk_task_member = $('#update_fk_task_members').val()
    var task_desc = tinymce.get('taskdesc-editor-update').getContent();
    var myArray = { 'update_task_title': 'Please enter task title', 'update_task_priority': 'Please select task priority' ,'update_fk_task_members': 'Please select task members',  'update_start_date': 'Please select start date', 'update_end_date': 'Please select end date' };
    var res = await Verify_Condition(myArray) 
    if (!res) {
        $('#update_task_modal').modal('hide');
        var data = JSON.stringify({
            'task_id':task_id,
            'task_title': task_title,
            'task_desc': task_desc,
            'start_date': start_date,
            'end_date': end_date,
            'priority': priority,
            'fk_task_member':fk_task_member            
        })
        var preference = await sweetAlertMsg('Are you sure?', `You are about to update task. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            let response = await callAjax('/pms_admin/Update_Task_By_Admin',data,_this, 'Updating..','Update Task');
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }    
            }
            else {
                sweetAlertMsg('Error!', response.msg, 'error');
            }
        }
        else {
            $('#update_task_modal').modal('show');
        }
    }
}

window.Project_Modal_Close = async function () {
    $('#task_title').val('')
    $('#task_priority').val('')
    $('#start_date').val('')
    $('#end_date').val('')
    tinymce.get('taskdesc-editor').setContent('');
}


window.Open_Add_milestone_Modal = async function (counter) {
    $('#milestone' + counter).modal('show')
}


window.Remove_User_From_Milestone = async function () {
    alert('hello')
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
            $('#milestone' + milestone_id).modal('hide');
            var data = JSON.stringify({ 'milestone_id': milestone_id, 'user_id': user_id })
            let response = await callAjax('/pms_admin/Add_Milestone_Member', data);
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }
            }
            else {
                sweetAlertMsg('Error!', response.msg, 'error');
                $('#user' + counter).val('')
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

// open task modal
var milestone_id = null
window.Open_Task_Modal = async function (id) {
    $('#staticBackdrop').modal('show') 
    milestone_id = id
    if (milestone_id) {
        var data = JSON.stringify({'milestone_id':milestone_id})
        var response = await callAjax('/pms_admin/Get_User_List', data);
        var selectElement = $('#fk_task_members');
        selectElement.empty();
        selectElement.append($('<option>', { value:'',text:'Select Member'}));
        
        $.each(response.data, function (index, user) {
            var option = $('<option>', {
                value: user.id,
                text: user.first_name + ' ' + user.last_name 
            });
            selectElement.append(option);
        });
    }
}


// create task
window.Create_Task = async function (_this,task_creator_id=null) {
    var task_title = $('#task_title').val()
    var start_date = $('#start_date').val()
    var end_date = $('#end_date').val()
    var priority = $('#task_priority').val()
    var fk_task_member = $('#fk_task_members').val()
    var task_desc = tinymce.get('taskdesc-editor').getContent();
    var myArray = { 'task_title': 'Please enter task title', 'task_priority': 'Please select task priority' ,'fk_task_members': 'Please select task members',  'start_date': 'Please select start date', 'end_date': 'Please select end date' };
    var res = await Verify_Condition(myArray) 

    if (!res) {
        $('#staticBackdrop').modal('hide');
        var data = JSON.stringify({
            "fk_milestone_id": milestone_id,
            'task_title': task_title,
            'task_desc': task_desc,
            'start_date': start_date,
            'end_date': end_date,
            'priority': priority,
            'fk_task_member': fk_task_member,
            'task_creator_id':task_creator_id
        })
        var preference = await sweetAlertMsg('Are you sure?', `You are about to create task. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
        if (preference) {
            let response = await callAjax('/pms_admin/Create_Task_By_Admin',data,_this, 'Creating..','Create Task');
            if (response.status == 1) {
                var done = await sweetAlertMsg('Success!', response.msg, 'success');
                if (done) {
                    location.reload()
                }    
            }
            else {
                sweetAlertMsg('Error!', response.msg, 'error');
            }
        }
        else {
            $('#staticBackdrop').modal('show');
        }
    }
}

window.Set_Milestone_Head = async function (id) {
    var team_arr = $('#' + id).val()
    var data = JSON.stringify({"team_arr":team_arr})
    var response = await callAjax('/pms_admin/Get_Project_Member', data);   
    if (response.status == 1) {
        var selectElement = $('.append_option');
        selectElement.empty();
        selectElement.append($('<option>', { value:'',text:'Select Head'}));
        
        $.each(response.data, function (index, user) {
            var option = $('<option>', {
                value: user.id,
                text: user.first_name + ' ' + user.last_name 
            });
            selectElement.append(option);
        });
    }
    else {
        sweetAlertMsg('Error!', response.msg,'error');   
    }
}

window.Toggle_Arch_Completed_task = async function (id, milestone_id) {
    var isChecked = $('#' + id).prop('checked');
    var status = 'Completed'
    if (isChecked){
        status = 'Archive'
    }
    var data = JSON.stringify({
        'milestone_id': milestone_id,
        'status':status
    })
    let response = await callAjax('/pms_admin/Filte_Archive_completed_task',data);
    if (response.status == 1) {
        $('#complete-task').html(response.completed_rendered)
    }
    else {
        sweetAlertMsg('Error!', response.msg, 'error');
    }
}

window.Archive_Task = async function (task_id, title) {
    var isChecked = $('#switch3').prop('checked');
    var status = 'Archive'
    if (isChecked){
        status = 'Completed'
    }
    if (status == 'Archive') {
        var preference = await sweetAlertMsg('Are you sure?', `You are about to archive ${title} task. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')    
    }
    else {
        var preference = await sweetAlertMsg('Are you sure?', `You are about to shift archive ${title} task to completed list. This action cannot be undone.`, 'warning', 'cancel', 'Yes', 'No')
    }
    if (preference) {
        var data = JSON.stringify({
            'task_id': task_id,
            'status':status
        })
        let response = await callAjax('/pms_admin/Archive_Task',data);
        if (response.status == 1) {
            var done = await sweetAlertMsg('Success!', response.msg, 'success');
            if (done) {
                location.reload()
            }    
        }
        else {
            sweetAlertMsg('Error!', response.msg, 'error');
        }
    }
}