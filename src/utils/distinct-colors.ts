import {getColor} from "../apis/colorApis.ts";
import type {Color} from "../types/color.ts";

const FIRST_DEGREE = 0;
const MAX_DEGREES = 360;

export enum Algorithm {
	LINEAR = 'linear',
	EXPONENTIAL = 'exponential'
}

export enum BacktrackingAlgorithm {
	LINEAR = 'linear',
	BINARY_SEARCH = 'binary_search',
	COMBINED = 'combined'
}

export class DistinctColors {
	private readonly s: string;
	private readonly l: string;
	private readonly nameToColor: Record<string, Color> = {};
	private debugMode: boolean = true;
	private totalCalls: number = 0;
	emitter = new EventTarget();

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
			this.addColor(color);
		});

		return Object.values(this.nameToColor);
	}

	async exponentialSearchWithBacktracking(
		backtrackingAlgorithm: BacktrackingAlgorithm = BacktrackingAlgorithm.LINEAR,
		base: number = 1,
		exponent: number = 2
	) {
		let start = FIRST_DEGREE;
		let end: number = 0;
		let step: number = 0;
		let continueSearchingColors: boolean = true;

		const resetVariables = async () => {
			end = start + base;
			step = base;
			continueSearchingColors = start < MAX_DEGREES &&
				(!Object.keys(this.nameToColor).length || !(await this.isColorEqual(FIRST_DEGREE, start)));
		};
		await resetVariables();

		while (continueSearchingColors) {
			const newColor = await getColor(start, this.s, this.l);
			this.totalCalls = newColor.fromCache ? this.totalCalls : this.totalCalls + 1;
			this.addColor(newColor);

			let shouldContinue = true;
			while (shouldContinue) {
				try {
					const isColorEqual = await this.isColorEqual(start, end);
					shouldContinue = isColorEqual && end < MAX_DEGREES;
					if (shouldContinue) {
						step *= exponent;
						end = Math.min(start + step, MAX_DEGREES);
					}
				} catch {
					shouldContinue = false;
				}
			}

			if (backtrackingAlgorithm === BacktrackingAlgorithm.LINEAR) {
				end = await this.linearBacktrack(start, end);
			} else if (backtrackingAlgorithm === BacktrackingAlgorithm.BINARY_SEARCH) {
				end = await this.binarySearchBacktrack(start, end);
			} else if (backtrackingAlgorithm === BacktrackingAlgorithm.COMBINED) {
				end = await this.linearBinarySearchBacktrack(start, end);
			}

			start = Math.min(end + 1, MAX_DEGREES);
			await resetVariables();
		}

		if (this.debugMode) {
			console.log('Total API calls:', this.totalCalls);
		}
		return Object.values(this.nameToColor);
	}

	private addColor(color: Color) {
		if (!this.nameToColor[color.name.value]) {
			this.nameToColor[color.name.value] = color;
			this.emitter.dispatchEvent(new CustomEvent('updatedColors', {detail: Object.values(this.nameToColor)}));
		}
	}

	private async isColorEqual(color1Index: number, color2Index: number) {
		const color1= await getColor(color1Index, this.s, this.l);
		this.totalCalls = color1.fromCache ? this.totalCalls : this.totalCalls + 1;
		const color2 = await getColor(color2Index, this.s, this.l);
		this.totalCalls = color2.fromCache ? this.totalCalls : this.totalCalls + 1;
		return color1.name.value === color2.name.value;
	};

	private async linearBacktrack(start: number, end: number) {
		let shouldContinue = true;
		while (shouldContinue) {
			try {
				const isColorEqual = await this.isColorEqual(start, end);
				shouldContinue = !isColorEqual && start < end;
				if (shouldContinue) {
					end -= 1;
				}
			} catch {
				shouldContinue = false;
			}
		}
		return end;
	}

	private async binarySearchBacktrack(start: number, end: number) {
		while (start < end) {
			let isColorEqual = await this.isColorEqual(start, end);
			if (isColorEqual) {
				return start;
			}

			const mid = Math.floor((start + end) / 2);
			if (start === mid) {
				return start;
			}

			isColorEqual = await this.isColorEqual(start, mid);
			if (isColorEqual) {
				start = mid;
			} else {
				end = mid;
			}
		}

		return start;
	}

	private async linearBinarySearchBacktrack(start: number, end: number) {
		if (end - start <= 4) {
			return this.linearBacktrack(start, end);
		}
		return this.binarySearchBacktrack(start, end);
	}
}
