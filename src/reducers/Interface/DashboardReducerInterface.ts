export interface IDashboardReducer {
	orders: IDashboardOrder[],
	loading: boolean,
}

export interface IDashboardOrder {
	id: string,
	value: number
}