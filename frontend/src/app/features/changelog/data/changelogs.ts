export interface Release {
	version: string;
	releaseDate: string;
	sections: Section[];
}

export interface Section {
	title: string;
	mergeRequests: MergeRequest[];
}

export interface MergeRequest {
	title: string;
	description: string;
	issueID: string;
	issueLink: string;
	mergeRequestID: string;
	mergeRequestLink: string;
}

// Static releases. Order matters, the first one in the array is the first one to be displayed.
export const RELEASES = [
	{
		version: '0.2.0',
		releaseDate: '03/06/2021',
		sections: [
			{
				title: 'FEATURES',
				mergeRequests: [
					{
						title: 'Find messages:',
						description: 'Users can now search messages in a chat.',
						issueID: '#20',
						issueLink: 'https://gitlab.com/unizzan/oama/-/issues/20',
						mergeRequestID: '!19',
						mergeRequestLink: 'https://gitlab.com/unizzan/oama/-/merge_requests/19'
					},
					{
						title: 'Limit room:',
						description: 'The amount of users in a room is now limited.',
						issueID: '#23',
						issueLink: 'https://gitlab.com/unizzan/oama/-/issues/23',
						mergeRequestID: '!22',
						mergeRequestLink: 'https://gitlab.com/unizzan/oama/-/merge_requests/22'
					},
					{
						title: 'Active users list:',
						description: 'Active users in a chat room are now visible and searchable.',
						issueID: '#26',
						issueLink: 'https://gitlab.com/unizzan/oama/-/issues/26',
						mergeRequestID: '!24',
						mergeRequestLink: 'https://gitlab.com/unizzan/oama/-/merge_requests/24'
					},
					{
						title: 'Spoiler topic:',
						description: 'Users can now suggest the topic of a spoiler message.',
						issueID: '#27',
						issueLink: 'https://gitlab.com/unizzan/oama/-/issues/27',
						mergeRequestID: '!26',
						mergeRequestLink: 'https://gitlab.com/unizzan/oama/-/merge_requests/26'
					}
				]
			},
			{
				title: 'BUG FIXES',
				mergeRequests: [
					{
						title: 'Messages collection:',
						description: 'Separeted messages logic from rooms in a new collection. This makes the system more scalable.',
						issueID: '#22',
						issueLink: 'https://gitlab.com/unizzan/oama/-/issues/22',
						mergeRequestID: '!23',
						mergeRequestLink: 'https://gitlab.com/unizzan/oama/-/merge_requests/23'
					}
				]
			}
		]
	}
];
