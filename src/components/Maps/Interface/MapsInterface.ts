import * as H from "history";

export interface IMapsInterface {
	match: match<MatchParams>;
	history: H.History;
	location: H.Location;
}

interface ServicePoint {
	id: string;
	lat: number;
	lng: number;
	has_active_subscription: boolean;
	department: string;
}
export interface MarkerInterface {
	servicePoint: ServicePoint;
	google: object;
	setSelectedServicePoint: (servicePoint: any) => void;
	setLat?: (lng: any) => void;
	setLng?: (lat: any) => void;
	markerIcon: string;
	getSingleCoordinate: (id: string, callback: any) => void;
	selectedServicePointId: string;
	setSelectedServicePointId: (id: string) => void;
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
