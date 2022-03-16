import React, {Component} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CouriersStep1 from './Step1';
import CouriersStep2 from './Step2';
import CouriersStep3 from './Step3';
import CouriersStep4 from './Step4';
import CouriersStep5 from './Step5';
import {courierSteps} from '../stepsTitle'
import {RESET_ORDER} from "../../../constants/ActionTypes";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

import {
    ICourierStepperProps,
    ICourierStepperState,
} from './Interface/IndexInterface';
import IntlMessages from "../../../util/IntlMessages";

class CouriersStepper extends Component<ICourierStepperProps, ICourierStepperState> {

    state = {
        activeStep: 0,
        orderId: this.props.match.params.id ? this.props.match.params.id : 0,
        stepHeading: [],
        additional_services_text: '',
        comments_to_courier: ''
    };

    handleNext = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        });
    };

    handleBack = () => {
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

    getStepContent = (step: any, activeStep: any, steps: any, handleNext: any, handleBack: any) => {
        switch (step) {
            case 0:
                return (
                    <CouriersStep1 activeStep={activeStep} handleOrderReset={this.handleOrderId} steps={steps} handleNext={handleNext}
                                   handleBack={handleBack} orderId={this.state.orderId} onHeadingChange={this.changeHeading}/>);
            case 1:
                return (
                    <CouriersStep2 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                   handleBack={handleBack} onHeadingChange={this.changeHeading}/>);
            case 2:
                return (
                    <CouriersStep3 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                   handleBack={handleBack} onHeadingChange={this.changeHeading} additional_services_text={this.state.additional_services_text}
                                   setAdditionalText={this.setAdditionalText}  comments_to_courier={this.state.comments_to_courier} setCommentCourier={this.setCommentCourier} />);
            case 3:
                return (
                    <CouriersStep4 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                   handleBack={handleBack} onHeadingChange={this.changeHeading}/>);
            case 4:
                return (
                    <CouriersStep5 activeStep={activeStep} steps={steps} handleNext={handleNext}
                                   handleBack={handleBack}/>);
            default:
                return 'Unknown step';
        }
    }

    changeHeading = (text: string, id: number) => {
        const headings: any = {...this.state.stepHeading}
        headings[id] = text;
        this.setState({
            ...this.state,
            stepHeading: headings,
        })
    };

    setAdditionalText = (value : string) => {
        this.setState({
            ...this.state,
            additional_services_text: value
        })
    }

    setCommentCourier = (value : string) => {
        this.setState({
            ...this.state,
            comments_to_courier: value
        })
    }

    handleOrderId = (searchValue: string) => {
        this.props.history.push(`/support/orders/${searchValue}/edit`)
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
                    {courierSteps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel
                                    onClick={() => this.labelClick(index)}
                                >
                                    <IntlMessages id={label} defaultMessage={label} />
                                    <Typography>{this.state.stepHeading[index]}</Typography>
                                </StepLabel>
                                <StepContent className="pb-3">
                                    <Typography>{this.getStepContent(index, activeStep, courierSteps, this.handleNext, this.handleBack)}</Typography>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === courierSteps.length && (
                    <Paper square elevation={0} className="p-2">
                        <Typography>Order Submitted Successfully.</Typography>
                        <Button onClick={this.handleReset} className="jr-btn">
                            View Order
                        </Button>
                    </Paper>
                )}
            </div>
        );
    }
}

/**
 * State of orderCreate Reducer
 */
const mapStateToProps = (state: any) => {
    return {
        orderState: state.orderState.orderCreate.orderDetails,
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        resetOrderService: () => dispatch({type: RESET_ORDER}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CouriersStepper));