@echo off
setlocal
chcp 65001 >nul
where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js precisa estar instalado neste computador para atualizar as fotos.
  echo Consulte FOTOS-DAS-PAGINAS.md para os passos.
  pause
  exit /b 1
)
node "%~dp0scripts\atualizar-fotos-paginas.mjs"
if errorlevel 1 (
  echo.
  echo A atualizacao falhou. Confira o erro acima.
  pause
  exit /b 1
)
echo.
echo Atualizacao local pronta. Confira as paginas antes de publicar.
pause
