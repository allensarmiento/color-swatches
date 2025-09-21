import { colorService } from './services.ts';
import type {Color} from "../types/color.ts";

const cache: Record<string, Color> = {};
const HUE_FIRST_NUMBER = 0;
const HUE_LAST_NUMBER = 360;
let totalCalls = 0;

export const getColor = (h: number, s: string, l: string): Promise<Color> => {
	const key = `hsl(${h},${s},${l})`;
	if (cache[key]) {
		return Promise.resolve(cache[key]);
	}

	if (h > HUE_LAST_NUMBER) {
		throw new Error(`Hue is out of range at ${h}`);
	}

	totalCalls++;
	return colorService.get(`/id?hsl=${key}`).then(({ data }) => {
		cache[key] = data;
		return data;
	});
};

export const getDistinctColors = async (s: string, l: string) => {
	const nameToColor: Record<string, Color> = {};
	const first = await getColor(HUE_FIRST_NUMBER, s, l);
	const initialOffset = 1;

	let offset = initialOffset;
	let left = HUE_FIRST_NUMBER;
	let right = left + offset;

	let leftColor = await getColor(left, s, l);
	let rightColor = await getColor(right, s, l);

	while ((!Object.keys(nameToColor).length || leftColor.name.value !== first.name.value) && left < HUE_LAST_NUMBER) {
		// Move exponentially over until we get a different color
		while (leftColor.name.value === rightColor.name.value && right < HUE_LAST_NUMBER) {
			offset *= 2;
			right = left + offset;
			right = right < HUE_LAST_NUMBER ? right : HUE_LAST_NUMBER;
			rightColor = await getColor(right, s, l);
		}

		nameToColor[leftColor.name.value] = { ...leftColor };

		// Backtrack until we hit the starting color
		while (leftColor.name.value !== rightColor.name.value && left < right) {
			right -= 1;
			rightColor = await getColor(right, s, l);
		}

		offset = initialOffset;
		left = right + 1;
		left = left < HUE_LAST_NUMBER ? left : HUE_LAST_NUMBER;
		right = left + offset;
		right = right < HUE_LAST_NUMBER ? right : HUE_LAST_NUMBER;

		leftColor = await getColor(left, s, l);
		rightColor = await getColor(right, s, l);
	}

	console.log(`Total calls: ${totalCalls}`);
	return Object.values(nameToColor);
};

const binarySearch = async (s: string, l: string, start: number, end: number) => {
	while (start < end) {
		if (await isColorEqual(s, l, start, end)) {
			return start;
		}

		const mid = Math.floor((start + end) / 2);
		console.log('values', start, mid, end);
		if (start === mid) {
			return start;
		}

		if (await isColorEqual(s, l, start, mid)) {
			start = mid;
		} else {
			end = mid;
		}
	}
	return start;
};

const isColorEqual = async (s: string, l: string, color1Index: number, color2Index: number) => {
	const color1= await getColor(color1Index, s, l);
	const color2 = await getColor(color2Index, s, l);
	return color1.name.value === color2.name.value;
};

export const getDistinctColorsBinarySearch = async (s: string, l: string) => {
	const nameToColor: Record<string, Color> = {};

	let start = HUE_FIRST_NUMBER;
	let end = start + 1;
	let offset = 1;

	while ((!Object.keys(nameToColor).length || !(await isColorEqual(s, l, start, HUE_FIRST_NUMBER))) && start < HUE_LAST_NUMBER) {
		while (await isColorEqual(s, l, start, end) && end < HUE_LAST_NUMBER) {
			offset *= 2;
			end = Math.min(HUE_LAST_NUMBER, start + offset)
		}

		const newColor = await getColor(start, s, l);
		nameToColor[newColor.name.value] = { ...newColor };

		console.log('color added', newColor.name.value);
		// if (end - start <= 4) {
		// 	while (!(await isColorEqual(s, l, start, end)) && start < end) {
		// 		end -= 1;
		// 	}
		// } else {
			end = await binarySearch(s, l, start, end);
		// }
		console.log('start', start);
		console.log('=====================')
		console.log('end', end);
		offset = 1;
		start = Math.min(HUE_LAST_NUMBER, end + 1);
		end = Math.min(HUE_LAST_NUMBER, start + offset);
	}

	console.log(`Total calls: ${totalCalls}`);
	return Object.values(nameToColor);
};
