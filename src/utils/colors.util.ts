import type {Color} from "../types/color.ts";

const HUE_FIRST_NUMBER = 0;

export const getDistinctColors = (colors: Color[]): Color[] => {
	const nameToColor: Record<string, Color> = {};

	const helperFunction= (start: number, end: number) => {
		if (start > end) return;

		const first = colors[start];
		const last = colors[end];

		if (first.name.value === last.name.value || start === end) {
			if (!nameToColor[first.name.value]) {
				nameToColor[first.name.value] = { ...first };
			}
			return;
		}

		const mid = Math.floor((start + end) / 2);
		helperFunction(start, mid);
		helperFunction(mid + 1, end);
	};

	helperFunction(HUE_FIRST_NUMBER, colors.length - 1);

	return Object.values(nameToColor);
};
