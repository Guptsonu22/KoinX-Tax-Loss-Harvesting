# KoinX Tax Loss Harvesting — Setup Script
# Run this in PowerShell from the project directory

Write-Host "Setting up KoinX Tax Loss Harvesting..." -ForegroundColor Cyan

# Navigate to project directory
$projectPath = "c:\Users\Sonu\Desktop\Tax Loss Harvesting"
Set-Location $projectPath

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

# Build check
Write-Host "`nRunning build check..." -ForegroundColor Yellow
npm run build

Write-Host "`nSetup complete! Run 'npm run dev' to start the development server." -ForegroundColor Green
