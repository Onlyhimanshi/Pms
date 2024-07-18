from django.shortcuts import render
from django.views.decorators.cache import cache_control
from ProjectUtilities.decorators import *
from PMS_App.models import *
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from .models import *
from ProjectUtilities.decorators import *
from datetime import date
import ast
from django.db.models import Q

def Login(request):
    session = request.session.get('user_id')
    if session:
        print(session,'.....................')
        return redirect('Login')
    else:
        return render(request, 'user/htmls/login.html')
    
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def Dashboard(request,user):
    context = {
        'user':user,
    }
    return render(request, 'user/htmls/dashboard.html',context)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def Open_Projects(request,user):
    project_obj = Projects.objects.filter(status="Open",fk_team_members__contains = user.id).order_by('-id')
    user_list =  User_Details.objects.all().order_by('-id')
    today = date.today()
    for i in project_obj:
        result = ast.literal_eval(i.fk_team_members)
        if isinstance(result, int):
            i.user_id_list = [result]
        else:
            i.user_id_list = [int(x) for x in result]
        
    context = {
        'today':today,
        'user':user,
        'page_title':"Open Projects",
        'project_obj':project_obj,
        'user_list':user_list
    }
    return render(request,'user/htmls/open_projects.html',context)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def User_View_Project(request,user,id):
    obj = Projects.objects.get(id=id)
    try:
        result = list(ast.literal_eval(obj.fk_team_members))
        user_list = User_Details.objects.filter(id__in = result).order_by('-first_name')
    except:
        id = ast.literal_eval(obj.fk_team_members)
        user_list = User_Details.objects.filter(id = id).order_by('-first_name')
    
    files_obj = Project_Files.objects.filter(fk_project_id=id)
    context = {
        'user':user,
        'page_title':"View Project",
        'obj':obj,
        'user_list':user_list,
        'files_obj':files_obj
    }
    return render(request,'user/htmls/view_project.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def View_user_Task_Detail(request,user,id):
    obj =  Task_Master.objects.get(id=id)
    context = {
        'user':user,
        'page_title':"Task Detail",
        'obj':obj,
    }
    return render(request,'user/htmls/view_task.html',context)

from django.db.models import Subquery, OuterRef
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def Project_Milestones(request,user,id):
    try:
        today = date.today()
        milstones_obj = Project_Milestone.objects.filter(Q(fk_project_id=id,fk_milestone_head=user.id) | Q(milestone_members__fk_user=user.id)).distinct()
        for i in milstones_obj:
            i.users = Milestone_Members.objects.filter(fk_milestone_id=i.id)
        obj = Projects.objects.get(id=id)
        user_obj = User_Details.objects.filter(id__in = list(eval(obj.fk_team_members)))
        context = {
            'user':user,
            'page_title':"Project Milestones",
            'milstones_obj':milstones_obj,
            'user_list':milstones_obj,
            'user_obj':user_obj,
            'today':today,
            'project_id':id
        }
    except:
        traceback.print_exc()
    return render(request,'user/htmls/milestones_list.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@User_login_required_decorator
def Show_User_Tasks(request,user,id):
    try:
        pending_obj = Task_Master.objects.filter(Q(status='Pending') & (Q(fk_milestone_id=id) & (Q(fk_task_member_id=user.id) | Q(fk_task_creator_id=user.id)))).order_by('-id')
        progress_obj = Task_Master.objects.filter(Q(status='Progress') & (Q(fk_milestone_id=id) & (Q(fk_task_member_id=user.id) | Q(fk_task_creator_id=user.id)))).order_by('-id')
        completed_obj = Task_Master.objects.filter(Q(status='Completed') & (Q(fk_milestone_id=id) & (Q(fk_task_member_id=user.id) | Q(fk_task_creator_id=user.id)))).order_by('-id')
        
        pending_rendered = render_to_string('user/rts/kanban/rts_pending.html',{'user':user,'pending_obj':pending_obj})
        progress_rendered = render_to_string('user/rts/kanban/rts_progress.html',{'user':user,'progress_obj':progress_obj})
        completed_rendered = render_to_string('user/rts/kanban/rts_completed.html',{'user':user,'completed_obj':completed_obj})
        obj =  Project_Milestone.objects.get(id=id)
        
        print(user.id)
        context = {
            'user':user,
            'milestone_id':id,
            'obj':obj,
            'page_title':"Task List",
            "pending_rendered":pending_rendered,
            'progress_rendered':progress_rendered,
            'completed_rendered':completed_rendered
        }
    except:
        traceback.print_exc()
    return render(request,'user/htmls/task_list.html',context)
