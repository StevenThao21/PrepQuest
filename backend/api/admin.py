from django.contrib import admin
from .models import InterviewSession, Question, Response

admin.site.register(InterviewSession)
admin.site.register(Question)
admin.site.register(Response)
