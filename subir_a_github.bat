@echo off
title Subir EternoDev a GitHub
color 0E
echo ===================================================
echo             SUBIR CAMBIOS A GITHUB
echo ===================================================
echo.
cd /d "c:\Users\paucr\Documents\antigravity\silly-curie"
echo Estado actual de Git:
git status -s
echo.
echo Sincronizando cambios remotos de GitHub Actions...
git pull --rebase origin main
echo.
echo Subiendo rama main a GitHub (origin/main)...
echo Si el navegador te pide iniciar sesion, confirma tu cuenta.
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo    SUBIDO CON EXITO A GITHUB
    echo ===================================================
) else (
    echo ===================================================
    echo    HUBO UN ERROR AL SUBIR. REVISA TU SESION.
    echo ===================================================
)
echo.
pause
