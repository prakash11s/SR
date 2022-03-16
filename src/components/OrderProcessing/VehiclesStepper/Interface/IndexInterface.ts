import * as H from 'history';
import {IOrder} from '../../../../reducers/Interface/OrderInterface';

export interface IVehiclesStepperProps {
    history: H.History,
    location: H.Location,
    match: match<MatchParams>,
    orderState,
    resetOrderService: () => void;
    SelectedDepartment?: string
}

interface MatchParams {
    name: string;
}

interface match<P> {
    params: any;
    isExact: boolean;
    path: string;
    url: string;
}

export interface IVehicleStepperState {
    activeStep: number,
    orderId: number,
    stepHeading: string[],
    additional_services_text: string
}

export interface IRootvehicleStepperState {
    orderState: IOrder
}