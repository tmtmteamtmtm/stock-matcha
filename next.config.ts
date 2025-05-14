import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,   // เปิดใช้งาน Strict Mode เพื่อช่วยจับข้อผิดพลาดใน React
  output: 'standalone',    // รองรับการทำงานใน container (Railway หรือ server อื่นๆ)
};

export default nextConfig;

