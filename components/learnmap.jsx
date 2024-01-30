import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dane from "../dane/dane.json";

// Importowanie ikon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

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

const losujPozycje = (obiekt) => {
	const klucze = Object.keys(obiekt);
	const losoweKlucze = klucze.sort(() => 0.5 - Math.random()).slice(0, 10);
	return losoweKlucze.map((klucz) => obiekt[klucz]);
};

const LearnMap = () => {
	const [losoweMorza, setLosoweMorza] = useState([]);
	const [losoweJeziora, setLosoweJeziora] = useState([]);
	const [losoweRzeki, setLosoweRzeki] = useState([]);

	useEffect(() => {
		setLosoweMorza(losujPozycje(dane.morza));
		setLosoweJeziora(losujPozycje(dane.jeziora));
		setLosoweRzeki(losujPozycje(dane.rzeki));
	}, []);

	const markerRefs = useRef(new Map());

	const handleListItemClick = (latitude, longitude) => {
		const marker = markerRefs.current.get(`${latitude},${longitude}`);
		if (marker) {
			marker.openPopup();
		}
	};

	const createMarkers = (data) => {
		return data.map((item, index) => {
			const position = [item.koordynaty.latitude, item.koordynaty.longitude];
			return (
				<Marker
					key={index}
					position={position}
					icon={customIcon}
					ref={(ref) => {
						markerRefs.current.set(`${position[0]},${position[1]}`, ref);
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
				{data.map((item, index) => (
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
			<p>Learnmap</p>
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
				>
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution='© OpenStreetMap contributors'
					/>
					{createMarkers(losoweMorza)}
					{createMarkers(losoweJeziora)}
					{createMarkers(losoweRzeki)}
				</MapContainer>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					padding: "20px",
				}}
			>
				{renderList(losoweMorza, "Morza")}
				{renderList(losoweJeziora, "Jeziora")}
				{renderList(losoweRzeki, "Rzeki")}
			</div>
		</>
	);
};

export default LearnMap;
