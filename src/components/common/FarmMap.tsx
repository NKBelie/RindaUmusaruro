import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Farm } from "../../types";
const coords: Record<string, [number, number]> = {
  Rwamagana: [-1.948, 30.434],
  Musanze: [-1.5, 29.635],
  Kayonza: [-1.94, 30.548],
  Huye: [-2.596, 29.739],
  Rubavu: [-1.679, 29.266],
  Gasabo: [-1.9, 30.1],
};
export default function FarmMap({ farms }: { farms: Farm[] }) {
  return (
    <>
      <p className="notice amber">
        Sample district centers, not actual field boundaries. Online map tiles
        require internet access.
      </p>
      <MapContainer
        center={[-1.95, 29.95]}
        zoom={8}
        style={{ height: 420, width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {farms.map((f) => (
          <CircleMarker
            key={f.id}
            center={coords[f.district] || [-1.95, 30.06]}
            radius={10}
            pathOptions={{
              color: "#166534",
              fillColor: "#6fa06e",
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <strong>{f.name}</strong>
              <br />
              {f.crop} · {f.area} ha
              <br />
              {f.district} · Sample district center
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </>
  );
}
