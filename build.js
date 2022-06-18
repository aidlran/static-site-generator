#!/usr/bin/env node

const {join} = require('path');
const FS = require('./lib/filesystem.js');

const BUILD_DIR = join(__dirname, 'dist');
const PUBLIC_DIR = join(__dirname, 'public');

FS.clearDir(BUILD_DIR)
	.then(() => FS.linkDirStructure(PUBLIC_DIR, BUILD_DIR))
	.then(build);

function build() {

}
