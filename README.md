# AI 导航网站

## 项目目标
该网站旨在收集和展示各种与 AI 相关的榜单，用户可以通过点击标题导航到相应的文章地址。

## 功能需求
1. **主页展示**：展示所有收集到的 AI 榜单的标题。
2. **导航功能**：用户可以点击标题导航到榜单的详细页面。
3. **数据收集**：使用爬虫技术自动收集最新的 AI 榜单数据。
4. **用户系统**：
   - 用户注册和登录功能
   - 管理员后台管理系统
   - 用户收藏功能
5. **数据更新**：每日自动更新榜单数据

## 数据来源
### 英文数据源
- ProductHunt AI 分类
- G2.com AI 软件评测
- AlternativeTo AI 类别
- Gartner AI 评测

### 中文数据源
- **爱分析** (https://www.analysys.cn/)
  - 专业的科技产品分析平台
  - 定期发布 AI 领域研究报告和榜单
  
- **36氪** (https://36kr.com/topics/1699952222017)
  - AI 相关新闻和榜单
  - 经常发布各类 AI 产品测评和排名
  
- **阿里云开发者社区** (https://developer.aliyun.com/topic/ai)
  - AI 工具和应用排行
  - 专业的技术评测
  
- **少数派** (https://sspai.com/tag/AI)
  - 高质量的 AI 工具评测
  - 定期更新各类 AI 应用榜单
  
- **IT桔子** (https://www.itjuzi.com/)
  - AI 创业公司和产品数据库
  - 包含融资信息和市场表现
  
- **镝数聚** (https://www.dydata.io/)
  - AI 数据分析平台
  - 提供各类 AI 产品排名和分析报告

## 页面布局
1. **主页**：
   - 简洁的列表布局，展示所有榜单的标题
   - 用户登录/注册入口
   - 榜单分类筛选
2. **用户中心**：
   - 个人信息管理
   - 收藏榜单管理
3. **管理后台**：
   - 用户管理
   - 榜单数据管理
   - 爬虫任务管理

## UI 风格
- 参考苹果的设计风格，简洁、专业
- 使用响应式设计，确保在不同设备上都能良好显示
- 采用浅色主题，突出内容

## 技术栈
- 前端：HTML5、CSS3、JavaScript
- 后端：Node.js/Python（用于爬虫和数据处理）
- 数据库：MySQL（存储用户数据和榜单数据）
- SEO优化：
  - 合理的 HTML 语义化标签
  - 针对搜索引擎的 meta 标签优化
  - sitemap.xml 生成
  - robots.txt 配置

## 开发步骤
1. 设计并实现用户系统（包括管理员账户）
2. 设计主页的 HTML 和 CSS 结构
3. 实现爬虫功能，收集榜单数据
4. 实现数据自动更新功能
5. 开发用户中心功能
6. 开发管理后台功能
7. SEO 优化
8. UI 优化和测试

## 管理员账户信息
- 账号：admin
- 密码：admin 

## 数据库设计
### 用户表(users)
- id: int (主键)
- username: varchar(50) (用户名)
- password: varchar(255) (加密后的密码)
- email: varchar(100) (邮箱)
- role: enum('user','admin') (用户角色)
- created_at: timestamp
- updated_at: timestamp

### 榜单表(rankings)
- id: int (主键)
- title: varchar(255) (标题)
- source: enum('36kr','analysys','aliyun','sspai','itjuzi') (来源网站)
- url: varchar(500) (原文链接)
- summary: text (摘要)
- publish_date: date (发布日期)
- category: varchar(50) (分类，如'软件'、'应用'、'研究'等)
- created_at: timestamp
- updated_at: timestamp

### 用户收藏表(favorites)
- id: int (主键)
- user_id: int (外键关联users表)
- ranking_id: int (外键关联rankings表)
- created_at: timestamp

## 爬虫模块设计
### 36氪爬虫
- 目标URL: https://36kr.com/information/AI/
- 抓取内容：AI相关新闻和榜单
- 更新频率：每日一次

### 爱分析爬虫
- 目标URL: https://www.analysys.cn/article/analysis/
- 抓取内容：AI领域研究报告和榜单
- 更新频率：每日一次

### 阿里云开发者爬虫
- 目标URL: https://developer.aliyun.com/ebook/
- 抓取内容：AI电子读物榜单
- 更新频率：每日一次

### 少数派爬虫
- 目标URL: https://sspai.com/tag/AI
- 抓取内容：AI工具评测和应用榜单
- 更新频率：每日一次

### IT桔子爬虫
- 目标URL: https://www.itjuzi.com/
- 抓取内容：AI创业公司和产品数据
- 更新频率：每日一次

## 开发优先级
1. 基础架构搭建
   - 数据库设计和实现
   - 用户系统开发
   - 管理员后台框架

2. 爬虫模块开发
   - 开发通用爬虫框架
   - 分别实现各网站的爬虫
   - 实现数据清洗和存储

3. 前端界面开发
   - 主页设计和实现
   - 用户中心开发
   - 榜单展示页面

4. 功能完善
   - 实现收藏功能
   - 添加分类筛选
   - SEO优化 