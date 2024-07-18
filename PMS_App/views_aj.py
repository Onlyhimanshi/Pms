import traceback
from django.shortcuts import render
from django.views.decorators.cache import cache_control
from ProjectUtilities.decorators import *
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
import json
import random
import string
from datetime import datetime
import ast
from django.core.serializers import serialize
from django.db.models import Model
from django.db.models import Q
from django.forms.models import model_to_dict


@csrf_exempt
def Loginajax(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body.decode('utf-8'))
            email = data['email'] 
            password = data['password'] 

            print(email, '>>>>>>' , password)
            if User_Details.objects.filter(email=email, password=password).exists():
                obj = User_Details.objects.get(email=email, password=password)
                request.session['user_id']=obj.id
                request.session['user_type']='User'
                send_data = {'status': 1, 'msg': 'User Login Successfully'}
            else:
                send_data = {'status': 0, 'title': 'Invalid Credentials','msg': 'Please check your email and password..'}
        else:
            send_data = {'status': 0,'msg': 'Request is not post'}

    except:
        traceback.print_exc()
        send_data = {'status': 0, 'title': 'Error','msg': 'Someting went wrong'}
    return JsonResponse(send_data)

@csrf_exempt
def Logout(request):
    try:
        del request.session['user_id']
        del request.session['user_type']
    except:
        traceback.print_exc()
    return redirect('/')

@csrf_exempt
def Get_User_Obj(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        id = data['id'] 
        obj=User_Details.objects.get(id=id)
        user_data = model_to_dict(obj)
        if 'profile_pic' in user_data and user_data['profile_pic']:
            user_data['profile_pic'] = user_data['profile_pic'].url
        else:
            # Handle the case where 'profile_pic' doesn't exist or has no file associated with it
            user_data['profile_pic'] = None
        send_data = {'status': 1, 'title': 'Error','msg': 'User details','data':user_data}
    except:
        traceback.print_exc()
        send_data = {'status': 0, 'title': 'Error','msg': 'Someting went wrong'}
    return JsonResponse(send_data)
    


@csrf_exempt
def Update_Password(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        id = data['id'] 
        current_password = data['current_password'] 
        new_password = data['new_password'] 
        obj = User_Details.objects.get(id=id)
        if obj.password != current_password:
            send_data = {'status': 2, 'title': 'Error','msg': 'Current password does not match , please enter correct password'}
        else:
            obj.password = new_password
            obj.save()
            send_data = {'status': 1, 'title': 'Success','msg': 'Password has been updated successfully'}
    except:
        traceback.print_exc()
        send_data = {'status': 0, 'title': 'Error','msg': 'Someting went wrong'}
    return JsonResponse(send_data)
    
