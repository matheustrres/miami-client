import nodeFs from 'node:fs';
import nodePath from 'node:path';

import type MiamiClient from '@structs/client';

type LoadResourcesProps<T> = {
	client: MiamiClient;
	resourceArray: T[];
	resourcePath: string;
};

export const loadResources = <T>(props: LoadResourcesProps<T>): T[] => {
	const root = nodePath.resolve(__dirname, '..', '..');
	const directories: string[] = nodeFs.readdirSync(
		nodePath.join(root, props.resourcePath),
	);

	for (const directory of directories) {
		const resources: string[] = nodeFs.readdirSync(
			`${root}/${props.resourcePath}/${directory}`,
		);

		for (const resource of resources) {
			const joinedPath: string = nodePath.resolve(
				root,
				props.resourcePath,
				directory,
				resource,
			);

			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const Resource = require(joinedPath).default;
			const res = new Resource(props.client) as T;

			props.resourceArray.push(res);
		}
	}

	return props.resourceArray;
};
