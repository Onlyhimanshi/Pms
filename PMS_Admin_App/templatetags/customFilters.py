import ast, traceback
from datetime import date
from django import template
from PMS_App.models import *
from datetime import datetime
from django.conf import settings

register = template.Library()
import os

# convert iso format to date time string
@register.filter(name='get_file_name')    
def get_file_name(value):
        if hasattr(value, 'path'):
            file_path = value.path
        else:
            file_path = value
        return os.path.basename(file_path)