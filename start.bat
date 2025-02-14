@echo off
setlocal

set "venvDir=venv"
set "requirementsFile=requirements.txt"
set "backendDir=backend"
set "pythonScript=main.py"

cd %backendDir%
if not exist "%venvDir%" (

    echo Virtual environment not found. Creating...
    python -m venv %venvDir%

    echo Activating virtual environment...
    call "%venvDir%\Scripts\activate.bat"

    echo Installing python dependencies...
    pip install -r %requirementsFile%
) else (
    echo Virtual environment found.
    echo Activating virtual environment...
    call "%venvDir%\Scripts\activate.bat"
)

@REM echo Changing directory to backend...
@REM cd %backendDir%

echo Running main python script...
python %pythonScript%

endlocal
