module.exports = {
    apps: [
        {
            name: 'smart-shop-api',
            script: 'build/index.js', // Tệp chính để chạy ứng dụng
            instances: 'max', // Số lượng instances (max sẽ sử dụng tất cả các CPU có sẵn)
            exec_mode: 'cluster', // Chế độ chạy (cluster hoặc fork)
            watch: true, // Theo dõi các thay đổi trong tệp để tự động khởi động lại
            env: {
                NODE_ENV: 'development', // Biến môi trường cho chế độ phát triển
            },
            env_production: {
                NODE_ENV: 'production', // Biến môi trường cho chế độ sản xuất
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z', // Định dạng ngày giờ cho nhật ký
            error_file: './logs/err.log', // Tệp lưu lỗi
            out_file: './logs/out.log', // Tệp lưu đầu ra
            merge_logs: true, // Gộp nhật ký từ tất cả các instances
            max_memory_restart: '1G', // Khởi động lại ứng dụng nếu sử dụng quá 1GB RAM
        },
    ],
};