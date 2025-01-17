const db = require("../config/db"); // MySQL 연결 설정 파일

const Place = {
  // 모든 장소 데이터를 가져오는 함수
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM place");
      return rows; // 데이터를 Promise로 반환
    } catch (error) {
      console.error("Error fetching places:", error);
      throw error; // 에러를 호출한 쪽으로 전달
    }
  },

  // 특정 조건으로 조회하는 함수 예시
  getByDate: async (date) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM place WHERE DATE(datetime) = ?",
        [date]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching places by date:", error);
      throw error;
    }
  },
};

module.exports = Place;
