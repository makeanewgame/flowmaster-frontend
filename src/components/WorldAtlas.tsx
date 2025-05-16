import { Map, TileLayer } from "react-leaflet";
import MarkerCluster from "./Cluster";

const mapStyle = { height: "500px" };

interface DataItem {
  latitude: string;
  longitude: string;
  ip: string;
  city: string;
  country: string;
}

const Leaflet = ({ data }: { data: DataItem[] }) => {
  type Marker = {
    position: {
      lng: number;
      lat: number;
    };
    data: {
      ip: string;
      city: string;
      country: string;
    };
  };

  let markers: Marker[] = [];

  const addMarkers = () => {
    markers = [];

    data.map((item) => {
      markers.push({
        position: {
          lng: parseFloat(item.longitude),
          lat: parseFloat(item.latitude),
        },
        data: {
          ip: item.ip,
          city: item.city,
          country: item.country,
        },
      });
    });
  };

  addMarkers();

  const centerPosition = { lng: 39.0, lat: 35.0 }; // TR merkez gibi

  return (
    <>
      <Map center={centerPosition} zoom={2} style={mapStyle} maxZoom={16}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerCluster markers={markers} addMarkers={addMarkers} />
      </Map>
    </>
  );
};

export default Leaflet;
