import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col} from 'reactstrap';
import { getSupportOrdersServicesAction, putSupportOrdersFinishOrder } from "../../actions/Actions/BookingServicesAction";
import { useDispatch } from "react-redux";
import { Service, ServiceItemData } from "./interface";
import OrderService from "./OrderService";
import SweetAlert from "react-bootstrap-sweetalert";
import IntlMessages from "../../util/IntlMessages";
import AlertPopUp from "../../common/AlertPopUp";

const OrderServices = (props: any): JSX.Element => {
    const dispatch = useDispatch();

    const [loadingAlert, setLoadingAlert] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(props.show);
    const [services, setServices] = useState <Service[] | []>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<boolean>(false);
    const [callAlert, setCallAlert] = useState<boolean>(false);

    useEffect(() => {
        if(props.preSelectedServices){
                setServices(props.preSelectedServices.map(service => {
                    const data = {
                        id: service.id,
                        service_id: service.service_id,
                        name: service.name,
                        amount: service.amount,
                        price: service.calculated_price_inc_vat/100,
                        error: null
                    }
                    return data
                }))
            }
    }, [])

    const toggleModal = (): void => {
        setShow(!show);
        setServices([]);

        if (show) {
            props.closeModal();
        }
    }

    const finishOrder = (): void => {
        setShowConfirm(true);
    }

    const cancelOrder = (): void => {
        props.onCancelOrder();
    };

    const addRow = (): void => {
        let service: Service = {
            service_id: 0, //static for now
            name: '',
            amount: 1,
            price: 0,
            error: null
        };

        setServices([...services, service]);
    }

    const deleteRow = (key): void => {
        const data = services.filter((item, index) => index != key);
        setServices(data);
    };

    const changeServiceData = (key, item: ServiceItemData): void => {
        let data = services;

        data[key][item.name] = item.data;
        if(data[key]['error']&&data[key]['error'].hasOwnProperty(item.name)) delete data[key]['error'][item.name];

        setServices(data.slice());
    }

    const fetchServices = (id: number): void => {
        dispatch(getSupportOrdersServicesAction(id, (result: string, response: any) => {
            if (result == 'success') {
                let data: Service[] | [] = [];

                response.forEach(service => {
                    let item: Service = {
                        id: service.id,
                        service_id: service.service_id,
                        name: service.name,
                        amount: service.amount !== null ? service.amount : 0,
                        price: service.price !== null ? (service.price / 100) : 0,
                        error: null
                    };

                    data = [...data, item];
                });

                setServices(() => data);
            } else {

            }
        }));
    }

    const saveServices = (): void => {
        setShowConfirm(false);
        setLoadingAlert(true);
        let data: Service[] | [] = [];
        services.forEach(item => {
            item.price = item.price !== null && item.price.toString() !== "" && !(Number.isNaN(Number(item.price.toString()))) ? item.price * 100 : 0;
            data = [...data, item];
        });

        dispatch(putSupportOrdersFinishOrder(props.id, services, (result: string, response: any) => {
            if (result === 'success') {
                setLoadingAlert(false);
                setSuccessMessage(true);
            } else {
                setLoadingAlert(false);
                if(response.hasOwnProperty('errors')){
                    Object.keys(response.errors).forEach(item=>{
                        const a = item.split('.');
                        services.forEach((v:any,i:number)=>{
                            if(i === Number(a[1])){
                                services[i].error = {...services[i].error, [a[2]]:"error"};
                            }
                        });
                    });
                }
                setCallAlert(true);
            }
        }));
    };

    const handleSuccessPopup = () => {
        setSuccessMessage(false);
        props.reloadData();
    }

    useEffect(() => {
        if (props.show) {
            setShow(true);
            fetchServices(props.id);
        }
    }, [props.show]);

    useEffect(() => {
        let total = 0;
        services.forEach(item => total+= (item.amount!==null ? item.amount : 0) * (item.price !== null && item.price.toString() !== "" && !(Number.isNaN(Number(item.price.toString()))) ? parseFloat(item.price.toString()) : 0));

        setTotalPrice(total);
    }, [services]);

    const validateService = (): boolean => {
        return !(services.filter((service: Service) => {
                return service.service_id && service.name && service.price && service.amount && !service.error
            }).length === services.length);
    }

    return (
        <div>
            <Modal isOpen={show}
                   toggle={toggleModal}
                   className="modal-align"
            >
                <ModalHeader toggle={toggleModal} >
                    <IntlMessages id={'services.finishOrder'} />: { props.id }
                </ModalHeader>
                <ModalBody>
                    {
                        services.length < 1 &&
                        <div className="alert alert-warning alert-dismissible fade show">
                            <strong>Warning!</strong> The services are required.
                        </div>
                    }

                    <div className={'p-l-r-20'}>
                        <Row className="model-service-head border rounded mb-2 p-1 align-items-center">
                            <div className="col-sm-6 align-middle"><b><IntlMessages id={'services.name'} /></b></div>
                            <div className="col-sm-2"><b><IntlMessages id={'services.amount'} /></b></div>
                            <div className="col-sm-2"><b><IntlMessages id={'services.price'} /></b></div>
                            <div className="col-sm-2 align-items-center mt-1"/>
                        </Row>
                    </div>
                    <div className="max-height-300 p-l-r-20">
                        {
                            services && <OrderService abilities={props.abilities} selectedServices={services} delete={deleteRow} changeData={changeServiceData}/>
                        }
                    </div>
                    <Row className="align-items-end">
                        <Col sm={10} className="text-right">Total Price: €{totalPrice}</Col>
                        <Col sm={2}>
                            <Button size="small"
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                                    color="primary"
                                    onClick={addRow}
                            >
                                Add Row
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-light-green text-white"
                            color="primary"
                            onClick={cancelOrder}>
                        Cancel Order
                    </Button>
                    <Button size="small"
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                            color="primary"
                            onClick={finishOrder}
                            disabled={services.length ? validateService() : true}
                    >
                        Finish Order
                    </Button>
                </ModalFooter>
            </Modal>
            <SweetAlert show={showConfirm}
                        warning
                        showCancel
                        confirmBtnText="Yes"
                        cancelBtnText="cancel"
                        cancelBtnBsStyle="default"
                        confirmBtnBsStyle="success"
                        showLoaderOnConfirm={true}
                        onConfirm={() => saveServices()}
                        onCancel={() => setShowConfirm(false)}>
                {<IntlMessages id="sweetAlerts.finishOrderWarning"/>}
            </SweetAlert>
            <SweetAlert show={successMessage}
                        success
                        confirmBtnText="Great"
                        onConfirm={handleSuccessPopup}
                        title="Success">
                {<IntlMessages id="sweetAlerts.finishOrderSuccess"/>}
            </SweetAlert>
            <SweetAlert show={loadingAlert}
                        showConfirm={false}
                        closeOnClickOutside={false}
            > Loading...</SweetAlert>
            <AlertPopUp show={callAlert}
                        title={<IntlMessages id="sweetAlerts.FeedbackError"/>}
                        warning={true}
                        onConfirm={() => setCallAlert(false)}
            />
        </div>
    );
}

export default OrderServices;
