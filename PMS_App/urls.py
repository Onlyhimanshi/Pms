from .views import *
from . import views_aj
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# this is pre url pms_admin
web_urls = [
    path('',Login,name='Login'),
    path('Dashboard',Dashboard,name='Dashboard'),
    path('Open_Projects',Open_Projects,name='Open_Projects'),
    path('User_View_Project/<int:id>',User_View_Project,name='User_View_Project'),
    path('Show_User_Tasks/<int:id>',Show_User_Tasks,name='Show_User_Tasks'),
    path('View_user_Task_Detail/<int:id>',View_user_Task_Detail,name='View_user_Task_Detail'),
    path('Project_Milestones/<int:id>',Project_Milestones,name='Project_Milestones')
    
]
ajax_urls = [
    path('Loginajax',views_aj.Loginajax,name='Loginajax'),
    path('Logout',views_aj.Logout,name='Logout'),
    path('Get_User_Obj',views_aj.Get_User_Obj,name='Get_User_Obj'),
    path('Update_Password',views_aj.Update_Password,name='Update_Password')
]
urlpatterns = [*web_urls, *ajax_urls] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
