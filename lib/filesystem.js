const FS = require('fs');
const Path = require('path');

/**
 * Iterate on each entry of a directory.
 * @param {PathLike} path
 * @param {function(entry: string | Dirent)} callback
 * @param {(ObjectEncodingOptions & {withFileTypes?: boolean}) | BufferEncoding} [options]
 * @returns Promise<void>
 */
function iterateDirList(path, callback, options) {
	return FS.promises.readdir(path, options)
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
			return FS.promises.unlink(Path.join(path, entry.name));
		if (entry.isDirectory())
			return FS.promises.rm(Path.join(path, entry.name), {recursive: true});
	}, {withFileTypes: true});
}

/**
 * Include raw files from another directory using hard links.
 * @param {string} sourceDir
 * @param {string} targetDir
 * @returns Promise<void>
 */
function linkDirStructure(sourceDir, targetDir) {
	return iterateDirListRecursive(sourceDir, (entry, dirPath) => {
		if (entry.isFile())
			return FS.promises.link(Path.join(dirPath, entry.name), Path.join(targetDir, Path.relative(sourceDir, dirPath), entry.name));
		if (entry.isDirectory())
			return FS.promises.mkdir(Path.join(targetDir, Path.relative(sourceDir, dirPath), entry.name)/*, {recursive: true}*/);
	}, {withFileTypes: true});
}

module.exports = {
	iterateDirList,
	iterateDirListRecursive,
	clearDir,
	linkDirStructure
};
