import React, {Component} from 'react';
import {Stepper, Step, StepLabel, StepContent, Button, Paper, Typography} from '@material-ui/core';

import VehiclesStep1 from './Step1';
import VehiclesStep2 from './Step2';
import VehiclesStep3 from './Step3';
import VehiclesStep4 from './Step4';
import {vehicleSteps} from '../stepsTitle'
import {connect} from "react-redux";

import {RESET_ORDER} from "../../../constants/ActionTypes";
import { withRouter } from 'react-router-dom';
import { 
	IVehiclesStepperProps, 
	IVehicleStepperState, 
	IRootvehicleStepperState 
} from './Interface/IndexInterface';
import IntlMessages from '../../../util/IntlMessages';

class VehiclesStepper extends Component<IVehiclesStepperProps, IVehicleStepperState> {

    /**
     * state to handle active step
     */
    state = {
        activeStep: 0,
        orderId: this.props.match.params.id ? this.props.match.params.id : 0,
        stepHeading: [],
        additional_services_text: ''
    };

    componentDidMount(){
        console.log("location in Vehicle stepper", this.props);
    }
    /**
     * go to next step handler
     */
    handleNext = () => {
    console.log('this.props------', this.props);

        this.setState({
            activeStep: this.state.activeStep + 1
        });
    };

    /**
     * go to previous step handler
     */
    handleBack = () => {
    console.log('this.props--back----', this.props);

        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    };

    /**
     * step reset handler
     */
    handleReset = () => {
        if (this.props.orderState) {
            if (this.props.orderState.orderSubmitResposne.id) {
                const orderId = this.props.orderState.orderSubmitResposne.id;
                this.props.resetOrderService();
                this.props.history.push(`/support/orders/${orderId}`)
            }
        }
    };

    /**
     * render steps
     */
    getStepContent = (step: number, activeStep: number, steps: string[], handleNext: () => void, handleBack: () => void) => {
        switch (step) {
            case 0:
                return (
                    <VehiclesStep1 handleOrderReset={this.handleOrderId} activeStep={activeStep} steps={steps} handleNext={handleNext} handleBack={handleBack}
                                   orderId={this.state.orderId} onHeadingChange={this.changeHeading} />);
                                   case 1:
                return (<VehiclesStep2 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                                          handleBack={handleBack} onHeadingChange={this.changeHeading} additional_services_text={this.state.additional_services_text} setAdditionalText={this.setAdditionalText} />);
                               case 2:
                return (<VehiclesStep3 activeStep={activeStep} steps={steps} handleNext={handleNext} orderId={this.state.orderId}
                                       handleBack={handleBack} onHeadingChange={this.changeHeading}/>);
            case 3:
                return (<VehiclesStep4 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                       handleBack={handleBack}/>);
            default:
                return 'Unknown step';
        }
    };

    changeHeading = (text: string, id: number) => {
        const headings: any = {...this.state.stepHeading}
        headings[id] = text;
        this.setState({
            ...this.state,
            stepHeading: headings,
        })
    };

    setAdditionalText = (value: string) => {
        console.log('value-----', value);
        this.setState({...this.state, additional_services_text : value});
    };

    handleOrderId = (searchValue: string) => {
        this.props.history.push(`/support/orders/${searchValue}/edit`);
    };

    returnToQueue = () => {
        const queueId = new URLSearchParams(this.props.location.search).get("queue_id")
        if (queueId) {
            this.props.history.push(`/support/call-queues/${queueId}/process-queue`);
        }
    };

    labelClick = (index: number) => {
        if (index < this.state.activeStep) {
            this.setState({...this.state, activeStep: index})
        }
    };

    render() {
        const {activeStep} = this.state;
        return (
            <div className="w-100">
                <Stepper activeStep={activeStep} orientation="vertical">
                    {vehicleSteps.map((label: string, index: number) => {
                        return (
                            <Step key={label}>
                                <StepLabel
                                    onClick={() => this.labelClick(index)}
                                >
                                    <IntlMessages id={label} defaultMessage={label} />
                                    <Typography>{this.state.stepHeading[index]}</Typography>
                                </StepLabel>
                                <StepContent className="pb-3">
                                    <Typography>{this.getStepContent(index, activeStep, vehicleSteps, this.handleNext, this.handleBack)}</Typography>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === vehicleSteps.length && (
                    <Paper square elevation={0} className="p-2">
                        <Typography>Order Submitted Successfully.</Typography>
                        <Button onClick={this.handleReset} className="jr-btn">
                            View Order
                        </Button>
                        {new URLSearchParams(this.props.location.search).get("source") === "queues" ?
                        <Button onClick={this.returnToQueue} className="jr-btn">
                            Return to Queue
                        </Button> : null}
                    </Paper>
                )}
            </div>
        );
    }
}

/**
 * State of orderCreate Reducer
 */
const mapStateToProps = (state: IRootvehicleStepperState) => {
	return {
		orderState: state.orderState.orderCreate.orderDetails,
	}
};

/**
 * dispatch actions
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        /**
         * reset orderCreate state handler
         */
        resetOrderService: () => dispatch({type: RESET_ORDER}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VehiclesStepper));