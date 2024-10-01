from django.db import models
from django.contrib.auth.models import User

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.job_title} interview on {self.start_time}"

class Question(models.Model):
    text = models.CharField(max_length=255)  # Define the 'text' field for the question
    difficulty = models.IntegerField(default=1)  # Define the 'difficulty' field with a default value

    def __str__(self):
        return self.text


class Response(models.Model):
    interview_session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response_text = models.TextField()
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response by {self.interview_session.user.username} to {self.question.id}"
