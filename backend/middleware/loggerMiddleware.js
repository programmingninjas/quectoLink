const winston = require('winston');

// Object to store request counts and total response time for each method
const methodStats = {
    GET: { count: 0, totalTime: 0 },
    POST: { count: 0, totalTime: 0 }
};

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' })
    ]
});

// Middleware function to log response time and calculate average time
const loggerMiddleware = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const duration = process.hrtime(start);
        const responseTimeInMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);

        // Update methodStats object based on request method
        if (req.method === 'GET' || req.method === 'POST') {
            methodStats[req.method].count++;
            methodStats[req.method].totalTime += parseFloat(responseTimeInMs);
        }
        
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${responseTimeInMs}ms`);
    });

    next();
};

// Function to log average response time to console every minute
const logAvgResponseTime = () => {
    const avgResponseTime = {
        GET: methodStats.GET.count === 0 ? 0 : (methodStats.GET.totalTime / methodStats.GET.count).toFixed(2),
        POST: methodStats.POST.count === 0 ? 0 : (methodStats.POST.totalTime / methodStats.POST.count).toFixed(2)
    };

    logger.info(`Average Response Time for GET Requests: ${avgResponseTime.GET}ms Requests: ${methodStats.GET.count}`);
    logger.info(`Average Response Time for POST Requests: ${avgResponseTime.POST}ms Requests: ${methodStats.POST.count}`);
};

// Log average response time to console every minute
setInterval(logAvgResponseTime, 60000);

module.exports = {loggerMiddleware};
