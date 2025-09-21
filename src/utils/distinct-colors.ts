import {getColor} from "../apis/colorApis.ts";
import type {Color} from "../types/color.ts";

const FIRST_DEGREE = 0;
const MAX_DEGREES = 360;

export class DistinctColors {
	private readonly s: string;
	private readonly l: string;
	private readonly nameToColor: Record<string, Color> = {};

	constructor(s: string, l: string ) {
		this.s = s;
		this.l = l;
	}

	async linearSearch() {
		const promises = [...Array(MAX_DEGREES).keys()].map((degree) => (
			getColor(degree, this.s, this.l)
		));

		const colors = await Promise.all(promises);
		colors.forEach((color) => {
			this.nameToColor[color.name.value] = color;
		});

		return Object.values(this.nameToColor);
	}

	async exponentialSearchWithLinearBacktracking(base: number = 1, exponent: number = 2) {
		const firstColor = await getColor(FIRST_DEGREE, this.s, this.l);

		let start = FIRST_DEGREE;
		let end = start + base;

		let shouldContinue = true;
		while (shouldContinue) {
			try {
				const isColorEqual = await this.isColorEqual(this.s, this.l, start, end);
				shouldContinue = isColorEqual && end < MAX_DEGREES;
				if (shouldContinue) {
					// TODO ALLEN
					end = Math.min(0, MAX_DEGREES);
				}
			} catch {
				shouldContinue = false;
			}
		}

		const newColor = await getColor(start, this.s, this.l);
		this.nameToColor[newColor.name.value] = newColor;

		shouldContinue = true;
		while (shouldContinue) {
			try {
				const isColorEqual = await this.isColorEqual(this.s, this.l, start, end);
				shouldContinue = !isColorEqual && start < end;
			} catch {
				shouldContinue = false;
			}
		}

		start = Math.min(end + 1, MAX_DEGREES);
		end = start + base;
	}

	private async isColorEqual(s: string, l: string, color1Index: number, color2Index: number) {
		const color1= await getColor(color1Index, s, l);
		const color2 = await getColor(color2Index, s, l);
		return color1.name.value === color2.name.value;
	};

}
