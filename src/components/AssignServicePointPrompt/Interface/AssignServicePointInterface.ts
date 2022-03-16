export interface IAssignServicePointInterface {
	hideServicePoint: boolean,
	show: boolean,
	onCancel: (result: boolean) => void,
	servicePointId: any,
	orderId: string
	extraData: any,
    preferredDates: any,
}
