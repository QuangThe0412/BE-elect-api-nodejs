module.exports = {
    apps: [
        {
            name: 'smart-shop-api',
            script: 'index.js',
            instances: 1,
            exec_mode: 'fork',
            watch: true,
            env: {
                NODE_ENV: 'production',
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            merge_logs: true,
            max_memory_restart: '1G',
        },
    ],
};