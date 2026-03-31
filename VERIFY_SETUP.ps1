#!/usr/bin/env pwsh

# Enterprise Task Management - Setup Verification Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Enterprise Task Management Setup Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$node = node --version 2>$null
if ($node) {
    Write-Host "✓ Node.js installed: $node" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npm = npm --version 2>$null
if ($npm) {
    Write-Host "✓ npm installed: $npm" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
}

# Check project files
Write-Host ""
Write-Host "Checking Project Files..." -ForegroundColor Yellow
$files = @(
    "package.json",
    "src/TaskManagementApp.jsx",
    "src/components/AdminDashboard.jsx",
    "src/components/TaskAssignmentModal.jsx",
    "src/components/TaskFilterBar.jsx",
    "server/server.js",
    "tailwind.config.js",
    "vite.config.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file MISSING" -ForegroundColor Red
    }
}

# Check dependencies
Write-Host ""
Write-Host "Checking npm Dependencies..." -ForegroundColor Yellow
$packagesNeeded = @(
    "react@19",
    "vite@6",
    "tailwindcss@4",
    "axios",
    "react-hot-toast",
    "react-multi-carousel"
)

$installed = npm list --depth=0 2>$null | Select-String -Pattern "react@|vite@|tailwindcss@|axios|react-hot-toast|react-multi-carousel"

if ($installed) {
    Write-Host "✓ Dependencies installed:" -ForegroundColor Green
    foreach ($item in $installed) {
        Write-Host "  $item" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ Run 'npm install' to install dependencies" -ForegroundColor Yellow
}

# Check build
Write-Host ""
Write-Host "Checking Build..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    Write-Host "✓ Build artifacts found in dist/" -ForegroundColor Green
    Write-Host "  Run 'npm run build' to rebuild" -ForegroundColor Gray
} else {
    Write-Host "⚠ No build found. Run 'npm run build'" -ForegroundColor Yellow
}

# Show next steps
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install dependencies (if needed):" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend server (in new terminal):" -ForegroundColor White
Write-Host "   cd server && npm install && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the frontend (in current terminal):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Create an admin account:" -ForegroundColor White
Write-Host "   - Register a new account" -ForegroundColor Gray
Write-Host "   - Use SQLite to promote to admin: UPDATE users SET role='admin' WHERE username='...'" -ForegroundColor Gray
Write-Host ""
Write-Host "Enterprise Features Available:" -ForegroundColor Cyan
Write-Host "  ✓ Admin Dashboard with user/team/project management" -ForegroundColor Green
Write-Host "  ✓ Task assignment to employees" -ForegroundColor Green
Write-Host "  ✓ Advanced filtering (by assignee, project, priority, status)" -ForegroundColor Green
Write-Host "  ✓ Role-based access control" -ForegroundColor Green
Write-Host "  ✓ Organizational structure (teams, departments, projects)" -ForegroundColor Green
Write-Host ""
Write-Host "Read ENTERPRISE_FEATURES.md for complete documentation" -ForegroundColor Cyan
Write-Host ""
