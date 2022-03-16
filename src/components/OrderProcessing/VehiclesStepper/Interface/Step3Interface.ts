import { IOrder } from '../../../../reducers/Interface/OrderInterface';

export interface IStep3Props {
activeStep: number,
handleBack: () => void,
handleNext: () => void,
steps: string[],
orderId: string,
onHeadingChange: (p1: string, p2: number) => void,
}

export interface IRootStep3State {
 orderState: IOrder
}

export interface IRootStep3State1 {
 orderState:{
  orderCreate:{
   autoCompleteAddress:{
    Address: {
     street: string, 
     city: string
    }, error?: {
     message: string
    }}}}}