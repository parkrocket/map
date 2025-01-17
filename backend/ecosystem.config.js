module.exports = {
  apps: [
    {
      name: "backend",
      script: "./app.js", // 백엔드 서버의 진입점 파일
      instances: 1, // 단일 인스턴스
      autorestart: true, // 오류 발생 시 자동 재시작
      watch: false, // 코드 변경 시 자동 재시작 비활성화
      env: {
        NODE_ENV: "development", // 개발 환경 변수
      },
      env_production: {
        NODE_ENV: "production", // 프로덕션 환경 변수
      },
    },
  ],
};
