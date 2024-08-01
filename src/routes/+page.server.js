/** @type {import('./$types').PageLoad} */
export function load({ params }) {

    async function loadAscFile(url) {
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.split('\n');
        const header = lines.slice(0, 6);
        const dataLines = lines.slice(6);
    
        const ncols = parseInt(header[0].split(' ')[1]);
        const nrows = parseInt(header[1].split(' ')[1]);
        const elevations = dataLines.map(line => line.trim().split(/\s+/).map(Number));
    
        return { ncols, nrows, elevations };
    }

	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
    
}