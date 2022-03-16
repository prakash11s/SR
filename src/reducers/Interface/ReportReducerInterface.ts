export interface IReportReducer {
	reportList: any[],
	loading: boolean,
	error: string,
	meta: any
}

export interface IDashboardOrder {
	id: string,
	value: number
}
