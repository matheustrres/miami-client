import { type InteractionResponse, type Message, codeBlock } from 'discord.js';

import type Context from '@structs/context';
import type SubCommand from '@structs/sub-command';

import { buildEmbed } from '@utils/discord/builders';
import { formatTimestamp } from '@utils/helpers/formatters';

type GithubRepository = {
	id: number;
	full_name: string;
	private: boolean;
	html_url: string;
	description: string | null;
	owner: {
		avatar_url: string;
	};
	created_at: string;
	updated_at: string;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	forks_count: number;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: {
		key: string;
		name: string;
		spdx_id: string;
	} | null;
	topics: string[] | null;
	visibility: string;
	default_branch: string;
};

export class GithubRepositoriesHandlerSubCommand implements SubCommand {
	constructor(private readonly ctx: Context) {}

	public exec = async (
		owner: string,
		repositoryName: string,
	): Promise<Message | InteractionResponse> => {
		const res = await fetch(
			`https://api.github.com/repos/${owner}/${repositoryName}`,
		);

		if (res.status !== 200) {
			return this.ctx.reply({
				ephemeral: true,
				content: 'No repository were found.',
			});
		}

		const repository = (await res.json()) as GithubRepository;

		const embedDescription: string[] = [
			codeBlock(repository.description || 'No description defined'),
			`:calendar_spiral: Created at: ${formatTimestamp(repository.created_at)}`,
			`:calendar_spiral: Updated at: ${formatTimestamp(repository.updated_at)}`,
		];

		const embed = buildEmbed({
			author: {
				name: 'Github repositories',
			},
			title: `Repository: ${repository.full_name}`,
			description: embedDescription.join('\n'),
			fields: [
				{
					name: ':id: ID',
					value: `${repository.id}`,
					inline: true,
				},
				{
					name: ':star: Stars',
					value: `${repository.stargazers_count}`,
					inline: true,
				},
				{
					name: '<:branch:1134856101897191557> Default branch',
					value: `${repository.default_branch}`,
					inline: true,
				},
				{
					name: ':lock_with_ink_pen: Is private',
					value: `${repository.private ? 'Yes' : 'No'}`,
					inline: true,
				},
				{
					name: '<:code:1134856544341721102> Language',
					value: `${repository.language}`,
					inline: true,
				},
				{
					name: '<:fork:1134858251486371960> Forks',
					value: `${repository.forks_count}`,
					inline: true,
				},
				{
					name: ':file_folder: Is archived',
					value: `${repository.archived ? 'Yes' : 'No'}`,
					inline: true,
				},
				{
					name: ':boom: Is disabled',
					value: `${repository.disabled ? 'Yes' : 'No'}`,
					inline: true,
				},
				{
					name: ':eyes: Visibility',
					value: `${repository.visibility}`,
					inline: true,
				},
				{
					name: ':busts_in_silhouette: Watchers',
					value: `${repository.watchers_count}`,
					inline: true,
				},
				{
					name: ':nazar_amulet: Issues',
					value: `${repository.open_issues_count}`,
					inline: true,
				},
			],
			thumbnail: {
				url: repository.owner.avatar_url,
			},
			url: repository.html_url,
		});

		repository.license &&
			embed.addFields([
				{
					name: ':notebook: License',
					value: `${repository.license.name}`,
					inline: true,
				},
			]);

		return this.ctx.reply({ embeds: [embed] });
	};
}
