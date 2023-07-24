import nodePath from 'node:path';

import moduleAlias from 'module-alias';

let root: string;

if (process.env.NODE_ENV === 'production') {
	root = nodePath.resolve(__dirname, '../../dist');
} else {
	root = nodePath.resolve(__dirname, '../../src');
}

console.log({ path: nodePath.join(root, 'config') });

moduleAlias.addAliases({
	'@config': nodePath.join(root, 'config'),
	'@commands': nodePath.join(root, 'commands'),
	'@events': nodePath.join(root, 'events'),
	'@structs': nodePath.join(root, 'structs'),
	'@typings': nodePath.join(root, 'typings'),
	'@utils': nodePath.join(root, 'utils'),
});
