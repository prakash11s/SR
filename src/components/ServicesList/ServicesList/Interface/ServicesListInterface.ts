import * as H from 'history';

export interface IServicesList {
	history: H.History;
	match: match<MatchParams>
}

interface MatchParams {
	name: string;
	id: any;
}

interface match<P> {
	params: P;
	isExact: boolean;
	path: string;
	url: string;
}