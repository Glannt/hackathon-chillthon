-- Migration script for Project-User many-to-many relationship
-- This script ensures the project_users table is properly created

-- Create project_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS `project_users` (
  `project_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  KEY `IDX_project_users_project_id` (`project_id`),
  KEY `IDX_project_users_user_id` (`user_id`),
  CONSTRAINT `FK_project_users_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_project_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `IDX_project_users_project_id` ON `project_users` (`project_id`);
CREATE INDEX IF NOT EXISTS `IDX_project_users_user_id` ON `project_users` (`user_id`);

-- Verify the table structure
DESCRIBE project_users;

-- Show foreign key constraints
SELECT
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'hackathon_db'
    AND TABLE_NAME = 'project_users'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
