const promClient = require('prom-client');

// Initialize the metrics
const httpRequestCounter = new promClient.Counter({
    name: 'url_shortener_http_requests_total',
    help: 'Total number of HTTP requests received by the URL shortener',
    labelNames: ['method', 'path', 'status_code'],
});

const requestDurationHistogram = new promClient.Histogram({
    name: 'url_shortener_http_request_duration_seconds',
    help: 'Duration of HTTP requests to the URL shortener in seconds',
    labelNames: ['method', 'path', 'status_code'],
    buckets: [0.5, 1, 2, 5, 10, 30], // Adjusted for typical URL shortening durations
});

const requestDurationSummary = new promClient.Summary({
    name: 'url_shortener_http_request_duration_summary_seconds',
    help: 'Summary of the duration of HTTP requests to the URL shortener in seconds',
    labelNames: ['method', 'path', 'status_code'],
    percentiles: [0.5, 0.9, 0.99], // Percentiles for latency distribution
});

// Middleware function
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // Duration in seconds

        // Increment the request counter
        httpRequestCounter.inc({
            method: req.method,
            path: req.path,
            status_code: res.statusCode,
        });

        // Observe the request duration in the histogram
        requestDurationHistogram.observe({
            method: req.method,
            path: req.path,
            status_code: res.statusCode,
        }, duration);

        // Observe the request duration in the summary
        requestDurationSummary.observe({
            method: req.method,
            path: req.path,
            status_code: res.statusCode,
        }, duration);
    });

    next();
};

const metricsEndpoint = async (req, res) => {
    try {
        res.set('Content-Type', promClient.register.contentType);
        const metrics = await promClient.register.metrics(); // Await the metrics promise
        res.end(metrics); // End the response with the metrics
    } catch (error) {
        // Handle the error (optional: log it or send an error response)
        console.error('Error fetching metrics:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Export the middleware and metrics endpoint
module.exports = {
    metricsMiddleware,
    metricsEndpoint,
};