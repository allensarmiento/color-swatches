import {type ChangeEvent, useState} from "react";
import type {Color} from "../types/color.ts";
import {Algorithm, BacktrackingAlgorithm, DistinctColors} from "../utils/distinct-colors.ts";
import styles from './ColorSwatch.module.css';

const ColorSwatch = () => {
	const [colors, setColors] = useState<Color[]>([])
	const [loading, setLoading] = useState<boolean>(false);
	const [saturation, setSaturation] = useState<string>('100');
	const [lightness, setLightness] = useState<string>('50');
	const [algorithm, setAlgorithm] = useState<Algorithm | BacktrackingAlgorithm>(BacktrackingAlgorithm.BINARY_SEARCH);

	const onSaturationChange = (e: ChangeEvent<HTMLInputElement>) => setSaturation(e.target.value);
	const onLightnessChange = (e: ChangeEvent<HTMLInputElement>) => setLightness(e.target.value);
	const onAlgorithmChange = (e: ChangeEvent<HTMLSelectElement>) => setAlgorithm(e.target.value as Algorithm | BacktrackingAlgorithm);

	const onSubmit = () => {
		setLoading(true);
		setColors([]);
		const distinctColors = new DistinctColors(`${saturation}%`, `${lightness}%`);
		const promise = algorithm === Algorithm.LINEAR
			? distinctColors.linearSearch()
			: distinctColors.exponentialSearchWithBacktracking(algorithm as BacktrackingAlgorithm);
		distinctColors.emitter.addEventListener('updatedColors', (e: any) => setColors(e.detail));
		promise.finally(() => setLoading(false));
	};

	return (
		<div>
			<div className={styles.inputGroup}>
				<div className={styles.input}>
					<label htmlFor="saturation">Saturation:</label>
					<input
						type="number"
						id="saturation"
						onChange={onSaturationChange}
						value={saturation}
						name="saturation"
						min="0"
						max="100"
						step="1"
					/> %
				</div>
				<div className={styles.input}>
					<label htmlFor="lightness">Lightness:</label>
					<input
						type="number"
						id="lightness"
						onChange={onLightnessChange}
						value={lightness}
						name="lightness"
						min="0"
						max="100"
						step="1"
					/> %
				</div>
				<div className={styles.input}>
					<label htmlFor="algorithm">Algorithm:</label>
					<select id="algorithm" value={algorithm} onChange={onAlgorithmChange}>
						<option value={Algorithm.LINEAR}>Linear</option>
						<option value={BacktrackingAlgorithm.LINEAR}>Exponential Linear Backtracking</option>
						<option value={BacktrackingAlgorithm.BINARY_SEARCH}>
							Exponential Binary Search Backtracking
						</option>
						<option value={BacktrackingAlgorithm.COMBINED}>Exponential Combined Backtracking</option>
					</select>
				</div>
				<button className={styles.submit} onClick={onSubmit}>Submit</button>
			</div>
			<section className={styles.section}>
				{colors.map((color: Color) => (
					<div className={styles.item} key={color.name.value}>
						<img src={color.image.bare} alt={color.name.value}/>
						<span>{color.name.value}</span>
						<span>{color.rgb.value}</span>
					</div>
				))}
				{loading && Array(Math.max(20 - colors.length, 1)).fill(0).map((_, index) => (
					<div className={styles.skeleton} key={index} />
				))}
			</section>
		</div>
	);
};

export default ColorSwatch;
