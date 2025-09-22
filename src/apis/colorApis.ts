import { colorService } from './services.ts';
import type {Color} from "../types/color.ts";

const cache: Record<string, Color> = {};

export const getColor = (h: number, s: string, l: string): Promise<Color> => {
	const key = `hsl(${h},${s},${l})`;
	if (cache[key]) {
		return Promise.resolve({ ...cache[key], fromCache: true });
	}

	return colorService.get(`/id?hsl=${key}`).then(({ data }) => {
		cache[key] = data;
		return { ...data, fromCache: false };
	});
};
