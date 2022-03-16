import React, {useEffect, useState, Fragment} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {cancelOrder,clearCancelOrder} from "actions/Actions/OrderActions";
import {useHistory} from "react-router";

const CancelOrder = (props:any) => {
    const { closePopUp, orderId, overview, getOrders } = props;
    const [selectedItem, setSelectedItem] = useState<boolean>(true);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [successPopup, setSuccessPopup] = useState<boolean>(false);
    const [errorPopup, setErrorPopup] = useState<boolean>(false);
    const history = useHistory();

    const onHandleChange = (value:any) => {
        setSelectedValue(value)
        const cancellation = value !== "without_cancellation_costs" ;
        setSelectedItem(cancellation);
    }

    const dispatch = useDispatch();
    const order = useSelector((state:any) => state.orderState.cancelOrder);
    const onCancelOrder =  (orderId:any) => {
        dispatch(cancelOrder(orderId,selectedItem));
        closePopUp(true);
    };

    const handleSuccessPopUp = () => {
				const { togglePopup } = props;
				togglePopup();
        getOrders();
        dispatch(clearCancelOrder())
        setSuccessPopup(false)
        // if(overview) {
        //     history.goBack();
        // }
    }
    const handleErrorPopUp = () => {
        dispatch(clearCancelOrder())
				togglePopup()
        setErrorPopup(false);
    }

    useEffect(() => {
        if(order && order.success) {
            setSuccessPopup(true);
        } else if (order && order.message){
            setErrorPopup(true);
        }
    },[order]);
		const { togglePopup, showPopUp } = props;
    return (
        <React.Fragment>
				<SweetAlert
					show={showPopUp}
					warning={props.show || errorPopup ? true: false}
					success={successPopup ? true : false}
					showCancel={props.show ? true: false}
					confirmBtnText={props.show ? "Yes" : successPopup ? "Great" : errorPopup ? "danger" : 'Ok'}
					cancelBtnText={props.show ? "cancel" : successPopup ? "Great" : errorPopup ? "Ok" : null}
					cancelBtnBsStyle={props.show ? "default" : ''}
					title={props.show ? "Proceed Cancellation" :
					 successPopup ? "Success" : errorPopup ? "Error" : null}
					onConfirm={() => {
						if (props.show) {
							onCancelOrder(orderId);
						} else if (successPopup) {
							handleSuccessPopUp();
						} else if (errorPopup) {
							handleErrorPopUp();
						}
					}}
					onCancel={() => {
						togglePopup();
						closePopUp(false);
						}}>
					{props.show ? <Fragment>
						Do you want to cancel order ?
						<form className="row" autoComplete="off">
							<div className="col-12">
								<FormControl className="w-100 mb-2">
									<Select
										value={selectedValue}
										onChange={(e) => onHandleChange(e.target.value)}
										displayEmpty
										className="mt-3">
										<MenuItem value="">With cancellation costs</MenuItem>
										<MenuItem value="without_cancellation_costs">Without cancellation costs</MenuItem>
									</Select>
								</FormControl>
							</div>
						</form>
					</Fragment> : successPopup ? <Fragment>Order Canceled Successfully</Fragment> :
					errorPopup ? <Fragment>Something went wrong !</Fragment>: <Fragment>Loading...</Fragment>}
				</SweetAlert>
        </React.Fragment>
    )
}

export default CancelOrder;
