import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import IntlMessages from '../../util/IntlMessages';
import { IServiceDissociationPromptProps } from './Interface/IndexInterface';
import { getServicePointDissociationReason } from 'actions/Actions/OrderActions';

const reasonFields = ['notify_customer', 'notify_service_point', 'move_to_processing'];
const commonOptions = [
    {
        name: 'yes',
        value: 1
    },
    {
        name: 'no',
        value: 0
    }
] 

class ServiceDissociationPrompt extends React.Component<IServiceDissociationPromptProps> {

    
    render() {
        const { show, actionError,title, ...rest } = this.props;
        // console.log('show, ', title);
        return (
            <SweetAlert show={show} {...rest}
                showCancel
                cancelBtnBsStyle="default"
                title={<IntlMessages id={`${title}`} />}
            >

                <div className="mx-5">
                    {this.props.reasons && 
                        <FormControl className="w-100 mb-2 position-relative" error={actionError}>
                            <InputLabel id="demo-simple-select-label">
                                <IntlMessages id={`dissociation.popup.label.reason_id`} />
                                {/* Reason */}
                            </InputLabel>
                            <Select
                                defaultValue={''}
                                name={'reason_id'}
                                labelId="demo-simple-select-label"
                                onChange={this.props.handleChange}
                                input={<Input id={'reason'} />}>
                                        <MenuItem value={''} disabled />
                                        {this.props.reasons.length && this.props.reasons.map(reason => (
                                            <MenuItem key={reason.id} value={reason.id}>
                                            {reason.name}
                                            </MenuItem> 
                                        ))}                        
                            </Select>
                        </FormControl>
                    }
                    {reasonFields.map((field, fieldsIndex) => (
                        <FormControl key={fieldsIndex} className="w-100 mb-2 position-relative">
                            <InputLabel id="demo-simple-select-label">
                                <IntlMessages id={`dissociation.popup.label.${field}`} />
                                {/* {field} */}
                            </InputLabel>
                            <Select
                                defaultValue={field==='move_to_processing' ? 0 : 1}
                                name={field}
                                labelId="demo-simple-select-label"
                                onChange={this.props.handleChange}
                                input={<Input id={field} />}>
                                <MenuItem value={''} disabled />
                                    {commonOptions.map((option, optionIndex) => (
                                        <MenuItem value={option.value} key={optionIndex}>
                                            <IntlMessages id={`button.${option.name}`} />
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    ))}            
                </div>
            </SweetAlert >
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        getServicePointDissociationReason: (type: string) => dispatch(getServicePointDissociationReason(type)),
    }
}

const mapStateToProps = (state: any) => ({
    reasons: state.orderState.service_point_dissociation.reason
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDissociationPrompt);


