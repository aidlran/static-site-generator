#!/usr/bin/env node

const FS = require('fs/promises');
const Path = require('path');

const BUILD_DIR = Path.join(__dirname, 'dist');
const PUBLIC_DIR = Path.join(__dirname, 'public');

clearDir(BUILD_DIR)
	.then(() => linkFiles(PUBLIC_DIR, BUILD_DIR))
	.then(build);

/**
 * Iterate on each entry of a directory.
 * @param {PathLike} path
 * @param {function(entry: string | Dirent)} callback
 * @param {(ObjectEncodingOptions & {withFileTypes?: boolean}) | BufferEncoding} [options]
 * @returns Promise<void>
 */
function iterateDirList(path, callback, options) {
	return FS.readdir(path, options)
		.then(async dirList => {
			for (const entry of dirList)
				await callback(entry);
		});
}

/**
 * Iterate on each entry of a directory with recursion.
 * @param {string} path
 * @param {function(entry: string | Dirent), dirPath: string} callback
 * @param {(ObjectEncodingOptions & {withFileTypes?: boolean}) | BufferEncoding} [options]
 * @returns Promise<void>
 */
function iterateDirListRecursive(path, callback, options) {
	const withFileTypes = options && options.withFileTypes;
	return iterateDirList(path, async entry => {
		await (withFileTypes
			? callback(entry, path)
			: callback(entry.name, path));
		if (entry.isDirectory())
			await iterateDirListRecursive(Path.join(path, entry.name), callback, options);
	}, {...options, withFileTypes: true});
}

/**
 * Clears/empties a directory.
 * @param {string} path
 * @returns Promise<void>
 */
function clearDir(path) {
	return iterateDirList(path, entry => {
		if (entry.isFile())
			return FS.unlink(Path.join(path, entry.name));
		if (entry.isDirectory())
			return FS.rm(Path.join(path, entry.name), {recursive: true});
	}, {withFileTypes: true});
}

/**
 * Include raw files from another directory using hard links.
 * @param {string} sourceDir
 * @param {string} targetDir
 * @returns Promise<void>
 */
async function linkFiles(sourceDir, targetDir) {
	return iterateDirListRecursive(sourceDir, (entry, dirPath) => {
		if (entry.isFile())
			return FS.link(Path.join(dirPath, entry.name), Path.join(targetDir, Path.relative(sourceDir, dirPath), entry.name));
		if (entry.isDirectory())
			return FS.mkdir(Path.join(targetDir, Path.relative(sourceDir, dirPath), entry.name)/*, {recursive: true}*/);
	}, {withFileTypes: true});
}

function build() {

}
