#!/bin/bash

# Fix UTF-8 encoding for Vietnamese characters
echo "Fixing UTF-8 encoding for Vietnamese characters..."

# Connect to MySQL and run the fix script
mysql -h server-mysql -u root -ppassword hackathon_db < scripts/fix-utf8.sql

echo "UTF-8 encoding fix completed!"
echo "Database and tables have been updated to support Vietnamese characters."
