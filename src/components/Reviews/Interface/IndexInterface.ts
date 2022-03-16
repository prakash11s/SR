import * as H from 'history';

export interface ICallQueueOverviewTableProps {
 loader: boolean;
 match: match<MatchParams>;
 history: H.History;
 snackBar: boolean
}

interface MatchParams {
 name: string;
}

export interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}

export interface ICallQueueOverviewTableState {
 isLoading: boolean,
 open: boolean,
 // vertical: any,
 // horizontal: any
}

