"use client";

import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
    // 카카오 지도 API 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=47bcac0516ed57ecce30dfe560fad4dd&autoload=false`;
    script.async = true;

    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById("map"); // 지도를 표시할 div
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978), // 초기 좌표 (서울)
          level: 3, // 지도 레벨 (1: 확대, 10: 축소)
        };

        const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <h1>카카오 지도</h1>
      {/* 지도를 표시할 영역 설정 */}
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px",
        }}
      ></div>
    </div>
  );
}
