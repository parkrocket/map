module.exports = {
  apps: [
    {
      name: "backend",
      script: "./app.js",
      instances: 1, // 단일 인스턴스
      autorestart: true, // 프로세스 실패 시 자동 재시작
      watch: false, // 코드 변경 시 자동 재시작 (배포 시 비활성화 권장)
      max_memory_restart: "300M", // 메모리 초과 시 재시작
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
