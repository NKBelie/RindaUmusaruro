import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  ThermometerSun,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { Heading, Badge } from "../../components/common/UI";
import { useApp } from "../../contexts/AppContext";
const forecast = [
  { day: "Thu", temp: 24, rain: 4 },
  { day: "Fri", temp: 22, rain: 18 },
  { day: "Sat", temp: 21, rain: 24 },
  { day: "Sun", temp: 25, rain: 2 },
  { day: "Mon", temp: 26, rain: 0 },
  { day: "Tue", temp: 24, rain: 6 },
  { day: "Wed", temp: 23, rain: 10 },
];
export default function Weather() {
  const { t, db } = useApp();
  const [location, setLocation] = useState(
    db.farms[0]?.district || "Rwamagana",
  );
  return (
    <>
      <Heading
        title={t("Weather")}
        subtitle={t("Plan a little better with the week ahead in view.")}
        action={
          <select
            aria-label="Weather location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {[
              ...new Set(["Rwamagana", ...db.farms.map((f) => f.district)]),
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        }
      />
      <div className="notice amber">
        <CloudSun />
        <p>
          <strong>Sample weather data.</strong> These illustrative conditions
          are the same for all locations. Check a reliable local forecast before
          making farming decisions.
        </p>
      </div>
      <section className="weather-hero">
        <div>
          <Badge tone="neutral">{location} · Sample conditions</Badge>
          <h2>Make room for a little rain.</h2>
          <p>
            Partly cloudy today, with a wetter weekend in this demonstration.
          </p>
          <div className="row">
            <strong className="big-temperature">24°</strong>
            <CloudSun size={85} />
          </div>
        </div>
        <div className="weather-details">
          <div>
            <Droplets />
            Humidity<strong>72%</strong>
          </div>
          <div>
            <Wind />
            Wind speed<strong>8 km/h</strong>
          </div>
          <div>
            <ThermometerSun />
            Feels like<strong>25°C</strong>
          </div>
        </div>
      </section>
      <section className="panel padded spaced">
        <h2>{t("Your seven-day outlook")}</h2>
        <div className="forecast-grid">
          {forecast.map((d) => (
            <div key={d.day}>
              <strong>{d.day}</strong>
              {d.rain > 10 ? <CloudRain /> : d.rain ? <CloudSun /> : <Sun />}
              <b>{d.temp}°</b>
              <span>{d.rain} mm</span>
            </div>
          ))}
        </div>
      </section>
      <div className="two-columns spaced">
        <section className="panel padded">
          <h2>{t("Rainfall outlook")}</h2>
          <p className="muted">Sample rainfall in millimeters</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={forecast}>
              <CartesianGrid vertical={false} stroke="#edf0eb" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis
                unit=" mm"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="rain" fill="#74a988" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="panel padded">
          <h2>Practical steps for this outlook</h2>
          {[
            "Prepare drainage before heavier rain.",
            "Monitor soil moisture before watering.",
            "Consider delaying planting if the local forecast is unfavorable.",
            "Check crops and field access after severe weather.",
          ].map((s, i) => (
            <div className="list-row" key={s}>
              <span className="step-number">0{i + 1}</span>
              <p>{s}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
