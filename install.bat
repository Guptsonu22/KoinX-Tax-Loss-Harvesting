@echo off
echo KoinX Tax Loss Harvesting - Setup
echo ==================================
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed!
  pause
  exit /b 1
)
echo.
echo Build verification...
call npm run build
if %errorlevel% neq 0 (
  echo ERROR: Build failed! Check TypeScript errors above.
  pause
  exit /b 1
)
echo.
echo ✓ Setup complete!
echo Run: npm run dev
echo.
pause
