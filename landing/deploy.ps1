# YoDo Marketplace Deployment Script for Windows
# Deploy to: alexei@158.255.6.22

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting YoDo Marketplace deployment..." -ForegroundColor Green

# Configuration
$SERVER_USER = "alexei"
$SERVER_IP = "158.255.6.22"
$SERVER_PATH = "/home/alexei/yodo-marketplace"
$SERVER = "${SERVER_USER}@${SERVER_IP}"

Write-Host "📦 Building production version..." -ForegroundColor Yellow

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install --force
}

# Build the project
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build

Write-Host "📤 Deploying to server ${SERVER}..." -ForegroundColor Cyan

# Create directory on server
Write-Host "📂 Creating directory on server..." -ForegroundColor Yellow
ssh ${SERVER} "mkdir -p ${SERVER_PATH}"

# Use SCP or PSCP to copy files
Write-Host "📂 Copying files to server..." -ForegroundColor Yellow

# List of directories and files to copy
$filesToCopy = @(
    ".next",
    "public",
    "src",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs"
)

foreach ($item in $filesToCopy) {
    if (Test-Path $item) {
        Write-Host "  Copying $item..." -ForegroundColor Gray
        if (Test-Path $item -PathType Container) {
            scp -r $item ${SERVER}:${SERVER_PATH}/
        } else {
            scp $item ${SERVER}:${SERVER_PATH}/
        }
    }
}

# Install and start on server
Write-Host "🔧 Setting up on server..." -ForegroundColor Yellow

$remoteCommands = @"
cd ${SERVER_PATH}

echo "📥 Installing dependencies..."
npm install --production --force

echo "🛑 Stopping existing processes..."
pkill -f 'next start' || true
pkill -f 'node.*next' || true

echo "🚀 Starting application..."
if command -v pm2 &> /dev/null; then
    pm2 delete yodo-landing || true
    pm2 start npm --name 'yodo-landing' -- start -- -p 3000
    pm2 save
    echo "✅ Started with PM2"
else
    nohup npm start > app.log 2>&1 &
    echo "✅ Started with nohup"
fi

echo "✨ Application is running on port 3000"
"@

ssh ${SERVER} $remoteCommands

Write-Host ""
Write-Host "✨ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your application is running at: http://158.255.6.22:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Useful commands:" -ForegroundColor Yellow
Write-Host "   Check logs: ssh ${SERVER} 'cd ${SERVER_PATH} && tail -f app.log'" -ForegroundColor Gray
Write-Host "   Restart app: ssh ${SERVER} 'cd ${SERVER_PATH} && pm2 restart yodo-landing'" -ForegroundColor Gray
Write-Host "   View status: ssh ${SERVER} 'pm2 status'" -ForegroundColor Gray




