from django.contrib import admin
from .models import *

@admin.register(CountryMaster)
class CountryMasterAdmin(admin.ModelAdmin):
    list_display = ['id', 'country']

@admin.register(StateMaster)
class StateMasterAdmin(admin.ModelAdmin):
    list_display = ['id', 'fk_country','state']
    
@admin.register(CityMaster)
class CityMasterAdmin(admin.ModelAdmin):
    list_display = ['id', 'fk_state', 'city']

@admin.register(DesignationMaster)
class DesignationMasterAdmin(admin.ModelAdmin):
    list_display = ['id', 'designation', 'created_date']


@admin.register(CompanyMaster)
class CompanyMasterMasterAdmin(admin.ModelAdmin):
    list_display = ['id', 'company_name', 'created_date']


@admin.register(Super_Admin)
class Super_AdminAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'username','created_date']

@admin.register(User_Details)
class User_DetailsAdmin(admin.ModelAdmin):
    list_display = ['id', 'fk_designation', 'first_name','last_name','email','mobile_number','created_date']

@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ['id','created_date','title' ,'priority','status', 'fk_team_members','start_date','end_date']

@admin.register(Project_Milestone)
class Project_MilestoneAdmin(admin.ModelAdmin):
    list_display = ['id','created_date','fk_project','fk_milestone_head','milestone_title','start_date','end_date']

@admin.register(Milestone_Members)
class Milestone_MembersAdmin(admin.ModelAdmin):
    list_display = ['id','fk_user','fk_milestone']


@admin.register(Project_Files)
class Project_FilesAdmin(admin.ModelAdmin):
    list_display = ['id','fk_project', 'file_description']

@admin.register(Task_Master)
class Task_MasterAdmin(admin.ModelAdmin):
    list_display = ['id','fk_task_creator','fk_task_member','fk_milestone','title','status','priority']
