import axios from "../../util/Api";
import { Service } from "../../components/OrderServices/interface";

export const getSupportOrdersServicesAction = (id: number, callBack: (result:string, response: any) => void) => {
    return (dispatch: any) => {
        axios.get(`/orders/${id}/services`)
            .then(response => callBack('success', response.data.data))
            .catch((error: any) => callBack('fail', error.response.data.message));
    }
}

export const putSupportOrdersFinishOrder = (id: number, services: Service[] | [], callBack: (result: string, response: any) => void) => {
    return (dispatch: any) => {
        axios.put(`/orders/${id}/finish-order`, {
            services
        })
            .then(response => callBack('success', response.data.data))
            .catch((error: any) => callBack('fail', error.response.data))
    }
}
