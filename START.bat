@echo off
setlocal

set "PYTHON_REL_PATH=server\bin\python-3.13.4"
set "NPM_REL_PATH=server\bin\node"
set "NODE_MODULES_PATH=server\node_modules"
set "CURRENT_DIR=%~dp0"
set "PYTHON_PATH=%CURRENT_DIR%%PYTHON_REL_PATH%"
set "NPM_PATH=%CURRENT_DIR%%NPM_REL_PATH%"

set /p installNode="Do you want to install the latest Node.js zip and unpack it to server\bin\node? (y/n): "
if /i "%installNode%"=="y" (
	echo Downloading latest Node.js...
	powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/latest/node-v18.17.1-win-x64.zip -OutFile \"%TEMP%\node_latest.zip\""
	echo Extracting Node.js...
	powershell -Command "Expand-Archive -Path \"%TEMP%\node_latest.zip\" -DestinationPath \"%CURRENT_DIR%server\bin\" -Force"
	move /y "%CURRENT_DIR%server\bin\node-v18.17.1-win-x64" "%NPM_PATH%"
	del "%TEMP%\node_latest.zip"
)

set "PATH=%NPM_PATH%;%PYTHON_PATH%;%PATH%"

set /p installServerModules="Do you want to install server node_modules using npm? (y/n): "
if /i "%installServerModules%"=="y" (
	echo Installing server node_modules...
	npm install --prefix "%CURRENT_DIR%server"
)

echo Python path set to %PYTHON_PATH%
echo NPM path set to %NPM_PATH%

npm start --prefix "%CURRENT_DIR%server"

cmd /k
