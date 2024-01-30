import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dane from "../dane/dane.json";

// Importowanie ikon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import redIconUrl from "../assets/marker-icon-red.png"; // Update this path
import redIconRetinaUrl from "../assets/marker-icon-2x-red.png"; // Update this path

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
const redIcon = L.icon({
	iconUrl: redIconUrl,
	iconRetinaUrl: redIconRetinaUrl,
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

const QuizMap = () => {
	const [losoweMorza, setLosoweMorza] = useState([]);
	const [losoweJeziora, setLosoweJeziora] = useState([]);
	const [losoweRzeki, setLosoweRzeki] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const markerRefs = useRef(new Map());
	const [wrongCount, setWrongCount] = useState(0);

	useEffect(() => {
		setLosoweMorza(losujPozycje(dane.morza));
		setLosoweJeziora(losujPozycje(dane.jeziora));
		setLosoweRzeki(losujPozycje(dane.rzeki));
	}, []);

	const [selectedMarkers, setSelectedMarkers] = useState(new Map());

	const handleDropdownChange = (itemName, markerId) => {
		setSelectedItems((prevSelectedItems) => {
			const newSelectedItems = [...prevSelectedItems];
			if (!newSelectedItems.includes(itemName)) {
				newSelectedItems.push(itemName);
			}
			return newSelectedItems;
		});
		setSelectedMarkers((prevSelectedMarkers) =>
			new Map(prevSelectedMarkers).set(markerId, itemName)
		);
	};

	const createDropdownList = (markerId) => {
		if (selectedMarkers.has(markerId)) {
			return null;
		}

		const sortedItems = allSelectedItems
			.filter((item) => !selectedItems.includes(item.nazwa))
			.sort((a, b) => a.nazwa.localeCompare(b.nazwa)); // Sortowanie alfabetycznie

		return (
			<select onChange={(e) => handleDropdownChange(e.target.value, markerId)}>
				<option value=''>Wybierz...</option>
				{sortedItems.map((listItem, index) => (
					<option key={index} value={listItem.nazwa}>
						{listItem.nazwa}
					</option>
				))}
			</select>
		);
	};

	const createMarkers = (data, category) => {
		return Object.entries(data).map(([key, item], index) => {
			const position = [item.koordynaty.latitude, item.koordynaty.longitude];
			const markerId = `${category}-${index}`; // Example: "morza-0"

			return (
				<Marker
					key={markerId}
					position={position}
					icon={customIcon}
					ref={(ref) => {
						if (ref) {
							markerRefs.current.set(markerId, ref);

							// If this marker has been selected, add a tooltip
							if (selectedMarkers.has(markerId)) {
								const selectedItemName = selectedMarkers.get(markerId);
								ref
									.bindTooltip(selectedItemName, {
										permanent: true,
										direction: "top",
									})
									.openTooltip();
							}
						}
					}}
				>
					{!selectedMarkers.has(markerId) && (
						<Popup>{createDropdownList(markerId)}</Popup>
					)}
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
						style={{
							cursor: "pointer",
							textDecoration: selectedItems.includes(item.nazwa)
								? "line-through"
								: "none",
						}}
					>
						{index + 1}. {item.nazwa}
					</li>
				))}
			</ul>
		</div>
	);
	const handleCheckButtonClick = () => {
		let count = 0;
		let resetMarkers = new Map(selectedMarkers);
		let itemsToRemove = [];

		selectedMarkers.forEach((selectedName, markerId) => {
			const markerRef = markerRefs.current.get(markerId);
			if (!markerRef) return;

			const { lat, lng } = markerRef.getLatLng();
			let actualItemName;

			for (let category in dane) {
				for (let key in dane[category]) {
					const item = dane[category][key];
					if (
						item.koordynaty.latitude === lat &&
						item.koordynaty.longitude === lng
					) {
						actualItemName = item.nazwa;
						break;
					}
				}
				if (actualItemName) break;
			}

			if (actualItemName && selectedName !== actualItemName) {
				markerRef.setIcon(redIcon);
				count++;
				resetMarkers.delete(markerId);
				itemsToRemove.push(selectedName);

				// Reset the icon back to the original and close the tooltip after a delay
				setTimeout(() => {
					if (markerRefs.current.get(markerId)) {
						const ref = markerRefs.current.get(markerId);
						ref.setIcon(customIcon);
						ref.closeTooltip();
					}
				}, 3000);
			} else if (markerRef) {
				markerRef.setIcon(customIcon);
			}
		});

		setWrongCount((prevWrongCount) => prevWrongCount + count);

		// Update selectedItems and selectedMarkers
		setSelectedItems((prevItems) =>
			prevItems.filter((item) => !itemsToRemove.includes(item))
		);
		setSelectedMarkers(resetMarkers);
	};

	// Combine all items into one array for the dropdown
	const allSelectedItems = [...losoweMorza, ...losoweJeziora, ...losoweRzeki];

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
				>
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution='© OpenStreetMap contributors'
					/>
					{createMarkers(losoweMorza, "morza")}
					{createMarkers(losoweJeziora, "jeziora")}
					{createMarkers(losoweRzeki, "rzeki")}
				</MapContainer>
			</div>
			<button onClick={handleCheckButtonClick}>Sprawdź</button>
			<div>
				<p>Liczba błędnych odpowiedzi: {wrongCount}</p>
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
export default QuizMap;
