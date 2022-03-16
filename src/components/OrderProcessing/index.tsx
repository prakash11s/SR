import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';

import VehiclesStepper from './VehiclesStepper';
import CouriersStepper from './CouriersStepper';
import DefaultStepper from './DefaultStepper';
import { VEHICLES, COURIERS } from '../../../src/constants/common.constants';
import {
    IOrderProcessingProps,
    IOrderProcessingState,
    IRootOrderProcessingState
} from './Interface/IndexInterface';

class OrderProcessing extends Component<IOrderProcessingProps, IOrderProcessingState> {

    state = {
        uuid: null,
        secret: null
    };

    componentDidMount(){
        if(!localStorage.getItem('uuid') && !localStorage.getItem('secret')){
          const secret = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
          localStorage.setItem('uuid', uuidv1());
          localStorage.setItem('secret', secret)
        }
      }

    render() {
        const { SelectedDepartment } = this.props;
        const DepartmentDecider = () => {
            if (SelectedDepartment && SelectedDepartment['slug']) {
                if (SelectedDepartment['slug'] === VEHICLES) {
                    return <VehiclesStepper {...this.props}/>
                } else if (SelectedDepartment['slug'] === COURIERS) {
                    return <CouriersStepper {...this.props}/>
                } else {
                    return <DefaultStepper {...this.props}/>
                }
            }
        }

        return (
            <div>
                {DepartmentDecider()}
            </div>
        );
    }
}

const mapStateToProps = (state: IRootOrderProcessingState) => {
    return {
        SelectedDepartment: state.department.selectedDepartment
    }
}

export default connect(mapStateToProps, null)(OrderProcessing);
