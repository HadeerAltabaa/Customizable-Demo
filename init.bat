@echo off
REM Install live-server globally
start cmd /k "echo Installing live-server... && echo This window will close after the installation && npm install -g live-server && echo live-server is installed && exit"

REM Install dependencies in server folder
start cmd /k "echo Installing dependencies in server folder... && echo This window will close after the installation && cd server && npm install && echo Dependencies installed && exit"


exit