# PrepQuest

Using on my mac set up

Create virutal environment
python3.11 -m venv /Users/steventhao/PrepQuest/env

Open virtual environment
source /Users/steventhao/PrepQuest/env/bin/activate

Check the version of python
python --version
or
python3.11 --version

- Side notes for myself
  To run all any command remember to used "python3.11" before any command
  Example: python3.11 manage.py makemirgration

Run the server:
python3 manage.py runserver

Super user (admin)
username: steventhao
Pw: L.....23

JWT token:
curl -X POST http://127.0.0.1:8000/api/token/ \
-H "Content-Type: application/json" \
-d '{"username": "yourusername", "password": "yourpassword"}'

This should return a JSON response with the access and refresh tokens:
{
"refresh": "your_refresh_token",
"access": "your_access_token"
}

use token :
curl -X POST http://127.0.0.1:8000/api/interview/start/ \
-H "Authorization: Bearer your_access_token" \
-H "Content-Type: application/json" \
-d '{"user": 1, "job_title": "Developer"}'

Respond:
curl -X POST http://127.0.0.1:8000/api/response/ \
-H "Authorization: Bearer your_access_token" \
-H "Content-Type: application/json" \
-d '{
"interview_session": 1,
"question": 1,
"user": 1,
"response_text": "I am a highly motivated and organized person."
}'
