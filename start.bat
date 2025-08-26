@echo off
REM Start npm run dev first in server folder
start cmd /k "cd server && echo Starting server (npm run dev)... && npm run dev"

REM Start live-server in root, ignoring server folder
start cmd /k "echo Waiting for server to start... && timeout /t 5 >nul && echo Starting live-server... && live-server --ignore=^server"

exit