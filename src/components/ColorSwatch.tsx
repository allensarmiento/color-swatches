import {useEffect} from "react";
import {getDistinctColors} from "../apis/colorApis.ts";

const ColorSwatch = () => {
	useEffect(() => {
		console.log('calling');
		getDistinctColors('100%', '50%')
			.then((colors) => {
				console.log('colors', colors);
			})
	}, []);

	return null;
};

export default ColorSwatch;
