from django.db import models
from ckeditor.fields import RichTextField

class DesignationMaster(models.Model):
    designation = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True) 

class CompanyMaster(models.Model):
    company_name = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True) 


class CountryMaster(models.Model):
    country = models.CharField(null=True, blank=True, max_length=100)
    country_code = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True)

class StateMaster(models.Model):
    fk_country = models.ForeignKey(CountryMaster, on_delete=models.CASCADE, null=True, blank=True)
    state = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True) 

class CityMaster(models.Model):
    fk_state = models.ForeignKey(StateMaster, on_delete=models.CASCADE, null=True, blank=True)
    city = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True) 

class Super_Admin(models.Model):
    name = models.CharField(null=True, blank=True, max_length=100)
    username = models.CharField(null=True, blank=True, max_length=100)
    password = models.CharField(null=True, blank=True, max_length=100)
    created_date = models.DateField(null=True , blank=True)

class User_Details(models.Model):
    fk_company = models.ForeignKey(CompanyMaster, on_delete=models.CASCADE, null=True, blank=True)
    fk_designation = models.ForeignKey(DesignationMaster, on_delete=models.CASCADE, null=True, blank=True)
    created_date = models.DateField(null=True , blank=True) 
    first_name = models.CharField(null=True, blank=True, max_length=100)
    last_name = models.CharField(null=True, blank=True, max_length=100)
    email = models.CharField(null=True, blank=True, max_length=100)
    mobile_number = models.CharField(null=True, blank=True, max_length=100)
    profile_pic = models.FileField(upload_to="profiles/", blank=True, null=True)
    password = models.CharField(null=True, blank=True, max_length=100)

class Projects(models.Model):
    created_date = models.DateField(null=True , blank=True)
    fk_country = models.ForeignKey(CountryMaster, on_delete=models.CASCADE, null=True, blank=True)
    fk_state = models.ForeignKey(StateMaster, on_delete=models.CASCADE, null=True, blank=True)
    fk_city = models.CharField(null=True, blank=True ,max_length=300)
    fk_team_members = models.CharField(null=True, blank=True, max_length=100)
    title = models.CharField(null=True, blank=True, max_length=300)
    description = models.TextField(null=True,blank=True)    
    start_date = models.DateTimeField(null=True , blank=True)
    end_date = models.DateTimeField(null=True , blank=True)
    project_logo = models.FileField(upload_to="project_files/", blank=True, null=True)

    PRIORITY =(
        ("High", "High"),
        ("Medium", "Medium"),
      	("Low", "Low"),
	)
    priority=models.CharField(max_length= 200 , choices =PRIORITY, default='High')

    STATUS =(
      	("Pipeline", "Pipeline"),
        ("Open", "Open"),
        ("Closed", "Closed"),
	)
    status=models.CharField(max_length= 200 , choices =STATUS, default='Pipeline')
    delay_days = models.IntegerField(null=True, default=0)
    cloud_url  = models.URLField(max_length=200,null=True,blank=True)


class Project_Milestone(models.Model):
    created_date = models.DateField(null=True , blank=True)
    fk_milestone_head = models.ForeignKey(User_Details,on_delete=models.CASCADE,null=True,blank=True)
    fk_project = models.ForeignKey(Projects,on_delete=models.CASCADE,null=True,blank=True)
    milestone_title = models.CharField(null=True, blank=True, max_length=300)
    start_date = models.DateTimeField(null=True , blank=True)
    end_date = models.DateTimeField(null=True , blank=True)
    delay_days = models.IntegerField(null=True, default=0)


class Milestone_Members(models.Model):
    fk_user = models.ForeignKey(User_Details,on_delete=models.CASCADE,null=True,blank=True)
    fk_milestone = models.ForeignKey(Project_Milestone,on_delete=models.CASCADE,null=True,blank=True)

class Task_Master(models.Model):
    created_date = models.DateField(null=True , blank=True)
    fk_task_creator = models.ForeignKey(User_Details,related_name='created_tasks' , on_delete = models.CASCADE,null=True,blank= True)
    fk_task_member = models.ForeignKey(User_Details,related_name='assigned_tasks', on_delete=models.CASCADE,null=True,blank=True)
    fk_milestone = models.ForeignKey(Project_Milestone,on_delete = models.CASCADE,null=True,blank= True)
    title = models.CharField(null=True, blank=True, max_length=300)
    description = RichTextField(null=True,blank=True)    
    start_date = models.DateTimeField(null=True , blank=True)
    end_date = models.DateTimeField(null=True , blank=True)
    PRIORITY =(
      	("Low", "Low"),
        ("High", "High"),
        ("Medium", "Medium"),
	)
    priority=models.CharField(max_length= 200 , choices =PRIORITY, default='High')

    STATUS =(
      	("Pending", "Pending"),
        ("Progress", "Progress"),
        ("Completed", "Completed"),
        ("Archive", "Archive"),
	)
    status=models.CharField(max_length= 200 , choices =STATUS, default='Pending')
    delay_days = models.IntegerField(null=True, default=0)

class Project_Files(models.Model):
    fk_project = models.ForeignKey(Projects, on_delete=models.CASCADE, null=True, blank=True)
    file_description  = models.CharField(null=True, blank=True, max_length=300)
    project_files = models.FileField(upload_to="project_files/", blank=True, null=True)

