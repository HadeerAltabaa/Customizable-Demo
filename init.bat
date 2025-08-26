@echo off
REM Install live-server globally
start cmd /k "echo Installing live-server... && npm install -g live-server && echo live-server is installed && pause && exit"

REM Install dependencies in server folder
start cmd /k "echo Installing dependencies in server folder... && cd server && npm install && echo Dependencies installed && pause && exit"


exit