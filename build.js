#!/usr/bin/env node

const {join} = require('path');
const FS = {
	...require('fs/promises'),
	...require('./lib/filesystem.js')
};

const BUILD_DIR = join(__dirname, 'dist');
const PUBLIC_DIR = join(__dirname, 'public');

FS.mkdir(BUILD_DIR)
	// If exists, empty it
	.catch(() => FS.clearDir(BUILD_DIR))

	// Link contents of `public` dir if present
	.then(() => FS.exists(PUBLIC_DIR)).then(exists => {
		if (exists) return FS.linkDirStructure(PUBLIC_DIR, BUILD_DIR);
	})

	.then(build);

function build() {

}
