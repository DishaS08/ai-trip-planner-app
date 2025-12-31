"use client";
import React, { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTripDetail } from "@/app/provider";
import { Activity } from "./ChatBox";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_CLOUD_API_KEY;
// const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`;


function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const { tripDetailInfo, selectedLocation } = useTripDetail();

  const [mapError, setMapError] = React.useState<string | null>(null);

  // 🗺️ Initialize the map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    // Prevent double initialization which is common in React Strict Mode
    if (mapRef.current) return;

    let mapInstance: MapLibreMap | null = null;

    try {
      mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        // Use CartoDB Voyager Tiles (Better Labels, No Key Required)
        style: {
          version: 8,
          sources: {
            carto: {
              type: 'raster',
              tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap &copy; CARTO',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'carto',
              type: 'raster',
              source: 'carto'
            }
          ]
        },
        center: [20, 20], // World center
        zoom: 0.8,
        minZoom: 0.5,
        maxZoom: 18,
      });

      mapRef.current = mapInstance;

      mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

      // Resize map when container size changes
      mapInstance.on('load', () => {
        setTimeout(() => {
          mapInstance?.resize();
        }, 100);
      });

    } catch (error: any) {
      console.error("Error initializing map:", error);
      setMapError(error.message || "Failed to load map");
    }

    // Handle window resize
    const handleResize = () => {
      if (mapRef.current) { // Use ref here to be sure
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // 🧹 Cleanup map on unmount
      if (mapInstance) {
        mapInstance.remove();
        // Only nullify ref if it matches our instance (safety check)
        if (mapRef.current === mapInstance) {
          mapRef.current = null;
        }
      }
    };
  }, []);

  // 🖱️ Fly to Selected Location
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 15, // Closer zoom for specific place
        essential: true,
        pitch: 50, // Nice 3D effect
      });
    }
  }, [selectedLocation]);




  // 📍 Update markers when tripDetailInfo changes
  useEffect(() => {
    if (!mapRef.current || !tripDetailInfo?.itinerary) return;

    const map = mapRef.current; // access ref safely

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
            .addTo(map);

          markers.current.push(marker);

          // Optional: zoom to the latest marker
          map.flyTo({
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
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}

export default GlobalMap;
