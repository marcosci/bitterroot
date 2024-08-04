import fs from 'fs';
import path from 'path';
import { Vector3 } from 'three';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/bitterroot.asc');
	const bitterroot_data = await response.text(); // assuming the .asc file is text-based

	// Parse the .asc file
	const lines = bitterroot_data.split('\n');
	const header = bitterroot_data.slice(0, 37);

	const dataLines = lines.slice(6);
	const elevation = dataLines.map((line) =>
		line
			.trim()
			.split(/\s+/)
			.map((num) => parseInt(num, 10) * 10)
	);

	const extractNumbers = (str) => {
		const ncolsMatch = str.match(/ncols\s+(\d+)/);
		const nrowsMatch = str.match(/nrows\s+(\d+)/);

		const ncols = ncolsMatch ? parseInt(ncolsMatch[1], 10) : null;
		const nrows = nrowsMatch ? parseInt(nrowsMatch[1], 10) : null;

		return { ncols, nrows };
	};

	const { ncols, nrows } = extractNumbers(header);

	const findMinMax = (arr) => {
		let min = Infinity;
		let max = -Infinity;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] < min) min = arr[i];
			if (arr[i] > max) max = arr[i];
		}

		return { min, max };
	};

	const minmax = findMinMax(elevation.flat());

	const elevation_json = {
		data: elevation,
		size: { width: ncols, height: nrows },
		min: minmax.min,
		max: minmax.max,
		firstRowSum: ncols * 2 - 1
	};

	console.log(elevation_json.max);

	return {
		props: {
			elevation_json: elevation_json
		}
	};
}
