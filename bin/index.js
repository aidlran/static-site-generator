#!/usr/bin/env node

switch (process.argv[2]) {
	case 'build':
		return require('./build.js');
}
