#!/usr/bin/env node

const FS = require('fs/promises');
const {join} = require('path');

const BUILD_DIR = join(__dirname, 'dist');

clearDir(BUILD_DIR)
	.then(build);

/**
 * Clears/empties a directory.
 * @param {PathLike} path
 * @returns Promise<void>
 */
async function clearDir(path) {
	return FS.readdir(path)
		.then(async dirList => {
			for (const entry of dirList)
				await FS.unlink(join(BUILD_DIR, entry));
		});
}

function build() {

}
