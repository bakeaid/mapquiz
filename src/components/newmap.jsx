import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dane from "../dane/dane.json";

// Importowanie ikon
import iconUrl from "../assets/marker-icon.png";
import iconRetinaUrl from "../assets/marker-icon-2x.png";
import iconShadowUrl from "../assets/marker-shadow.png";

// Definiowanie niestandardowej ikony
const customIcon = L.icon({
	iconUrl,
	iconRetinaUrl,
	shadowUrl: iconShadowUrl,
	iconSize: [25, 41], // rozmiar ikony
	iconAnchor: [12, 41], // punkt, w którym ikona jest zakotwiczona
	popupAnchor: [1, -34], // punkt, z którego wyskakujące okienko 'popup' będzie się rozwijać
	shadowSize: [41, 41], // rozmiar cienia
});

const NewMap = () => {
	const [, setMapInstance] = useState(null);
	const [markersMap] = useState(new Map());
	const handleListItemClick = (latitude, longitude) => {
		const marker = markersMap.get(`${latitude},${longitude}`);
		if (marker) {
			marker.openPopup();
		}
	};

	const createMarkers = (data) => {
		return Object.values(data).map((item, index) => {
			const position = [item.koordynaty.latitude, item.koordynaty.longitude];

			return (
				<Marker
					key={index}
					position={position}
					icon={customIcon}
					ref={(ref) => {
						if (ref) {
							markersMap.set(`${position[0]},${position[1]}`, ref);
						}
					}}
				>
					<Popup>{item.nazwa}</Popup>
				</Marker>
			);
		});
	};

	const renderList = (data, categoryTitle) => (
		<div style={{ textAlign: "left" }}>
			<h3>{categoryTitle}</h3>
			<ul style={{ listStyleType: "none", padding: 0 }}>
				{Object.values(data).map((item, index) => (
					<li
						key={index}
						onClick={() =>
							handleListItemClick(
								item.koordynaty.latitude,
								item.koordynaty.longitude
							)
						}
						style={{ cursor: "pointer" }}
					>
						{index + 1}. {item.nazwa}
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
			>
				<MapContainer
					center={[20, 0]}
					zoom={2}
					style={{ height: "600px", width: "90%" }}
					whenCreated={setMapInstance}
				>
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution='© OpenStreetMap contributors'
					/>
					{createMarkers(dane.morza)}
					{createMarkers(dane.jeziora)}
					{createMarkers(dane.rzeki)}
				</MapContainer>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					padding: "20px",
				}}
			>
				{renderList(dane.morza, "Morza")}
				{renderList(dane.jeziora, "Jeziora")}
				{renderList(dane.rzeki, "Rzeki")}
			</div>
		</>
	);
};

export default NewMap;
