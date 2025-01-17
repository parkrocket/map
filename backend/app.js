const express = require("express");
const cors = require("cors"); // CORS 미들웨어 불러오기
const app = express();
const port = process.env.PORT || 3001; // 포트 설정 (환경 변수 또는 기본값)
require("dotenv").config();

// JSON 요청 본문 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // CORS 미들웨어 사용

const placeRoutes = require("./routes/place");

app.use("/api/place", placeRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// API 예제 라우트
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from API!!!!!" });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
