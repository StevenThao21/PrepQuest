from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse
from rest_framework import status
from .models import InterviewSession, Question, Response as UserResponse
from .serializers import InterviewSessionSerializer, QuestionSerializer, ResponseSerializer
from rest_framework.permissions import AllowAny

class StartInterviewSession(APIView):
    def post(self, request):
        serializer = InterviewSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionView(APIView):
    permission_classes = [AllowAny]  # Allow all users access
    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return DRFResponse(serializer.data)

class SubmitResponse(APIView):
    def post(self, request):
        serializer = ResponseSerializer(data=request.data)
        if serializer.is_valid():
            # Save the response
            serializer.save()

            # Optionally, add feedback logic here if needed
            feedback = "Thank you for your response!"  # Placeholder feedback
            return DRFResponse({"response": serializer.data, "feedback": feedback}, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)