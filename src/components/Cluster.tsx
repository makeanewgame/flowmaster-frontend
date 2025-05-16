import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useLeaflet } from "react-leaflet";

// Marker tipi güncellendi
interface Marker {
  position: {
    lat: number;
    lng: number;
  };
  data: {
    ip: string;
    city: string;
    country: string;
  };
}

interface MarkerClusterProps {
  markers: Marker[];
  addMarkers: () => void;
}

const markerClusters = L.markerClusterGroup();

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MarkerCluster = ({ markers, addMarkers }: MarkerClusterProps) => {
  const { map } = useLeaflet();

  useEffect(() => {
    markerClusters.clearLayers();

    markers.forEach(({ position, data }) => {
      const marker = L.marker([position.lat, position.lng], {
        icon: customIcon,
      });

      const popupContent = `
        <div>
          <strong>IP:</strong> ${data.ip} <br />
          <strong>City:</strong> ${data.city} <br />
          <strong>Country:</strong> ${data.country}
        </div>
      `;

      marker.bindPopup(popupContent);

      // Hover etkisi ekle (isteğe bağlı)
      marker.on("mouseover", function (this: L.Marker) {
        this.openPopup();
      });
      marker.on("mouseout", function (this: L.Marker) {
        this.closePopup();
      });

      markerClusters.addLayer(marker);
    });

    if (map) {
      map.addLayer(markerClusters);
    }
  }, [markers, map]);

  useEffect(() => {
    if (!map) return;

    const onMoveEnd = () => {
      const start = window.performance.now();
      addMarkers();

      const updatedMarkers: L.Marker[] = [];
      markerClusters.clearLayers();

      markers.forEach(({ position, data }) => {
        const marker = L.marker([position.lat, position.lng], {
          icon: customIcon,
        });

        const popupContent = `
          <div>
            <strong>IP:</strong> ${data.ip} <br />
            <strong>City:</strong> ${data.city} <br />
            <strong>Country:</strong> ${data.country}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("mouseover", () => {
          marker.openPopup();
        });
        marker.on("mouseout", () => {
          marker.closePopup();
        });

        updatedMarkers.push(marker);
      });

      markerClusters.addLayers(updatedMarkers);

      const end = window.performance.now();
      console.log(`Cluster güncellendi (${end - start}ms)`);
    };

    map.on("moveend", onMoveEnd);

    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [map, markers]);

  return null;
};

export default MarkerCluster;
