import { IOrder } from "../../../../reducers/Interface/OrderInterface";

export interface ICouriersStep2Props {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  steps: string[];
  onHeadingChange: (p1: string, p2: number) => void;
}

export interface IRootCouriersStep2State {
  orderState: IOrder;
}

export interface IShipmentTypes {
  name: string;
  id: number;
}

export interface ICourierVehicleTypes {
  checked: boolean;
  id: number;
  image: string;
  description: string;
  price_per_km: number;
  minimum_transportation_price: number;
}
