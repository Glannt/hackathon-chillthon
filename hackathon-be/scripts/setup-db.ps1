# Setup Database Script for Hackathon Project (Windows PowerShell)
# This script connects to the MySQL Docker container and creates the database

Write-Host "Setting up database for Hackathon project..." -ForegroundColor Green

# Connect to MySQL container and run setup script
Get-Content scripts/setup-database.sql | docker exec -i server-mysql mysql -u root -ppassword

Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host "You can now start the application with: npm run start:dev" -ForegroundColor Yellow
