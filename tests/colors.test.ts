import {getDistinctColors} from "../src/utils/colors.util";
import {colors} from "./constants/colors";

test('gets distinct color names', () => {
	const distinctColorsBinarySearch = getDistinctColors(colors).map(color => color.name.value);
	const distinctColorsBruteForce = [...new Set(colors.map(color => color.name.value))];
	expect(distinctColorsBinarySearch).toEqual(distinctColorsBruteForce);
});
