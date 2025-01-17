const mysql = require("mysql2/promise");

// 환경 변수로 민감한 정보 관리
require("dotenv").config();

console.log(process.env.DB_USER);

const dbConfig = {
  host: process.env.DB_HOST, // 예: 13.124.3.73
  user: process.env.DB_USER, // 예: madmin
  password: process.env.DB_PASSWORD, // 예: 4523105a!
  database: process.env.DB_NAME, // 예: map
  waitForConnections: true, // 연결 요청이 많을 경우 대기
  connectionLimit: 10, // 최대 연결 수 제한
};

const pool = mysql.createPool(dbConfig);

// 연결 확인 함수
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL successfully!");
    connection.release(); // 연결 반환
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
}

testConnection();

module.exports = pool;
