from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Question

class QuestionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        Question.objects.create(content="What is your greatest strength?", job_title="Developer", difficulty=2)

    def test_get_questions(self):
        response = self.client.get('/api/questions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
