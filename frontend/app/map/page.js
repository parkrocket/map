"use client";

import { useEffect, useState } from "react";

export default function Map() {
  const [location, setLocation] = useState(null); // 현재 위치 상태 저장

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude }); // 위치 저장
          console.log("정확도 (미터):", position.coords.accuracy); // 낮을수록 정확함
        },
        (error) => {
          console.error("Geolocation Error: ", error);
        },
        {
          enableHighAccuracy: true, // 높은 정확도를 요청
          timeout: 5000, // 5초 내에 위치를 가져오지 못하면 에러 반환
          maximumAge: 0, // 이전 위치 캐시를 사용하지 않음
        }
      );
    } else {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      console.log(location);
      // 카카오 지도 API 스크립트 로드
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=47bcac0516ed57ecce30dfe560fad4dd&autoload=false`;
      script.async = true;

      script.onload = () => {
        kakao.maps.load(() => {
          const container = document.getElementById("map"); // 지도를 표시할 div
          const options = {
            center: new kakao.maps.LatLng(
              location.latitude,
              location.longitude
            ), // 현재 위치로 중심 설정
            level: 3, // 지도 확대 레벨
          };

          const map = new kakao.maps.Map(container, options); // 지도 생성

          console.log(location.latitude, location.longitude);

          // 현재 위치에 마커 추가
          const markerPosition = new kakao.maps.LatLng(
            location.latitude,
            location.longitude
          );
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map); // 지도에 마커 표시
        });
      };

      document.head.appendChild(script);
    }
  }, [location]); // location이 변경되면 지도 로드

  return (
    <div>
      <h1>현재 위치 지도</h1>
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px", // 지도의 높이 설정
        }}
      ></div>
    </div>
  );
}
