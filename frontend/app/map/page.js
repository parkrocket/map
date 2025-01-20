"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

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

  useEffect(() => {
    if (!isMapLoaded || places.length === 0) return;

    kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      };
      const map = new kakao.maps.Map(container, options);

      setMapInstance(map);

      // 현재 위치에 커스텀 오버레이 추가
      const customOverlayContent = `
        <div style="
          background-color: #007BFF; 
          border: 2px solid #007BFF; 
          border-radius: 50%; 
          width: 25px; 
          height: 25px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        ">
          <span style="color: #007BFF; font-weight: bold;">📍</span>
        </div>
      `;

      new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        content: customOverlayContent,
        map: map,
        zIndex: 10,
      });

      // 장소 데이터로 마커 표시
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
