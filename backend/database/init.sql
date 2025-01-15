-- 创建数据库
CREATE DATABASE IF NOT EXISTS ai_navigation;
USE ai_navigation;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建榜单表
CREATE TABLE IF NOT EXISTS rankings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    source ENUM('36kr', 'analysys', 'aliyun', 'sspai', 'itjuzi') NOT NULL,
    url VARCHAR(500) NOT NULL,
    summary TEXT,
    publish_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ranking_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ranking_id) REFERENCES rankings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, ranking_id)
);

-- 创建爬虫任务表
CREATE TABLE IF NOT EXISTS crawler_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    source VARCHAR(50) NOT NULL,
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    schedule VARCHAR(100) NOT NULL,
    last_run DATETIME,
    next_run DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建爬虫日志表
CREATE TABLE IF NOT EXISTS crawler_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    status ENUM('success', 'error') NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES crawler_tasks(id)
);

-- 创建系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('info', 'warning', 'error') NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户活动日志表
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入默认管理员账户（使用明文密码 'admin'）
INSERT INTO users (username, email, password, role) 
VALUES (
    'admin', 
    'admin@example.com',
    '$2a$10$rJUC9QJjhqVXDqvVu.IXGOx9bUm0aQjUvmMPEHGJQfHC8KKhL7q2W',
    'admin'
) ON DUPLICATE KEY UPDATE id=id;

-- 插入初始爬虫任务
INSERT INTO crawler_tasks (name, source, schedule) VALUES
('36氪 AI榜单', '36kr', '0 */6 * * *'),
('爱分析 AI榜单', 'analysys', '0 */6 * * *'),
('阿里云 AI榜单', 'aliyun', '0 */6 * * *'),
('少数派 AI榜单', 'sspai', '0 */6 * * *'),
('IT桔子 AI榜单', 'itjuzi', '0 */6 * * *'); 

-- 在 rankings 表中添加新字段
ALTER TABLE rankings
ADD COLUMN visits BIGINT DEFAULT 0,
ADD COLUMN growth_rate VARCHAR(50),
ADD COLUMN tags JSON,
ADD UNIQUE KEY unique_title_source (title, source); 