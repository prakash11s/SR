import * as H from 'history';

export interface IContainerHeaderProps {
 title: JSX.Element;
 match: match<MatchParams>;
 statuses?: IStatus[];
 toggleSelectedFilters?: (id: string) => void;
 selectedFilters?: string;
 textId?: string;
 children?: React.ReactNode;
 location?: H.Location;
 history?: H.History;
}

export interface IStatus {
 orders_count?: string;
 id: string;
 name: string;
}

interface MatchParams {
 name?: string;
}

export interface match<P> {
params: P;
isExact?: boolean;
path?: string;
url: string;
}


