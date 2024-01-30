import React, { useState, useEffect } from "react";

const CountdownTimer = ({ initialTime, mode }) => {
	const [time, setTime] = useState(mode === "countdown" ? initialTime : 0);
	const [isActive, setIsActive] = useState(mode === "countup");

	useEffect(() => {
		if (mode !== "countup") {
			setIsActive(false); // Stop the timer if the mode is not countup
		} else {
			setIsActive(true); // Start the timer if the mode is countup
		}
	}, [mode]);

	useEffect(() => {
		let interval;
		if (isActive) {
			interval = setInterval(() => {
				setTime((currentTime) => {
					if (mode === "countdown") {
						return currentTime - 1;
					} else {
						// countup mode
						return currentTime + 1;
					}
				});
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [isActive, mode]);

	useEffect(() => {
		if (mode === "countdown" && time === 0) {
			alert("Time is up!");
		}
	}, [time, mode]);

	return <div>Time: {time} seconds</div>;
};

export default CountdownTimer;
