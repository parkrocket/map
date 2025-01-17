/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 정적 파일 생성
  trailingSlash: true, // URL에 슬래시 추가 (정적 빌드 파일 구조에 필요)
};

export default nextConfig;
