import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface ICourierStep1Props {
 activeStep: number,
 steps: any,
 handleNext: () => void,
 handleBack: () => void,
 setOrderCourierLocation: (data: any) => void,
 setSupportCodeData: (data: any) => void,
 setOrderPrefillData: (data: any) => void,
 orderState: any,
 orderId?: number,
 onHeadingChange:(data: any, id: number) => void
 departmentState: string,
 handleOrderReset:(searchValue : string) => void
}

export interface ICourierStep1State {
 fromInput: string;
 toInput: string;
 fromInputLatLng: Object;
 toInputLatLng: Object;
 distance: string,
 supportCodeData: any,
 uuid: any,
 secret: any,
 error: boolean,
 errorMsg: string,
 search: string,
 searchError: boolean,
 searchErrorMsg: string
}