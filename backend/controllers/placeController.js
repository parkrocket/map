const Place = require("../models/placeModel");

exports.list = async (req, res) => {
  try {
    const places = await Place.getAll(); // 데이터를 비동기로 가져오기
    res.status(200).json(places); // 클라이언트에 응답 반환
  } catch (error) {
    console.error("Error fetching place list:", error);
    res.status(500).json({ error: "Failed to fetch place list" });
  }
};

exports.listByDate = async (req, res) => {
  const { date } = req.params; // URL 파라미터에서 날짜 가져오기
  try {
    const places = await Place.getByDate(date); // 날짜로 필터링된 데이터 가져오기
    res.status(200).json(places); // 클라이언트에 응답 반환
  } catch (error) {
    console.error("Error fetching places by date:", error);
    res.status(500).json({ error: "Failed to fetch places by date" });
  }
};
