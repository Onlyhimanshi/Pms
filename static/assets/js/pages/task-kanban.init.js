dragula([
    document.getElementById("upcoming-task"),
    document.getElementById("inprogress-task"),
    document.getElementById("complete-task")
]).on('drop', function (el) {
    console.log(el)
    var status  = el.parentElement.dataset['staus']
    var card_id = el.dataset['card_id']
    $.ajax({
            method : "POST",
            url : "/pms_admin/Change_Task_Status",
            contentType:"application/json",
            data : JSON.stringify({
                'card_id':card_id,
                'status':status
        }),
        success: function (response) {
            if (response['status'] == 1) {
                $('#switch3').prop('checked', false);
                $('#upcoming-task').html(response.rendered.pending_rendered)
                $('#inprogress-task').html(response.rendered.progress_rendered)
                $('#complete-task').html(response.rendered.completed_rendered)
            }
            else{
                swal.fire({
                title: response.msg,
                icon: 'error',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                showConfirmButton: false,
                allowOutsideClick: false
            })
            }
        }

        })
})