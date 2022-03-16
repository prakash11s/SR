import * as H from 'history';

export interface IChart {
  chartData: number[],
  labels: string[]
}

export interface IDashboardInterface {
  match: match<MatchParams>;
  history: H.History;
  location: H.Location;
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