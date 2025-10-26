"use client";
import React, { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTripDetail } from "@/app/provider";
import { Activity } from "./ChatBox";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_CLOUD_API_KEY;
const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`;

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  // @ts-ignore
  const { tripDetailInfo } = useTripDetail();

  // 🗺️ Initialize the map once
  useEffect(() => {
    if (!mapContainerRef.current || !MAPTILER_KEY) return;

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAPTILER_STYLE_URL,
        center: [77.209, 28.6139], // Default center (Delhi)
        zoom: 1.7,
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    }

    return () => {
      // 🧹 Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 📍 Update markers when tripDetailInfo changes
  useEffect(() => {
    if (!mapRef.current || !tripDetailInfo?.itinerary) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    tripDetailInfo.itinerary.forEach((itinerary: any) => {
      (itinerary.activities || []).forEach((activity: Activity) => {
        const lng = activity.geo_coordinates?.longitude;
        const lat = activity.geo_coordinates?.latitude;

        if (typeof lng === "number" && typeof lat === "number" && !isNaN(lng) && !isNaN(lat)) {
          const marker = new maplibregl.Marker({ color: "red" })
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setText(activity.place_name || "Unknown Place"))
            .addTo(mapRef.current!);

          markers.current.push(marker);

          // Optional: zoom to the latest marker
          mapRef.current!.flyTo({
            center: [lng, lat],
            zoom: 8,
            essential: true,
          });
        }
      });
    });
  }, [tripDetailInfo]);

  // 🖼️ Render Map container
  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "95%",
        height: "85vh",
        borderRadius: 20,
        backgroundColor: "#eee",
      }}
    />
  );
}

export default GlobalMap;
