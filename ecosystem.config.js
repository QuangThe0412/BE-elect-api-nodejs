module.exports = {
    apps: [
        {
            name: 'smart-shop-api',
            script: 'index.js', // Tệp chính để chạy ứng dụng
            instances: 1, // Số lượng instances (max sẽ sử dụng tất cả các CPU có sẵn)
            exec_mode: 'fork', // Chế độ chạy (cluster hoặc fork)
            watch: true, // Theo dõi các thay đổi trong tệp để tự động khởi động lại
            env: {
                NODE_ENV: 'development',
                PORT: 3002,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3002,
                DB_HOST: '192.168.9.174',
                DB_PORT: '1433',
                DB_USER: 'sa',
                DB_PASSWORD: 'quangthe0412',
                DB_NAME: 'SmartShop_production',
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z', // Định dạng ngày giờ cho nhật ký
            error_file: './logs/err.log', // Tệp lưu lỗi
            out_file: './logs/out.log', // Tệp lưu đầu ra
            merge_logs: true, // Gộp nhật ký từ tất cả các instances
            max_memory_restart: '1G', // Khởi động lại ứng dụng nếu sử dụng quá 1GB RAM
        },
    ],
};