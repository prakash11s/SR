import React, {useContext, useState} from "react";
import { Row, Input, Button } from "reactstrap";
import RBACContext from "../../rbac/rbac.context";
import CurrencyInput from 'react-currency-input-field';
import {TextField} from "@material-ui/core";
import IntlMessages from "../../util/IntlMessages";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "../../util/Api";

const OrderService = (props: any): JSX.Element => {
    const { abilities } = useContext<any>(RBACContext);
    const pricePermission = Boolean(abilities.find((ability: any) => ability.name === 'booking-service-finish-orders-update-price'));
    const amountPermission = Boolean(abilities.find((ability: any) => ability.name === 'booking-service-finish-orders-update-amount'));
    // const formatNumber = (value: string): string => (value.length > 0 ? value : '1');
    const formatNumber = (value: string): string => (value.length > 0 ? value : value); //allow negative value
    const [servicesList, setServicesList] = useState<{ id: number, name: string }[]>([]);

    /**
     *  get services list
     * @param event
     */
    const getServicesList = (event: any) => {
        if (Boolean(event.target.value) && event.target.value.length > 1) {
            axios.get(`/services?query=${event.target.value}`)
                .then((response: any) => {
                    const selectServicesId = props.selectedServices.map(s => s.service_id)
                    setServicesList(response.data.data.filter(service => !selectServicesId.includes(service.id) ))
                })
                .catch((error) => console.log(error.response))
        } else {
            setServicesList([]);
        }
    };

    /**
     *  Get selected service data
     * @param event
     * @param value
     * @param reason
     */
    const getSelectedServiceData = (event: any, value: { id: number, name: string } | null, reason: string, index: number) => {
        if (reason === 'select-option') {
            props.changeData(index, {name: "service_id", data: value ? value.id : 0})
            props.changeData(index, {name: "name", data: value ? value.name : ''})
        }
    }

    return props.selectedServices.map((ser, index) =>
        <Row className="border rounded mb-2 p-1 align-items-center">
            <div className="col-sm-6 align-middle">
                {ser.service_id ?
                    <span>{ser.name}</span> :
                    <Autocomplete
                        className={ser.error && ser.error.name ? 'has-error':''}
                        id="support-code"
                        options={servicesList}
                        style={{ width: 300, zIndex: 10000 }}
                        getOptionLabel={(option: { id: number, name: string }) => option.name}
                        renderInput={(params) => <TextField {...params} label={<IntlMessages
                            id="searchServiceLabel" />} variant="outlined" />}
                        onInputChange={(event) => getServicesList(event)}
                        onChange={(event, value, reason) => getSelectedServiceData(event, value, reason, index)}
                    />
                }
            </div>
            <div className="col-sm-2">
                <Input className={ser.error && ser.error.amount ? 'has-error':''} type="number" disabled={!amountPermission} value={ser.amount} placeholder="amount" onChange={(event) => props.changeData(index, {name: "amount", data: formatNumber(event.target.value)})}/>
            </div>
            <div className="col-sm-2">
                <CurrencyInput
                    placeholder="Price"
                    allowDecimals={true}
                    decimalsLimit={2}
                    prefix={'€'}
                    precision={2}
                    value={ser.price}
                    disabled={!pricePermission}
                    className={`form-control ${(ser.error && ser.error.price) ? 'has-error':''}`}
                    onChange={(value)=>props.changeData(index, {name: "price", data: formatNumber(value ? value : '')})}
                />
            </div>
            <div className="col-sm-2 align-items-center mt-1">
                <Button type="button" onClick={() => props.delete(index)}>delete</Button>
            </div>
        </Row>
    );
}

export default OrderService;
