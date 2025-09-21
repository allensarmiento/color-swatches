export interface Color {
	hsl: {
		fraction: {
			h: number;
			s: number;
			l: number;
		};
		h: number;
		s: number;
		l: number;
		value: string;
	},
	name: {
		value: string;
		closest_named_hex: string;
		exact_match_name: boolean;
		distance: number;
	},
	image: {
		bare: string;
		name: string;
	}
}
