@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
title Blue Pro Fishing - Preview Local

set "PORT=5500"
set "URL=http://127.0.0.1:%PORT%/linkbio/"
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%"
set "MANAGED=0"

rem Se o BAT estiver dentro do projeto, usa a pasta atual sem mexer no Git.
if exist "%PROJECT_DIR%linkbio\index.html" goto project_ready

rem Se o BAT foi baixado sozinho, usa/cria uma copia gerenciada ao lado dele.
set "PROJECT_DIR=%SCRIPT_DIR%BLUE-PRO-FISHING-NOVO"
set "MANAGED=1"

if exist "%PROJECT_DIR%\linkbio\index.html" goto update_managed

echo.
echo [BLUE PRO] Preparando o projeto pela primeira vez...

where git >nul 2>nul
if not errorlevel 1 (
    git clone --depth 1 --branch linkbio-v2 "https://github.com/digitalvp/BLUE-PRO-FISHING-NOVO.git" "%PROJECT_DIR%"
    if not errorlevel 1 goto project_ready
)

rem Fallback sem Git: baixa o ZIP publico da branch e extrai com PowerShell.
where powershell >nul 2>nul
if errorlevel 1 goto no_project

set "TMP_ZIP=%TEMP%\blue-pro-linkbio-v2.zip"
set "TMP_DIR=%TEMP%\blue-pro-linkbio-v2-%RANDOM%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing 'https://github.com/digitalvp/BLUE-PRO-FISHING-NOVO/archive/refs/heads/linkbio-v2.zip' -OutFile '%TMP_ZIP%'; Expand-Archive -Force '%TMP_ZIP%' '%TMP_DIR%'"
if errorlevel 1 goto no_project

for /d %%D in ("%TMP_DIR%\BLUE-PRO-FISHING-NOVO-*") do (
    move "%%~fD" "%PROJECT_DIR%" >nul
    goto extracted
)

:extracted
if exist "%TMP_ZIP%" del /q "%TMP_ZIP%" >nul 2>&1
if exist "%TMP_DIR%" rmdir /s /q "%TMP_DIR%" >nul 2>&1
if not exist "%PROJECT_DIR%\linkbio\index.html" goto no_project
goto project_ready

:update_managed
rem Atualiza apenas a copia criada pelo proprio BAT e somente se ela estiver limpa.
if exist "%PROJECT_DIR%\.git" (
    where git >nul 2>nul
    if not errorlevel 1 (
        for /f %%S in ('git -C "%PROJECT_DIR%" status --porcelain 2^>nul ^| find /c /v ""') do set "DIRTY=%%S"
        if "%DIRTY%"=="0" (
            echo [BLUE PRO] Atualizando preview local...
            git -C "%PROJECT_DIR%" pull --ff-only origin linkbio-v2 >nul 2>&1
        )
    )
)

goto project_ready

:project_ready
if not exist "%PROJECT_DIR%\linkbio\index.html" goto no_project

rem Se ja existe um servidor na porta, apenas abre o navegador.
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -UseBasicParsing '%URL%' -TimeoutSec 1; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto open_browser

set "SERVER_CMD="
where py >nul 2>nul
if not errorlevel 1 set "SERVER_CMD=py -m http.server %PORT% --bind 127.0.0.1"

if not defined SERVER_CMD (
    where python >nul 2>nul
    if not errorlevel 1 set "SERVER_CMD=python -m http.server %PORT% --bind 127.0.0.1"
)

if not defined SERVER_CMD (
    where npx >nul 2>nul
    if not errorlevel 1 set "SERVER_CMD=npx --yes http-server . -p %PORT% -a 127.0.0.1 -c-1"
)

if not defined SERVER_CMD goto no_server

pushd "%PROJECT_DIR%"
start "Blue Pro Local - servidor" /min cmd /c "%SERVER_CMD%"
popd

echo [BLUE PRO] Abrindo preview local...
timeout /t 2 /nobreak >nul

:open_browser
start "" "%URL%"
exit /b 0

:no_project
echo.
echo Nao consegui preparar o projeto automaticamente.
echo Verifique sua conexao com a internet e tente novamente.
echo.
pause
exit /b 1

:no_server
echo.
echo O projeto esta pronto, mas nao encontrei Python nem Node.js neste computador.
echo Instale Python ou Node.js uma unica vez e execute este arquivo novamente.
echo.
pause
exit /b 1
