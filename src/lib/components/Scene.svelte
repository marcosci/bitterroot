<script>
	import { BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils.js';
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Debug } from '@threlte/rapier';
	import { showCollider, autoRotate } from '../state';

	export let data;

	let elevation_json = data.props.elevation_json;

	const geometry = new BufferGeometry();

	var JsonDemLoader = function (json) {
		console.log('Loading DEM from JSON file...');
		this.data = json.data;
		this.width = json.size.width;
		this.height = json.size.height;
		this.min = json.min;
		this.max = json.max;
		this.firstRowSum = json.firstRowSum; // number of vertice after travelling through the first row (considering we don't use the last col)

		this.geometry = null;

		// meters per pixel (SRTM3 spec)
		this._groundResolution = 90;
	};

	JsonDemLoader.prototype._init = function (filepath) {
		let that = this;
		filepath;
	};

	JsonDemLoader.prototype.buildGeometry = function (threeGeom) {
		this.geometry = threeGeom;

		console.log('Building vertice list...');
		const vertices = this._buildVertices();

		console.log('Building faces list...');
		const indices = this._buildTriangles();

		this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.geometry.setIndex(indices);
		this.geometry.computeVertexNormals();
	};

	JsonDemLoader.prototype._buildVertices = function () {
		const vertices = [];

		for (let iy = 0; iy < this.height - 1; iy++) {
			for (let ix = 0; ix < this.width - 1; ix++) {
				if (ix == 0 && iy == 0) {
					vertices.push(ix, this._getHeight(iy, ix), iy);
					vertices.push(ix + 1, this._getHeight(iy, ix + 1), iy);
					vertices.push(ix + 1, this._getHeight(iy + 1, ix + 1), iy + 1);
					vertices.push(ix, this._getHeight(iy + 1, ix), iy + 1);
				} else if (iy == 0) {
					vertices.push(ix + 1, this._getHeight(iy, ix + 1), iy);
					vertices.push(ix + 1, this._getHeight(iy + 1, ix + 1), iy + 1);
				} else if (ix == 0) {
					vertices.push(ix + 1, this._getHeight(iy + 1, ix + 1), iy + 1);
					vertices.push(ix, this._getHeight(iy + 1, ix), iy + 1);
				} else {
					vertices.push(ix + 1, this._getHeight(iy + 1, ix + 1), iy + 1);
				}
			}
		}

		return vertices;
	};

	// returns the pixel value - min and adjusted with a factor
	JsonDemLoader.prototype._getHeight = function (y, x) {
		// NO DATA from SRTM (ocean)
		if (this.data[y][x] == -32768) {
			return 0;
		}

		return (this.data[y][x] - this.min) / this._groundResolution;
	};

	// buil the list of triangle from the list of vertice
	// (directly in the Threejs geometry)
	JsonDemLoader.prototype._buildTriangles = function () {
		const indices = [];

		let aIndex, bIndex, cIndex, dIndex;

		for (let iy = 0; iy < this.height - 1; iy++) {
			for (let ix = 0; ix < this.width - 1; ix++) {
				if (ix == 0 && iy == 0) {
					aIndex = 0;
					bIndex = 1;
					cIndex = 2;
					dIndex = 3;
				} else if (ix == 1 && iy == 0) {
					aIndex = ix;
					bIndex = ix * 2 + 2;
					cIndex = ix * 2 + 3;
					dIndex = (ix - 1) * 2 + 2;
				} else if (ix == 0 && iy == 1) {
					aIndex = 3;
					bIndex = 2;
					cIndex = this.firstRowSum + 1;
					dIndex = this.firstRowSum + 2;
				} else if (ix == 1 && iy == 1) {
					aIndex = 2;
					bIndex = 5;
					cIndex = this.firstRowSum + 3;
					dIndex = this.firstRowSum + 1;
				} else if (iy == 0) {
					aIndex = ix * 2;
					bIndex = ix * 2 + 2;
					cIndex = ix * 2 + 3;
					dIndex = (ix - 1) * 2 + 3;
				} else if (iy == 1) {
					aIndex = ix * 2 + 1;
					bIndex = ix * 2 + 3;
					cIndex = this.firstRowSum + 2 + ix;
					dIndex = this.firstRowSum + 1 + ix;
				} else if (ix == 0) {
					aIndex = this.firstRowSum + (iy - 2) * this.width + 2;
					bIndex = this.firstRowSum + (iy - 2) * this.width + 1;
					cIndex = this.firstRowSum + (iy - 1) * this.width + 1;
					dIndex = this.firstRowSum + (iy - 1) * this.width + 2;
				} else if (ix == 1) {
					aIndex = this.firstRowSum + (iy - 2) * this.width + 1;
					bIndex = this.firstRowSum + (iy - 2) * this.width + 3;
					cIndex = this.firstRowSum + (iy - 1) * this.width + 3;
					dIndex = this.firstRowSum + (iy - 1) * this.width + 1;
				} else {
					aIndex = this.firstRowSum + this.width * (iy - 2) + ix + 1;
					bIndex = this.firstRowSum + this.width * (iy - 2) + ix + 2;
					cIndex = this.firstRowSum + this.width * (iy - 1) + ix + 2;
					dIndex = this.firstRowSum + this.width * (iy - 1) + ix + 1;
				}

				indices.push(aIndex, bIndex, cIndex);
				indices.push(aIndex, cIndex, dIndex);
			}
		}

		return indices;
	};

	JsonDemLoader.prototype.getSceneWidth = function () {
		return this.width;
	};

	JsonDemLoader.prototype.getSceneHeight = function () {
		return this.height;
	};

	let jsonDemLoader = new JsonDemLoader(elevation_json);
	console.log(jsonDemLoader);
	// loads the geometry from json DEM
	jsonDemLoader.buildGeometry(geometry);

	geometry.translate(
		-(jsonDemLoader.getSceneWidth() / 2),
		0,
		-(jsonDemLoader.getSceneHeight() / 2)
	);

	geometry.scale(1, 2.5, 1);
</script>

<Debug visible={$showCollider} />

<T.PerspectiveCamera
	makeDefault
	position.y={1}
	position.z={2000}
	lookAt.y={0}
	fov={60}
	far={100000}
>
	<OrbitControls
		enableDamping={true}
		autoRotate={$autoRotate}
		enableZoom={true}
		maxPolarAngle={1}
		keys={{
			LEFT: 'ArrowLeft', //left arrow
			UP: 'ArrowUp', // up arrow
			RIGHT: 'ArrowRight', // right arrow
			BOTTOM: 'ArrowDown' // down arrow
		}}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[3, 10, 10]} />
<T.HemisphereLight intensity={0.2} />

<T.Mesh {geometry}>
	<T.MeshStandardMaterial side={DoubleSide} />
</T.Mesh>
