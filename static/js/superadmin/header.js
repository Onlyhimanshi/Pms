import { log, callAjax, sweetAlertMsg, fieldsValidator, showToastMsg} from '../common.js';


window.Logout = async function () {
    var preference = await sweetAlertMsg('Question!', `Do you want logout ?`, 'question', 'cancel', 'Yes', 'No')
    if (preference) {
        window.location.href = '/pms_admin/Logout';  
    }
    
}