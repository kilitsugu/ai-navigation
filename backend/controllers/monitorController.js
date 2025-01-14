const db = require('../config/database');
const os = require('os');
const process = require('process');

const monitorController = {
    // 获取系统状态
    async getSystemStatus(req, res) {
        try {
            const uptime = process.uptime();
            const cpuUsage = await getCPUUsage();
            const memoryUsage = getMemoryUsage();
            const status = calculateSystemStatus(cpuUsage, memoryUsage);

            res.json({
                status,
                uptime,
                cpuUsage,
                memoryUsage
            });
        } catch (error) {
            console.error('获取系统状态失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取统计数据
    async getStatistics(req, res) {
        try {
            // 获取总榜单数
            const [totalRankings] = await db.execute('SELECT COUNT(*) as count FROM rankings');
            
            // 获取今日新增榜单数
            const [todayRankings] = await db.execute(`
                SELECT COUNT(*) as count FROM rankings 
                WHERE DATE(created_at) = CURDATE()
            `);

            // 获取用户数量
            const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');

            // 获取近7天的榜单趋势
            const [rankingsTrend] = await db.execute(`
                SELECT DATE(created_at) as date, COUNT(*) as count 
                FROM rankings 
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date
            `);

            // 获取近7天的用户活跃度
            const [userActivity] = await db.execute(`
                SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as count 
                FROM user_activity_logs
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date
            `);

            res.json({
                totalRankings: totalRankings[0].count,
                todayRankings: todayRankings[0].count,
                totalUsers: totalUsers[0].count,
                rankingsTrend,
                userActivity
            });
        } catch (error) {
            console.error('获取统计数据失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取爬虫状态
    async getCrawlerStatus(req, res) {
        try {
            const [crawlers] = await db.execute(`
                SELECT 
                    id,
                    name,
                    source,
                    status,
                    last_run,
                    next_run,
                    (
                        SELECT COUNT(*) 
                        FROM crawler_logs 
                        WHERE task_id = crawler_tasks.id 
                        AND status = 'error'
                        AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                    ) as error_count
                FROM crawler_tasks
            `);

            res.json({ data: crawlers });
        } catch (error) {
            console.error('获取爬虫状态失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    },

    // 获取系统日志
    async getSystemLogs(req, res) {
        try {
            const [logs] = await db.execute(`
                SELECT * FROM (
                    SELECT 
                        'crawler' as type,
                        created_at as time,
                        CONCAT(
                            (SELECT name FROM crawler_tasks WHERE id = task_id),
                            ': ',
                            message
                        ) as message
                    FROM crawler_logs
                    UNION ALL
                    SELECT 
                        'system' as type,
                        created_at as time,
                        message
                    FROM system_logs
                    UNION ALL
                    SELECT 
                        'user' as type,
                        created_at as time,
                        CONCAT(
                            (SELECT username FROM users WHERE id = user_id),
                            ' ',
                            action
                        ) as message
                    FROM user_activity_logs
                ) as combined_logs
                ORDER BY time DESC
                LIMIT 100
            `);

            res.json({ data: logs });
        } catch (error) {
            console.error('获取系统日志失败:', error);
            res.status(500).json({ message: '服务器错误' });
        }
    }
};

// 获取CPU使用率
async function getCPUUsage() {
    const startMeasure = cpuAverage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endMeasure = cpuAverage();

    const idleDifference = endMeasure.idle - startMeasure.idle;
    const totalDifference = endMeasure.total - startMeasure.total;
    const cpuUsage = 100 - Math.floor(100 * idleDifference / totalDifference);

    return cpuUsage;
}

// 获取CPU平均使用情况
function cpuAverage() {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            totalMs += cpu.times[type];
        }
        idleMs += cpu.times.idle;
    });

    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    };
}

// 获取内存使用率
function getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return Math.floor((totalMemory - freeMemory) / totalMemory * 100);
}

// 计算系统整体状态
function calculateSystemStatus(cpuUsage, memoryUsage) {
    if (cpuUsage >= 90 || memoryUsage >= 90) {
        return 'error';
    }
    if (cpuUsage >= 70 || memoryUsage >= 70) {
        return 'warning';
    }
    return 'success';
}

module.exports = monitorController; 