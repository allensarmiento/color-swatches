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
	const initialOffset = 2;

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

		console.log(`LeftColor: ${leftColor.name.value} - ${left}`);
		console.log(`RightColor: ${rightColor.name.value} - ${right}`);

		offset = initialOffset;
		left = right + 1;
		left = left < HUE_LAST_NUMBER ? left : HUE_LAST_NUMBER;
		right = left + offset;
		right = right < HUE_LAST_NUMBER ? right : HUE_LAST_NUMBER;

		leftColor = await getColor(left, s, l);
		rightColor = await getColor(right, s, l);

		console.log(`Start: ${leftColor.name.value} - ${left}`);
		console.log(`End: ${rightColor.name.value} - ${right}`);
		console.log('==================================');
	}

	console.log(`Total calls: ${totalCalls}`);
	return Object.values(nameToColor);
};
