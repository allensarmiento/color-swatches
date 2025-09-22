import { colorService } from './services.ts';
import type {Color} from "../types/color.ts";

const cache: Record<string, Color> = {};

export const getColor = async (h: number, s: string, l: string): Promise<Color> => {
	let retryCount = 3;

	const key = `hsl(${h},${s},${l})`;
	if (cache[key]) {
		return Promise.resolve({ ...cache[key], fromCache: true });
	}

	while (retryCount > 0) {
		try {
			const response = await colorService.get(`/id?hsl=${key}`);
			cache[key] = response.data;
			return { ...response.data, fromCache: false };
		} catch {
			retryCount--;
		}
	}

	return Promise.reject('Failed to get color');
};
