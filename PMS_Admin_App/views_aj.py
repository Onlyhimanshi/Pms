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


from ProjectUtilities.send_emails import *

def dummy():
    print("ffffffffffffffffffffffffff")
    response = send_normal_email('subject','string','kicivaw405@agromgt.com')
    print(response)
dummy()

def Increase_Delay_Count_Of_Project():
    todays_date = datetime.now().date()
    obj = Projects.objects.filter(status="Open")
    for i in obj:
        end_date = datetime.strptime(i.end_date.strftime("%Y-%m-%d"), "%Y-%m-%d").date()
        if todays_date > end_date:
            print('1',i.id)
            i.delay_days+=1
            i.save()

# Increase_Delay_Count_Of_Project()


def Increase_Delay_Count_Of_Task():
    todays_date = datetime.now().date()
    obj = Task_Master.objects.filter(Q(status="Pending") | Q(status = "Progress"))
    for i in obj:
        end_date = datetime.strptime(i.end_date.strftime("%Y-%m-%d"), "%Y-%m-%d").date()
        if todays_date > end_date:
            print(i.id)
            i.delay_days+=1
            i.save()

# Increase_Delay_Count_Of_Task()

@csrf_exempt
def Get_State_List(request):
    try:
        parsed_data = json.loads(request.body.decode('utf-8'))
        country_id = parsed_data['country_id']
        obj = StateMaster.objects.filter(fk_country_id = country_id)
        send_data = {'status':1,'msg':'country list','data':list(obj.values())}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong'}
    return JsonResponse(send_data)


@csrf_exempt
def Get_City_List(request):
    try:
        parsed_data = json.loads(request.body.decode('utf-8'))
        fk_state_id = parsed_data['state_id']
        obj = CityMaster.objects.filter(fk_state_id = fk_state_id)
        send_data = {'status':1,'msg':'City list','data':list(obj.values())}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong'}
    return JsonResponse(send_data)

@csrf_exempt
def Loginajax(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body.decode('utf-8'))
            username = data['username'] 
            password = data['password'] 

            print(username, '>>>>>>' , password)
            if Super_Admin.objects.filter(username=username, password=password).exists():
                obj = Super_Admin.objects.get(username=username, password=password)
                request.session['user_id']=obj.id
                request.session['user_type']='Admin'
                send_data = {'status': 1, 'msg': 'Admin Login Successfully'}
            else:
                send_data = {'status': 0, 'title': 'Invalid Credentials','msg': 'Please check your username and password..'}
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
    return redirect('Login')


@csrf_exempt
def Add_Employee_By_SuperAdmin(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            first_name = parsed_data['first_name']
            last_name = parsed_data['last_name']
            email=parsed_data['email']
            mobile_no = parsed_data['mobile_no']
            fk_company =  parsed_data['fk_company']
            fk_designation=parsed_data['fk_designation']
            if User_Details.objects.filter(email=email).exists():
                send_data = {'status':0,'msg':'It seems like this email is already in use. Please try using a different email address.'}
            elif User_Details.objects.filter(mobile_number=mobile_no).exists():
                send_data = {'status':0,'msg':'It seems like this mobile number is already in use. Please try using a different mobile number.'}
            else:
                passsword = ''.join(random.choice(string.ascii_letters + string.digits + string.punctuation) for i in range(8))
                User_Details.objects.create(fk_company_id=fk_company,fk_designation_id=fk_designation,email=email,mobile_number=mobile_no,password=passsword,first_name=first_name,last_name=last_name,created_date=datetime.now().date())
                send_data = {'status':1,'msg':f'Employee added successfully and credential sent on following email {email}'}
        else:
            send_data = {'status':0,'msg':f'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Update_Employee_By_SuperAdmin(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            first_name = parsed_data['first_name']
            last_name = parsed_data['last_name']
            email=parsed_data['email']
            mobile_no = parsed_data['mobile_no']
            fk_designation=parsed_data['fk_designation']
            fk_company=parsed_data['fk_company']

            User_Details.objects.filter(id=id).update(fk_company_id=fk_company,fk_designation_id=fk_designation,email=email,mobile_number=mobile_no,first_name=first_name,last_name=last_name)
            send_data = {'status':1,'msg':f'Employee profile has been updated successfully'}
        else:
            send_data = {'status':0,'msg':f'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Delete_Employee(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = User_Details.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'This employee account has been deleted successfully'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Create_Project_By_Admin(request):
    try:
        if request.method =='POST':
            project_title = request.POST.get('project_title')
            projectdesc = request.POST.get('projectdesc')
            start_date = request.POST.get('start_date')
            end_date = request.POST.get('end_date')
            fk_country = request.POST.get('country')
            fk_state = request.POST.get('state')
            fk_city = request.POST.get('city')
            priority = request.POST.get('priority')
            projectstatus = request.POST.get('projectstatus')
            team_members = request.POST.get('team_members')
            files_array = request.FILES.getlist('files[]')
            description_array = request.POST.getlist('description_array[]')
            project_logo = request.FILES.get('project_logo')

            milestone_json = request.POST.get('milestone_object')
            milestones_list = json.loads(milestone_json)
            cloud_url = request.POST.get('cloud_url')            
            obj=Projects.objects.create(start_date=start_date,end_date=end_date,title=project_title,description=projectdesc,fk_country_id=fk_country,fk_state_id=fk_state,fk_city=fk_city,priority=priority,status=projectstatus,fk_team_members=team_members,cloud_url=cloud_url,created_date=datetime.now().date())
            if project_logo:
                obj.project_logo=project_logo
                obj.save()

            for file,desc in zip(files_array,description_array):
                Project_Files.objects.create(fk_project_id=obj.id,project_files=file,file_description=desc) 

            for dict_obj in milestones_list:
                Project_Milestone.objects.create(fk_project_id=obj.id,fk_milestone_head_id=dict_obj['milestone_head'],milestone_title=dict_obj['milestonetitle'],start_date=dict_obj['milestone_start_date'],end_date=dict_obj['milestone_end_date'],created_date=datetime.now().date())

            send_data = {'status':1,'msg':'Great job! Your project has been added to the system'}
        else:
            send_data = {'status':0,'msg':'Request is not post'}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Delete_Project(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = Projects.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'This project has been deleted successfully'}
        else:
            send_data = {'status':0,'msg':'Request is not post'}

    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Update_Project_By_Admin(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            project_title = parsed_data['project_title']
            projectdesc = parsed_data['projectdesc']
            start_date = parsed_data['start_date']
            end_date = parsed_data['end_date']
            country = parsed_data['country']
            fk_state = parsed_data['state']
            fk_city = parsed_data['city']
            priority = parsed_data['priority']
            projectstatus = parsed_data['projectstatus']
            team_members = parsed_data['team_members']
            cloud_url = parsed_data['cloud_url']
            
            
            obj = Projects.objects.get(id=id)
            obj.start_date=start_date
            obj.end_date=end_date
            obj.title=project_title
            obj.description=projectdesc
            obj.fk_country_id = country
            obj.fk_state_id=fk_state
            obj.fk_city=fk_city
            obj.priority=priority
            obj.status=projectstatus
            obj.fk_team_members=team_members
            obj.cloud_url = cloud_url
            obj.created_date=datetime.now().date()
            obj.save()
            send_data = {'status':1,'msg':f'This project has been updated successfully'}
        else:
            send_data = {'status':1,'msg':f'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Delete_Designation(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = DesignationMaster.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'This designation has been deleted successfully'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Add_Update_Designation(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            action = parsed_data['action']
            designation = parsed_data['designation']
            if action == 'add':
                if  DesignationMaster.objects.filter(designation=designation).exists():
                    send_data ={'status':2,'msg':f'This designation already esists'}
                else:
                    DesignationMaster.objects.create(designation=designation,created_date=datetime.now().date())
                    send_data = {'status':1,'msg':f'Designation has been {action}ed successfully'}

            elif action == 'update':
                id = parsed_data['id']
                if  DesignationMaster.objects.filter(designation=designation).exclude(id=id).exists():
                    send_data ={'status':2,'msg':f'This designation already esists'}
                else:
                    DesignationMaster.objects.filter(id=id).update(designation=designation)
                    send_data = {'status':1,'msg':f'Designation has been {action}ed successfully'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)



@csrf_exempt
def Change_Task_Status(request):
    try:
        user_type = request.session.get('user_type')
        user_id = request.session.get('user_id')
        base_url = None
        if user_type == 'Admin':
            base_url = 'superadmin'
        elif user_type == 'User':
            base_url = 'user'

        data =json.loads(request.body.decode('utf-8'))
        card_id =data['card_id']
        status =data['status'] # you will get the status where you are going to drop the card
        obj= Task_Master.objects.get(id=card_id)
        obj.status=status
        obj.save()
        
        if user_type == 'User':
            pending_obj = Task_Master.objects.filter(Q(status='Pending') & (Q(fk_milestone_id=obj.fk_milestone.id) & (Q(fk_task_member_id=user_id) | Q(fk_task_creator_id=user_id)))).order_by('-id')
            progress_obj = Task_Master.objects.filter(Q(status='Progress') & (Q(fk_milestone_id=obj.fk_milestone.id) & (Q(fk_task_member_id=user_id) | Q(fk_task_creator_id=user_id)))).order_by('-id')
            completed_obj = Task_Master.objects.filter(Q(status='Completed') & (Q(fk_milestone_id=obj.fk_milestone.id) & (Q(fk_task_member_id=user_id) | Q(fk_task_creator_id=user_id)))).order_by('-id')
        else:
            pending_obj = Task_Master.objects.filter(status='Pending',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
            progress_obj = Task_Master.objects.filter(status='Progress',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
            completed_obj = Task_Master.objects.filter(status='Completed',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
        
        pending_rendered = render_to_string(base_url+'/rts/kanban/rts_pending.html',{'pending_obj':list(pending_obj.values())})
        progress_rendered = render_to_string(base_url+'/rts/kanban/rts_progress.html',{'progress_obj':progress_obj})
        completed_rendered = render_to_string(base_url+'/rts/kanban/rts_completed.html',{'completed_obj':list(completed_obj.values())})
        
        context={
                'pending_rendered':pending_rendered,
                'progress_rendered':progress_rendered,
                'completed_rendered':completed_rendered,
        }
        send_data={'status':1,'msg':'Change status successfully','rendered':context}
    except:
        print(traceback.format_exc())
        send_data={'status':0,'msg':'somthign went wrong','error':traceback.format_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Get_User_List(request):
    try:
        parsed_data = json.loads(request.body.decode('utf-8'))
        milestone_id = parsed_data['milestone_id']
        obj = Milestone_Members.objects.filter(fk_milestone_id = milestone_id)
        result = [i.fk_user.id for i in obj ]

        print(result)
        user_obj = User_Details.objects.filter(id__in = result)
        send_data = {'status':1,'msg':'User list','data':list(user_obj.values())}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong'}
    return JsonResponse(send_data)


@csrf_exempt
def Create_Task_By_Admin(request):
    try:
        if request.method =='POST':
            parsed_data = json.loads(request.body.decode('utf-8'))
            fk_milestone = parsed_data['fk_milestone_id']
            task_title = parsed_data['task_title']
            task_desc = parsed_data['task_desc']
            start_date = parsed_data['start_date']
            end_date = parsed_data['end_date']
            priority = parsed_data['priority']
            fk_task_member = parsed_data['fk_task_member']
            task_creator_id = parsed_data['task_creator_id']
            Task_Master.objects.create(fk_task_creator_id=task_creator_id,created_date=datetime.now().date(),fk_milestone_id=fk_milestone,fk_task_member_id=fk_task_member,title=task_title,description=task_desc,start_date=start_date,end_date=end_date,priority=priority,status='Pending')
            send_data = {'status':1,'msg':'Great job! Task has been created to the system'}
        else:
            send_data = {'status':0,'msg':'Request is not post'}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Update_Task_By_Admin(request):
    try:
        if request.method =='POST':
            parsed_data = json.loads(request.body.decode('utf-8'))
            task_id = parsed_data['task_id']
            task_title = parsed_data['task_title']
            task_desc = parsed_data['task_desc']
            start_date = parsed_data['start_date']
            end_date = parsed_data['end_date']
            priority = parsed_data['priority']
            fk_task_member = parsed_data['fk_task_member']
            Task_Master.objects.filter(id=task_id).update(fk_task_member_id=fk_task_member,title=task_title,description=task_desc,start_date=start_date,end_date=end_date,priority=priority)
            send_data = {'status':1,'msg':'Great job! Task has been updated to the system'}
        else:
            send_data = {'status':0,'msg':'Request is not post'}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Delete_Task(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            task_id = parsed_data['task_id']
            obj = Task_Master.objects.get(id=task_id)
            obj.delete()
            
            pending_obj = Task_Master.objects.filter(status='Pending',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
            pending_rendered = render_to_string('superadmin/rts/kanban/rts_pending.html',{'pending_obj':list(pending_obj.values())})

            progress_obj = Task_Master.objects.filter(status='Progress',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
            progress_rendered = render_to_string('superadmin/rts/kanban/rts_progress.html',{'progress_obj':progress_obj})

            completed_obj = Task_Master.objects.filter(status='Completed',fk_milestone_id=obj.fk_milestone.id).order_by('-id')
            completed_rendered = render_to_string('superadmin/rts/kanban/rts_completed.html',{'completed_obj':list(completed_obj.values())})

            
            context={
                    'pending_rendered':pending_rendered,
                    'progress_rendered':progress_rendered,
                    'completed_rendered':completed_rendered,
            }
            send_data={'status':1,'msg':'This task has been deleted successfully','rendered':context}
        else:
            send_data = {'status':0,'msg':'Request is not post'}

    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Get_Task_Obj(request):
    try:
        if request.method =='POST':
            parsed_data = json.loads(request.body.decode('utf-8'))
            task_id = parsed_data['task_id']
            obj = Task_Master.objects.get(id=task_id)
            milestone_obj = Milestone_Members.objects.filter(fk_milestone_id = obj.fk_milestone.id)
            result = [i.fk_user.id for i in milestone_obj ]
            user_obj = User_Details.objects.filter(id__in = result)
            if isinstance(obj, Model):
                obj_data = json.loads(serialize('json', [obj]))[0]['fields']
            else:
                obj_data = list(obj.values())
            send_data = {'status': 1, 'msg': 'Task detail', 'obj': obj_data,'user_obj':list(user_obj.values())}
        else:
            send_data = {'status':0,'msg':'Request is not post'}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Get_All_User_List(request):
    try:
        obj = User_Details.objects.all()
        send_data = {'status': 1, 'msg': 'User object list','user_list':list(obj.values())}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Add_Milestone_Member(request):
    try:
        if request.method =='POST':
            parsed_data = json.loads(request.body.decode('utf-8'))
            milestone_id = parsed_data['milestone_id']
            user_id = parsed_data['user_id']
            print(milestone_id,user_id)
            if Milestone_Members.objects.filter(fk_milestone_id=milestone_id,fk_user_id=user_id).exists():
                send_data = {'status':0,'title':"warning",'msg':'This Member already exists in this milestone'}
            else:
                Milestone_Members.objects.create(fk_milestone_id=milestone_id,fk_user_id=user_id)
                send_data = {'status':1,'msg':'Great job! New Member has been added to the milestone'}
        else:
            send_data = {'status':0,'msg':'Request is not post'}
    except:
        traceback.print_exc()    
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Remove_User_From_Milestone(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = Milestone_Members.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'This user has been removed from this milestone successfully'}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Remove_Milestone(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = Project_Milestone.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'Milestone has been removed successfully'}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Add_Milestone(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            project_id = parsed_data['project_id']
            milestone_title = parsed_data['milestone_title']
            milestone_head = parsed_data['milestone_head']
            print(milestone_head)
            print(type(milestone_head))
            start_date = parsed_data['start_date']
            end_date = parsed_data['end_date']
            Project_Milestone.objects.create(fk_project_id=project_id,fk_milestone_head_id=milestone_head,milestone_title=milestone_title,start_date=start_date,end_date=end_date,created_date=datetime.now().date())
            send_data = {'status':1,'msg':'Milestone has been created successflly!'}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Update_Milestone(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            milestone_id = parsed_data['milestone_id']
            milestone_title = parsed_data['milestone_title']
            milestone_head = parsed_data['milestone_head']
            start_date = parsed_data['start_date']
            end_date = parsed_data['end_date']
            Project_Milestone.objects.filter(id=milestone_id).update(fk_milestone_head_id=milestone_head,milestone_title=milestone_title,start_date=start_date,end_date=end_date,created_date=datetime.now().date())
            send_data = {'status':1,'msg':'Milestone has been updated successflly!'}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Get_Project_Member(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            team_arr = parsed_data['team_arr']
            dummy_list = []
            dummy_list = [int(i) for i in team_arr]
            user_obj = User_Details.objects.filter(id__in = dummy_list)
            print(user_obj)
            send_data = {'status':1,'msg':'Team array list','data':list(user_obj.values())}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)

@csrf_exempt
def Archive_Task(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['task_id']
            status = parsed_data['status']
            obj = Task_Master.objects.get(id=id)
            obj.status = status
            obj.save()
            send_data = {'status':1,'msg':f'{obj.title} task added to archived list Successfully'}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def  Filte_Archive_completed_task(request):
    try:
        if request.method == 'POST':
            parsed_data = json.loads(request.body.decode('utf-8'))
            milestone_id = parsed_data['milestone_id']
            status = parsed_data['status']
            completed_obj = Task_Master.objects.filter(status=status,fk_milestone_id=milestone_id).order_by('-id')
            completed_rendered = render_to_string('superadmin/rts/kanban/rts_completed.html',{'completed_obj':list(completed_obj.values())})
            send_data={'status':1,'msg':'Task list','completed_rendered':completed_rendered}
        else:
            send_data = {'status':0,'title':"error",'msg':'Request is not post'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'title':"error",'msg':'Something went wrong','error':traceback.print_exc()}
    return  JsonResponse(send_data)


@csrf_exempt
def Add_Update_Company(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            action = parsed_data['action']
            company = parsed_data['company']
            if action == 'add':
                if  CompanyMaster.objects.filter(company_name=company).exists():
                    send_data ={'status':2,'msg':f'This companay already esists'}
                else:
                    CompanyMaster.objects.create(company_name=company,created_date=datetime.now().date())
                    send_data = {'status':1,'msg':f'Company has been {action}ed successfully'}

            elif action == 'update':
                id = parsed_data['id']
                if  CompanyMaster.objects.filter(company_name=company).exclude(id=id).exists():
                    send_data ={'status':2,'msg':f'This companay already esists'}
                else:
                    CompanyMaster.objects.filter(id=id).update(company_name=company)
                    send_data = {'status':1,'msg':f'company has been {action}ed successfully'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)


@csrf_exempt
def Delete_Company(request):
    try:
        if request.method == "POST":
            parsed_data = json.loads(request.body.decode('utf-8'))
            id = parsed_data['id']
            obj = CompanyMaster.objects.get(id=id)
            obj.delete()
            send_data = {'status':1,'msg':f'Company has been deleted successfully'}
    except:
        traceback.print_exc()
        send_data = {'status':0,'msg':'Something went wrong','error':traceback.print_exc()}
    return JsonResponse(send_data)