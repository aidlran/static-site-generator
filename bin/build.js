#!/usr/bin/env node

const {join} = require('path');
const FS = {
	...require('fs/promises'),
	...require('../lib/filesystem.js')
};

let workingDir = '.';

const BUILD_DIR = join(workingDir, 'dist');
const PUBLIC_DIR = join(workingDir, 'public');

const START_TIME = Date.now();

let oneArgument = false;

// Parse arguments
for (let i = 3; i < process.argv.length; i++) {
	if (process.argv[i].startsWith('-')) continue;
	else if (oneArgument) {
		console.log("Build command format: static-site-generator build [OPTIONS] DIR");
		process.exit(1);
	}
	else {
		workingDir = process.argv[i];
		oneArgument = true;
	}
}

FS.mkdir(BUILD_DIR)
	// If exists, empty it
	.catch(() => FS.clearDir(BUILD_DIR))

	// Link contents of `public` dir if present
	.then(() => FS.exists(PUBLIC_DIR)).then(exists => {
	if (exists) return FS.linkDirStructure(PUBLIC_DIR, BUILD_DIR);
})

	.then(build);

function build() {
	console.log(`Done in ${Date.now() - START_TIME}ms.`);
}
