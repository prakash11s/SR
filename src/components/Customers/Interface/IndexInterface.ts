import * as H from 'history';

export interface IIndexInterface {
    match: match<MatchParams>;
    history: H.History;
    location: H.Location;
    uuid: number
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
  
  