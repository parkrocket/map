"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({ lat: 37.5665, lng: 126.978 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
        setUserLocation({ lat: 37.5665, lng: 126.978 });
      }
    );
  }, []);

  // axios로 장소 데이터 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/place/list`, {
          key: "value",
        });

        console.log(response.data);

        setPlaces(response.data);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      }
    };

    fetchPlaces();
  }, []);

  // Kakao 지도 스크립트 로드
  useEffect(() => {
    if (!userLocation) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=47bcac0516ed57ecce30dfe560fad4dd&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      setIsMapLoaded(true);
    };

    document.head.appendChild(script);
  }, [userLocation]);

  // 지도와 마커 설정
  useEffect(() => {
    if (!isMapLoaded || !userLocation) return;

    kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      };
      const map = new kakao.maps.Map(container, options);

      setMapInstance(map);

      // 내 위치 표시 (기존 둥근 📍 스타일 유지)
      const currentLocationOverlay = `
        <div style="
          background-color: #007BFF; 
          border: 2px solid #007BFF; 
          border-radius: 50%; 
          width: 25px; 
          height: 25px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
          <span style="color: white; font-weight: bold;">📍</span>
        </div>
      `;

      new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        content: currentLocationOverlay,
        map: map,
        zIndex: 10,
      });

      // axios로 가져온 데이터의 마커 추가 (말풍선 모양)
      places.forEach((place) => {
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(place.addr, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 말풍선 모양의 커스텀 오버레이
            const customOverlayContent = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="
                background-color: white; 
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 5px 10px;
                font-size: 12px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              ">
                <div style="color: red; font-weight: bold;">${place.name}</div>
                <div style="color: gray; margin-top: 5px;">${place.trophy_company}</div>
              </div>
              <div style="
                position: relative;
                width: 0; 
                height: 0; 
                border-left: 10px solid transparent; 
                border-right: 10px solid transparent; 
                border-top: 10px solid #ccc; /* 바깥 테두리 */
              ">
                <div style="
                  position: absolute;
                  top: -12px; /* 테두리 두께 보정 */
                  left: -10px;
                  width: 0; 
                  height: 0; 
                  border-left: 10px solid transparent; 
                  border-right: 10px solid transparent; 
                  border-top: 10px solid #fff; /* 안쪽 색상 */
                "></div>
              </div>
            </div>
            `;

            new kakao.maps.CustomOverlay({
              position: coords,
              content: customOverlayContent,
              map: map,
              yAnchor: 1.5, // 말풍선의 꼭지점이 위치를 가리킴
            });
          }
        });
      });
    });
  }, [isMapLoaded, userLocation, places]);

  // 현재 위치로 이동
  const focusOnUserLocation = () => {
    if (mapInstance && userLocation) {
      const moveLatLon = new kakao.maps.LatLng(
        userLocation.lat,
        userLocation.lng
      );
      mapInstance.setCenter(moveLatLon);
    }
  };

  return (
    <div>
      <h1>지도</h1>
      <button
        onClick={focusOnUserLocation}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        현재 위치로 이동
      </button>
      {!isMapLoaded ? (
        <div>지도 로드 중...</div>
      ) : (
        <div
          id="map"
          style={{
            width: "100%",
            height: "calc(100vh - 100px)",
          }}
        ></div>
      )}
    </div>
  );
}
