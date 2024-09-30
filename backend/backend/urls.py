from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import StartInterviewSession, QuestionView, SubmitResponse, CreateUserView
from django.http import JsonResponse

# Define a simple view for the root URL
def home(request):
    return JsonResponse({'message': 'Welcome to the PreQuest API'})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/interview/start/', StartInterviewSession.as_view(), name='start-interview'),
    path('api/questions/', QuestionView.as_view(), name='questions'),
    path('api/response/', SubmitResponse.as_view(), name='submit-response'),
    path('api/user/register/', CreateUserView.as_view(), name='register'),  # Add this for registration
    path('', home),  # Add this line to handle the root URL
]
