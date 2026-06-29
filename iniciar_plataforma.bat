@echo off
title Iniciar Servidor de Desenvolvimento NSNexus
echo =======================================================
echo   NSNEXUS - INICIANDO AMBIENTE REACT LOCAL
echo =======================================================
echo.
set "PATH=C:\Users\01543230\AppData\Local\nodejs\node-v20.15.1-win-x64;%PATH%"
echo Servidor rodando em: http://localhost:5173/
echo Pressione Ctrl + C para encerrar o servidor.
echo.
call npm run dev
pause
