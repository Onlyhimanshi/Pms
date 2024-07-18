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


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def Login(request):
    session = request.session.get('user_id')
    if session:
        print(session,'.....................')
        return redirect('/pms_admin/Dashboard')
    else:
        return render(request, 'superadmin/htmls/login.html')
    
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Dashboard(request,user):
    context = {
        'user':user,
    }
    return render(request, 'superadmin/htmls/dashboard.html',context)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Employee_List(request,user):
    designation_obj= DesignationMaster.objects.all().order_by('-id')
    employee_obj =  User_Details.objects.all().order_by('-id')
    company_obj =  CompanyMaster.objects.all().order_by('-id')
    rendered = render_to_string('superadmin/rts/employee_rts.html',{'employee_obj':employee_obj,'designation_obj':designation_obj,'company_obj':company_obj})
    context = {
        'user':user,
        'rendered':rendered,
        'page_title':"Employee List",
        "designation_obj":designation_obj,
        'company_obj':company_obj
    }
    return render(request,'superadmin/htmls/employee_list.html',context)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Open_Projects(request,user):
    project_obj = Projects.objects.filter(status="Open").order_by('-id')
    user_list =  User_Details.objects.all().order_by('-id')
    today = date.today()
    for i in project_obj:
        i.user_id_list = [int(i) for i in list(eval(i.fk_team_members))]

    context = {
        'today':today,
        'user':user,
        'page_title':"Open Projects",
        'project_obj':project_obj,
        'user_list':user_list
    }
    return render(request,'superadmin/htmls/open_projects.html',context)


# pipeline project satrt
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Pipeline_Projects(request,user):
    try:
        project_obj = Projects.objects.filter(status="Pipeline").order_by('-id')
        user_list =  User_Details.objects.all().order_by('-id')
        today = date.today()
        for i in project_obj:
            i.user_id_list = [int(i) for i in list(eval(i.fk_team_members))]

        context = {
            'today':today,
            'user':user,
            'page_title':"Pipeline Projects",
            'project_obj':project_obj,
            'user_list':user_list
        }
    except:
        traceback.print_exc()
    return render(request,'superadmin/htmls/pipeline_projects.html',context)
# pipeline project end

# closed Project start
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Closed_Projects(request,user):
    try:
        project_obj = Projects.objects.filter(status="Closed").order_by('-id')
        user_list =  User_Details.objects.all().order_by('-id')
        today = date.today()
        for i in project_obj:
            i.user_id_list = [int(i) for i in list(eval(i.fk_team_members))]

        context = {
            'today':today,
            'user':user,
            'page_title':"Closed Projects",
            'project_obj':project_obj,
            'user_list':user_list
        }
    except:
        traceback.print_exc()
    return render(request,'superadmin/htmls/closed_projects.html',context)
# closed project end

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Create_Project(request,user):
    today = date.today()
    country_obj = CountryMaster.objects.all().order_by('country')
    state_obj = StateMaster.objects.all().order_by('state')
    user_obj = User_Details.objects.all().order_by('first_name')
    context = {
        'user':user,
        'page_title':"Create Project",
        'today':today,
        'state_obj':state_obj,
        'user_obj':user_obj,
        'country_obj':country_obj
    }
    return render(request,'superadmin/htmls/create_project.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def View_Project(request,user,id):
    try:
        obj = Projects.objects.get(id=id)
        try:
            saved_city_list = [int(i) for i in list(eval(obj.fk_city))]
        except:
            saved_city_list = [eval(obj.fk_city)]
            
        city_list = CityMaster.objects.filter(fk_state_id = obj.fk_state.id)
        result = list(eval(obj.fk_team_members))
        user_list = User_Details.objects.filter(id__in = result).order_by('-first_name')
        files_obj = Project_Files.objects.filter(fk_project_id=id)
        context = {
            'user':user,
            'page_title':"View Project",
            'obj':obj,
            'user_list':user_list,
            'city_list':city_list,
            'saved_city_list':saved_city_list,
            'files_obj':files_obj
        }
    except:
        traceback.print_exc()
    return render(request,'superadmin/htmls/view_project.html',context)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Update_Project(request,user,id):
    today = date.today()
    obj = Projects.objects.get(id=id)
    country_obj = CountryMaster.objects.all().order_by('country')
    state_obj = StateMaster.objects.all().order_by('state')
    city_obj = CityMaster.objects.all().order_by('city')
    user_obj = User_Details.objects.all().order_by('first_name')
    user_id_list = [int(i) for i in eval(obj.fk_team_members)] 
    city_list = CityMaster.objects.filter(fk_state_id =obj.fk_state.id)
    try:
        saved_city_list = [int(i) for i in list(eval(obj.fk_city))]
    except:
        saved_city_list = [eval(obj.fk_city)]
        
    context = {
        'user':user,
        'page_title':"Update Project",
        'today':today,
        'state_obj':state_obj,
        'country_obj':country_obj,
        'city_obj':city_obj,
        'user_obj':user_obj,
        'obj':obj,
        'user_id_list':user_id_list,
        'city_list':city_list,
        'saved_city_list':saved_city_list
    }
    return render(request,'superadmin/htmls/update_project.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Designation_List(request,user):
    designation_obj= DesignationMaster.objects.all().order_by('-id')
    rendered = render_to_string('superadmin/rts/designation_rts.html',{'designation_obj':designation_obj})
    context = {
            'user':user,
            'rendered':rendered,
            'page_title':"Designation List",
            "designation_obj":designation_obj
        }
    return render(request,'superadmin/htmls/designation_list.html',context)



@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def View_Task_Detail(request,user,id):
    obj =  Task_Master.objects.get(id=id)
    context = {
        'user':user,
        'page_title':"Task Detail",
        'obj':obj,
    }
    return render(request,'superadmin/htmls/view_task.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Show_Project_Milestones(request,user,id):
    try:
        today = date.today()
        milstones_obj =  Project_Milestone.objects.filter(fk_project_id=id).order_by('-id')
        for i in milstones_obj:
            i.users = Milestone_Members.objects.filter(fk_milestone_id=i.id)
        user = Projects.objects.get(id=id)
        user_obj = User_Details.objects.filter(id__in = list(eval(user.fk_team_members)))
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
    return render(request,'superadmin/htmls/milestones_list.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Show_Tasks(request,user,id):
    try:
        print(id)
        pending_obj = Task_Master.objects.filter(status='Pending',fk_milestone_id=id).order_by('-id')
        pending_rendered = render_to_string('superadmin/rts/kanban/rts_pending.html',{'pending_obj':pending_obj})

        progress_obj = Task_Master.objects.filter(status='Progress',fk_milestone_id=id).order_by('-id')
        progress_rendered = render_to_string('superadmin/rts/kanban/rts_progress.html',{'progress_obj':progress_obj})

        completed_obj = Task_Master.objects.filter(status='Completed',fk_milestone_id=id).order_by('-id')
        completed_rendered = render_to_string('superadmin/rts/kanban/rts_completed.html',{'completed_obj':completed_obj})

        context = {
            'user':user,
            'milestone_id':id,
            'page_title':"Task List",
            "pending_rendered":pending_rendered,
            'progress_rendered':progress_rendered,
            'completed_rendered':completed_rendered
        }
    except:
        traceback.print_exc()
    return render(request,'superadmin/htmls/task_list.html',context)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
@Admin_login_required_decorator
def Company_List(request,user):
    Company_obj= CompanyMaster.objects.all().order_by('-id')
    rendered = render_to_string('superadmin/rts/company_rts.html',{'Company_obj':Company_obj})
    context = {
            'user':user,
            'rendered':rendered,
            'page_title':"Company List",
            "Company_obj":Company_obj
        }
    return render(request,'superadmin/htmls/company_list.html',context)
