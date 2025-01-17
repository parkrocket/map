module.exports = {
  apps: [
    {
      name: "frontend-app",
      script: "npm",
      args: "start",
      cwd: "/home/ubuntu/frontend", // 작업 디렉토리
      interpreter: "none",
      env: {
        NODE_ENV: "production", // Next.js 환경
      },
    },
  ],
};
