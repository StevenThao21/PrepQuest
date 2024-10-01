from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse  # Import correctly
from rest_framework import status, generics
from .models import InterviewSession, Question, Response as UserResponse
from .serializers import InterviewSessionSerializer, QuestionSerializer, ResponseSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User 

class StartInterviewSession(APIView):
    def post(self, request):
        # Assuming user is authenticated and you have access to request.user
        user = request.user

        # Create an interview session (if not already in one)
        interview_session = InterviewSession.objects.create(user=user)

        # Fetch interview questions (you can filter by difficulty, job_title, etc.)
        questions = Question.objects.all()  # Adjust as per your logic
        serialized_questions = QuestionSerializer(questions, many=True)

        return DRFResponse({
            "interview_session": interview_session.id,
            "questions": serialized_questions.data,
        }, status=status.HTTP_200_OK)

class QuestionView(APIView):
    permission_classes = [IsAuthenticated]  # Allow all users access
    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return DRFResponse(serializer.data)

class SubmitResponse(APIView):
    def post(self, request):
        # Assuming user is authenticated
        user = request.user

        # Extract the necessary fields from the request
        interview_session_id = request.data.get('interview_session')
        question_id = request.data.get('question')
        response_text = request.data.get('response_text')

        try:
            interview_session = InterviewSession.objects.get(id=interview_session_id, user=user)
            question = Question.objects.get(id=question_id)

            # Create a new response
            response = UserResponse.objects.create(
                interview_session=interview_session,
                question=question,
                response_text=response_text
            )

            # Return success response
            return DRFResponse({"response": ResponseSerializer(response).data, "feedback": "Thank you for your response!"}, status=status.HTTP_200_OK)
        except InterviewSession.DoesNotExist:
            return DRFResponse({"detail": "Interview session not found."}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return DRFResponse({"detail": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return DRFResponse({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
