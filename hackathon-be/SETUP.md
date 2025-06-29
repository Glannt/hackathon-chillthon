# Setup Guide - MySQL Database

## Prerequisites

1. **MySQL Server** (8.0 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql-hackathon -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=hackathon_db -p 3306:3306 -d mysql:8.0`

2. **Node.js** (18 or higher)
3. **pnpm** package manager

## Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

#### Option A: Using MySQL Command Line

```bash
mysql -u root -p < scripts/setup-database.sql
```

#### Option B: Manual Database Creation

```sql
CREATE DATABASE hackathon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=hackathon_db

# Environment
NODE_ENV=development
```

### 4. Start the Application

```bash
pnpm run start:dev
```

The application will:

- Connect to MySQL database
- Create tables automatically (synchronize: true)
- Seed initial data (users, projects, tasks)

## Troubleshooting

### Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check port 3306 is not blocked
- Ensure database exists: `SHOW DATABASES;`

### Permission Issues

- Grant privileges: `GRANT ALL PRIVILEGES ON hackathon_db.* TO 'root'@'localhost';`
- Flush privileges: `FLUSH PRIVILEGES;`

### Character Set Issues

- Verify database charset: `SHOW CREATE DATABASE hackathon_db;`
- Should show: `utf8mb4` character set

## Production Setup

For production, update the `.env` file:

```env
NODE_ENV=production
DB_HOST=your_production_host
DB_USERNAME=your_production_user
DB_PASSWORD=your_production_password
```

**Important**: Set `synchronize: false` in production to prevent automatic schema changes.
