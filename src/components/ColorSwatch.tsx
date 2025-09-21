import {useEffect, useState} from "react";
import {getDistinctColors, getDistinctColorsBinarySearch} from "../apis/colorApis.ts";
import type {Color} from "../types/color.ts";

const ColorSwatch = () => {
	const [colors, setColors] = useState<Color[]>([])

	useEffect(() => {
		console.log('calling');
		const s = '40%';
		const l = '87%';
		// getDistinctColors(s, l)
		// 	.then((colors) => {
		// 		console.log('colors', colors);
		// 		setColors(colors);
		// 	})
		getDistinctColorsBinarySearch(s, l)
			.then((colors) => {
				console.log('colors', colors);
				setColors(colors);
			})
	}, []);

	return (
		<div>
			{colors.map((color: Color) => (
				<div>
					{color.name.value}
				</div>
			))}
		</div>
	);
};

export default ColorSwatch;
