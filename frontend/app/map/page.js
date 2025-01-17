"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MapPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Axios로 API 데이터 가져오기
    const fetchPlaces = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/place/list`, {
          key: "value", // 필요 시 요청 본문 추가!!
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
    if (places.length === 0) return; // 데이터가 없으면 실행하지 않음

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=47bcac0516ed57ecce30dfe560fad4dd&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        };
        const map = new kakao.maps.Map(container, options);

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
    };

    document.head.appendChild(script);
  }, [places]);
  return (
    <div>
      <h1>지도</h1>
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
