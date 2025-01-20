"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Geolocation 지원 여부 확인
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({ lat: 37.5665, lng: 126.978 }); // 기본 위치(서울) 설정
      return;
    }

    // 사용자 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
        setUserLocation({ lat: 37.5665, lng: 126.978 }); // 기본 위치(서울) 설정
      }
    );
  }, []);

  useEffect(() => {
    // Axios로 API 데이터 가져오기
    const fetchPlaces = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/place/list`, {
          key: "value", // 필요 시 요청 본문 추가
        });

        console.log(response.data);

        setPlaces(response.data); // 데이터 저장
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    if (!userLocation) return; // 사용자 위치가 없으면 실행하지 않음

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=47bcac0516ed57ecce30dfe560fad4dd&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      setIsMapLoaded(true); // 스크립트 로드 완료 상태 업데이트
    };

    document.head.appendChild(script);
  }, [userLocation]);

  useEffect(() => {
    if (!isMapLoaded || places.length === 0) return;

    kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5, // 기본 줌 레벨
      };
      const map = new kakao.maps.Map(container, options);

      // 마커 비동기 렌더링
      places.forEach((place) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(place.addr, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            const marker = new kakao.maps.Marker({
              map: map,
              position: coords,
            });

            const infowindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${place.name}</div>`,
            });

            kakao.maps.event.addListener(marker, "mouseover", () =>
              infowindow.open(map, marker)
            );
            kakao.maps.event.addListener(marker, "mouseout", () =>
              infowindow.close()
            );
          }
        });
      });
    });
  }, [isMapLoaded, places]);

  return (
    <div>
      <h1>지도</h1>
      {!isMapLoaded ? (
        <div>지도 로드 중...</div> // 로딩 메시지
      ) : (
        <div
          id="map"
          style={{
            width: "100%",
            height: "calc(100vh - 100px)", // 모바일 화면 높이에 맞게 조정
          }}
        ></div>
      )}
    </div>
  );
}
