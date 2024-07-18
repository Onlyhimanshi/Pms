export const log = console.log;

////////////////////////
const googleDriveLinkPattern = /^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)($|\/)/;

export async function validateGoogleDriveLink(link) {
  	return googleDriveLinkPattern.test(link);
}

////////////////

export function changeFilter (key, filter, page_jump=null)
{
    // debugger;
    var currentURL = window.location.href;
    var url = new URL(currentURL);
    url.searchParams.set(key, filter);
	var hasPageJump = url.hash.includes(page_jump)
    window.location.href = (!page_jump || hasPageJump) ? url.toString() : url.toString() + page_jump;
}
///////// 
export async function isValidYouTubeOrVimeoUrl(url) {
	// Regular expression to match YouTube or Vimeo URLs
	var regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/;
	return regex.test(url);
}
///////////////////////////////////////// call ajax function
export async function callAjax(url, data, _this=null, loading_text=null, comp_text=null, formData=false) 
{
	try {
		var response;
		if (_this)
		{
			$(_this).prop("disabled", true);
			_this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${loading_text}...`;
		}
		
		if (formData)
		
		{
			
			await $.ajax({
				method: "POST",
				url: url,
				enctype: "mutipart/form_data",
				processData: false,
				contentType: false,
				cache: false,
				data: data,
				mode: 'same-origin',
				success: function (resp) 
				{			   
					if (_this)
					{
						$(_this).prop("disabled", false);
						_this.innerHTML = comp_text;
					}
					response = resp;
				}
			});
		}
		else
		{
			await $.ajax({
				method: "POST",
				url: url,
				cache: false,
				data : data,
				success: function (resp) 
				{			   
					if (_this)
					{
						$(_this).prop("disabled", false);
						_this.innerHTML = comp_text;
					}
					response = resp;
				}
			});
		}

		return response;
	} 
	catch (error) 
	{
		log(error);
		return false;
	}
}

///////////////////////////////////////// Email validator
export async function emailValidator(field)
{
	try 
	{
		var emailfilter = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
		var val = $(`#${field}`).val();
		if ((val == '') || (!emailfilter.test(val)))
		{
			$(`#${field}`).addClass("error_class");
			$(`#${field}`).focus();
			return false;
		}
		
		return val;
	} 
	catch (error) 
	{
		log(error);
		return false;
	}
}


///////////////////////////////////////// loop through fields and show error msg
export async function fieldsValidator(fields, err_type='class', form_data=false) 
{
	try 
	{
		var values = (form_data) ?  new FormData() : {};
		for await (var field of fields)
		{
			let jsField = $('#'+field);
			let validationType = jsField.data('type');
			var val = jsField.val();
			let validation = true;

			if (validationType == 'email')
			{
				var emailfilter = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
				if ((val == '') || (!emailfilter.test(val)))
				{
					validation = false;
				}
			}
			else if (validationType  == 'phone')
			{
				// var phone_filter = /^\(\d{3}\) \d{3}-\d{4}$/;
				if ((val == '') || (val.length < 10))
				{
					validation = false;
				}
			}
			else if (validationType  == 'password')
			{
				if ((val == '') || (val.length < 8))
				{
					validation = false;
				}
			}
			else // text
			{
				if (val == '')
				{
					validation = false;
				}
			}

			if (validation)
			{
				if (form_data)
				{
					(validationType == 'file') ?  values.append(field, jsField[0].files[0]) : values.append(field, val);
				}
				else
				{
					(validationType == 'file') ?  values[field] = jsField[0].files : values[field] = val;
				}
			}
			else
			{
				let msg = jsField.data('err_msg');
				
				if (err_type == 'toast')
				{
					showToastMsg('ERROR', msg, 'error');
				}
				else
				{
					jsField.addClass("error_class");
				}
				
				jsField.focus();
				return false;
			}
		}
		return values;
	} 
	catch (error) 
	{
		log(error);
		return false;
	}
}

///////////////////////////////////////// Remove error class

export function removeError(element)
{
	$(`#${element}`).removeClass("error_class");
}


//////////////////////////////////////// Sweetalerts
export async function sweetAlertMsg(title, text, icon, withCancel='nocancel', confirmText='Ok', cancelText="Cancel")
{
	var cancel = (withCancel == 'cancel') ? 0 : 1;
	var userPreference = false;
	await Swal.fire({title:title, text:text, icon:icon, showCancelButton:!cancel, confirmButtonColor:"#556ee6", cancelButtonColor:"#f46a6a", allowOutsideClick: false,
		allowEscapeKey : false, 
		confirmButtonText: confirmText,
		cancelButtonText: cancelText,}
	).then((result) => 
	{
		if (result.isConfirmed) {userPreference=true;}
	});
	return userPreference;
}

///////////////////////////
export async function askLogin(msg)
{
	let preference = await sweetAlertMsg('LOGIN', msg, 'question', 'cancel', 'Yes', 'No');
	if(preference)
	{
		location.href = '/account/Login/';
	}
	else
	{
		return false
	}
}

/////////////////////////////////////// Reset cotrols
export function resetControls(fields)
{
	for (var field of fields)
	{
		var val = $(`#${field}`).val('');
	}	
}

/////////////////////////////////////// check all checkboxes using class

export async function checkAllCheckBoxes(_this, check_class, table_id)
{
	var table = $('#'+ table_id).DataTable();
	var rows = table.rows({ 'search': 'applied' }).nodes();
	$('.'+ check_class, rows).prop('checked', _this.checked);
};

////////////////////////////////////// Toast Messages

export async function showToastMsg(title, message, type='error')
{
	if (type == 'error')
	{
		iziToast.error({
			title: title,
			message: message,
			timeout: 2500,
			position: 'topRight'
		});
	}
	else if (type == 'success')
	{
		iziToast.success({
			title: title,
			message: message,
			timeout: 2500,
			position: 'topRight'
		});
	}
}

////////////////////////////////// Check file size 

export async function validateFile(input, size)
{
	var ext_arr = ['xlsx'];
	var f = $('#'+input)[0].files[0];
	var sizeInMb = f.size/1024;
	var sizeLimit= 1024*size;
	var filename = f.name;
	var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
	
	if ((!ext) || (!ext_arr.includes(ext[0])))
	{
		showToastMsg('Error', 'You can only select .xlsx files...');
		$('#'+input).val('');
		return false;
	}
	// else if (sizeInMb > sizeLimit) 
	// {
	// 	showToastMsg('Error', `Sorry the file exceeds the maximum size of ${size} MB!`);
	// 	$('#'+input).val('');
	// 	return false;
	// }
	return f;
}