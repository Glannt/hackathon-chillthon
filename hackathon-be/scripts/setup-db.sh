#!/bin/bash

# Setup Database Script for Hackathon Project
# This script connects to the MySQL Docker container and creates the database

echo "Setting up database for Hackathon project..."

# Connect to MySQL container and run setup script
docker exec -i server-mysql mysql -u root -ppassword < scripts/setup-database.sql

echo "Database setup completed!"
echo "You can now start the application with: npm run start:dev"
