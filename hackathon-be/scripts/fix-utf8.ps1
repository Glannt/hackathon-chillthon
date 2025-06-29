# Fix UTF-8 encoding for Vietnamese characters
Write-Host "Fixing UTF-8 encoding for Vietnamese characters..." -ForegroundColor Green

# Connect to MySQL and run the fix script
Get-Content scripts/fix-utf8.sql | mysql -h server-mysql -u root -ppassword hackathon_db

Write-Host "UTF-8 encoding fix completed!" -ForegroundColor Green
Write-Host "Database and tables have been updated to support Vietnamese characters." -ForegroundColor Green
