from .views import *
from . import views_aj
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# this is pre url pms_admin
web_urls = [
    path('Login',Login,name='Login'),
    path('Dashboard',Dashboard,name='Dashboard'),
    path('Employee_List',Employee_List,name='Employee_List'),
    path('Designation_List',Designation_List,name='Designation_List'),
    path('Open_Projects',Open_Projects,name='Open_Projects'),
    path('Pipeline_Projects',Pipeline_Projects,name='Pipeline_Projects'),
    path('Closed_Projects',Closed_Projects,name='Closed_Projects'),
    path('Create_Project',Create_Project,name='Create_Project'),
    path('View_Project/<int:id>',View_Project,name='View_Project'),
    path('Update_Project/<int:id>',Update_Project,name='Update_Project'),
    path('Show_Tasks/<int:id>',Show_Tasks,name='Show_Tasks'),
    path('View_Task_Detail/<int:id>',View_Task_Detail,name='View_Task_Detail'),
    path('Show_Project_Milestones/<int:id>',Show_Project_Milestones,name='Show_Project_Milestones'),
    path('Company_List',Company_List,name='Company_List')
]

ajax_urls = [
    path('Loginajax',views_aj.Loginajax,name='Loginajax'),
    path('Logout',views_aj.Logout,name='Logout'),
    path('Add_Employee_By_SuperAdmin',views_aj.Add_Employee_By_SuperAdmin,name='Add_Employee_By_SuperAdmin'),
    path('Update_Employee_By_SuperAdmin',views_aj.Update_Employee_By_SuperAdmin,name='Update_Employee_By_SuperAdmin'),
    path('Delete_Employee',views_aj.Delete_Employee,name='Delete_Employee'),
    path('Create_Project_By_Admin',views_aj.Create_Project_By_Admin,name='Create_Project_By_Admin'),
    path('Get_State_List',views_aj.Get_State_List,name='Get_State_List'),
    path('Get_City_List',views_aj.Get_City_List,name='Get_City_List'),
    path('Delete_Project',views_aj.Delete_Project,name='Delete_Project'),
    path('Update_Project_By_Admin',views_aj.Update_Project_By_Admin,name='Update_Project_By_Admin'),
    path('Add_Update_Designation',views_aj.Add_Update_Designation,name='Add_Update_Designation'),
    path('Delete_Designation',views_aj.Delete_Designation,name='Delete_Designation'),
    path('Change_Task_Status',views_aj.Change_Task_Status,name='Change_Task_Status'),
    path('Get_User_List',views_aj.Get_User_List,name='Get_User_List'),
    path('Create_Task_By_Admin',views_aj.Create_Task_By_Admin,name='Create_Task_By_Admin'),
    path('Delete_Task',views_aj.Delete_Task,name='Delete_Task'),
    path('Get_Task_Obj',views_aj.Get_Task_Obj,name='Get_Task_Obj'),
    path('Update_Task_By_Admin',views_aj.Update_Task_By_Admin,name='Update_Task_By_Admin'),
    path('Get_All_User_List',views_aj.Get_All_User_List,name='Get_All_User_List'),
    path('Add_Milestone_Member',views_aj.Add_Milestone_Member,name='Add_Milestone_Member'),
    path('Remove_User_From_Milestone',views_aj.Remove_User_From_Milestone,name='Remove_User_From_Milestone'),
    path('Remove_Milestone',views_aj.Remove_Milestone,name='Remove_Milestone'),
    path('Add_Milestone',views_aj.Add_Milestone,name='Add_Milestone'),
    path('Update_Milestone',views_aj.Update_Milestone,name='Update_Milestone'),
    path('Get_Project_Member',views_aj.Get_Project_Member,name='Get_Project_Member'),
    path('Archive_Task',views_aj.Archive_Task,name='Archive_Task'),
    path('Filte_Archive_completed_task',views_aj.Filte_Archive_completed_task,name='Filte_Archive_completed_task'),
    path('Add_Update_Company',views_aj.Add_Update_Company,name='Add_Update_Company'),
    path('Delete_Company',views_aj.Delete_Company,name='Delete_Company')
]

urlpatterns = [*web_urls, *ajax_urls] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
