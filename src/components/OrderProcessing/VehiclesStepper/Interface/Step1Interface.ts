import { IOrder } from '../../../../reducers/Interface/OrderInterface';
import {ISetting} from "../../../../reducers/Interface/SettingInterface";

export interface IVehiclesStep1Props {
 activeStep: number,
 steps: any,
 handleNext: () => void,
 handleBack: () => void,
 setOrderVehicleData: (data: any) => void,
 setSupportCodeData: (data: any) => void,
 setOrderPrefillData: (data: any) => void,
 orderState: any,
 localeState: any,
 orderId?: number,
 onHeadingChange:(data: any, id: number) => void,
 handleOrderReset:(searchValue : string) => void
}

export interface IVehiclesStep1State {
 vehicleData: {
     plate_id?: number | unknown | null,
     vehicle_id?: number | unknown | null
 },
 brands?: IBrands[],
 models?: IModels[],
 fuelType?: IFuelType[],
 constructionYears?: number[],
 formValue?: {
     selectedBrandId?: number | unknown | null,
     selectedModelId?: number | unknown | null,
     selectedYear?: number | unknown | null,
     selectedFuelId?: number | unknown | null,
 },
 uuid?: string | null,
 secret?: string | null,
 supportCodeData?: any[],
 displayCarImage?: boolean,
 selectedCarImage?: string | null,
 brandName?: string | null,
 modelName?: string | null,
 fuelName?: string | null,
 year?: string | null,
 service_expire: string,
 error: boolean,
 errorMsg: string,
 search: string,
 searchError: boolean,
 searchErrorMsg: string
}

export interface IBrands {
 created_at: string,
 id: number,
 name: string,
 updated_at: string,
}

export interface IModels {
 brand_id: number,
 id: number,
 name: string,
}

export interface IFuelType {
 created_at: string,
 id: number,
 name: string,
 updated_at: string,
}

export interface IRootVehicleStep1State {
 orderState: IOrder,
 settings: ISetting,
}

export interface IVehicleData {
brand: {id: number, name: string},
construction_year: number,
fuel: {id: number, name: string},
images: string,
model: {id: number, name: string},
vehicleData: {plate_id: string, vehicle_id: number},
}

export interface IResponseData {
code: number,
created_at: string,
data: {
 vehicle_id: number,
 licenseplate: string,
 selected_services: []
},
support_code_issue_timestamp?: string,
updated_at: string,
}
