export interface ICustomerPageProps {
 match: match<MatchParams>;
}

interface MatchParams {
 name: string;
}

interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}