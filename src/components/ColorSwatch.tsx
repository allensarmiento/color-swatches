import {useEffect, useState} from "react";
import type {Color} from "../types/color.ts";
import {DistinctColors} from "../utils/distinct-colors.ts";
import styles from './ColorSwatch.module.css';

const ColorSwatch = () => {
	const [colors, setColors] = useState<Color[]>([])
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const s = '100%';
		const l = '50%';

		const distinctColors = new DistinctColors(s, l);
		distinctColors.linearSearch()
			.then((colors) => {
				setColors(colors);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;

	return (
		<section className={styles.page}>
			{colors.map((color: Color) => (
				<div className={styles.item}>
					<img src={color.image.bare} alt={color.name.value} />
					<span>{color.name.value}</span>
				</div>
			))}
		</section>
	);
};

export default ColorSwatch;
