@ECHO OFF
TITLE trainers image library dev server
ECHO Open http://127.0.0.1:8000/
ruby -run -ehttpd .. -p8000
