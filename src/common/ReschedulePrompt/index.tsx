import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import IntlMessages from '../../util/IntlMessages';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from "moment";

import { TIME_SCHEDULES } from "../../constants/common.constants";
import { IReschedulePromptProps, IReschedulePromptState } from "./Interface/IndexInterface";

class ReschedulePrompt extends React.Component<IReschedulePromptProps, IReschedulePromptState> {

    constructor(props: any) {
        super(props);
        this.state = {
            dateValue : moment(new Date("DD-MM-YYYY HH:mm"))
        };
	};

    handleChange = ( e: React.ChangeEvent<{name?: string | undefined; value: unknown; }>): void =>  {        
        if(e.target.value === 'other'){
            this.props.setOther();
        }
        this.props.setTimestamp(e.target.value);
    };

    optionsHandleChange = (e: React.ChangeEvent<{name?: string | undefined; value: unknown; }>): void => {        
        this.props.onChangeHandlerId(e.target.value);
    };

    onChangeSelectedDate = (e: React.ChangeEvent<{name?: string | undefined; value: string; }>): void => {        
        this.setState({ dateValue: e.target.value });
        this.props.setTimestampForOther('other',e.target.value);
    };

    render() {
        const { show, error, ...rest } = this.props;      
         
        return (
            <SweetAlert show={show} {...rest}
                showCancel
                cancelBtnBsStyle="default"
                title={<IntlMessages id="callQueue.reschedule" />}
            >
                <div className="mx-5 mt-4">

                    <FormControl className="w-100 mb-2 position-relative mt-3" error={error && this.props.options}>
                        <InputLabel id="demo-simple-select-label">{<IntlMessages id="callQueue.selectReschedule" />}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            value={this.props.options}
                            onChange={(e) => this.optionsHandleChange(e)}
                            input={<Input id="ageSimple1" />}
                        >
                            <MenuItem value="none" disabled>
                            </MenuItem>

                            {this.props.callQueueOptionDropdownList.map((data) => (
                                <MenuItem value={data.id}>{<IntlMessages id={`${data.name}`} />}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className="w-100 mb-2 position-relative mt-5 mb-4" error={error && this.props.time === null}>
                        <InputLabel id="demo-simple-select-label">{<IntlMessages id="callQueue.selectRescheduleOption" />}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            value={this.props.time}
                            onChange={(e) => this.handleChange(e)}
                            input={<Input id="ageSimple1" />}
                        >
                            <MenuItem value="none" disabled>
                            </MenuItem>
                            <MenuItem value={TIME_SCHEDULES.TOMORROW}>{<IntlMessages id="callQueue.tomorrow" />}</MenuItem>
                            <MenuItem value={TIME_SCHEDULES.TWO_DAYS}>{<IntlMessages id="callQueue.twoDays" />}</MenuItem>
                            <MenuItem value={TIME_SCHEDULES.WEEK}>{<IntlMessages id="callQueue.nextWeek" />}</MenuItem>
                            <MenuItem value={TIME_SCHEDULES.TWO_WEEKS}>{<IntlMessages id="callQueue.twoWeeks" />}</MenuItem>
                            <MenuItem value={TIME_SCHEDULES.MONTH}>{<IntlMessages id="callQueue.nextMonth" />} </MenuItem>
                            <MenuItem value={TIME_SCHEDULES.YEAR}>{<IntlMessages id="callQueue.nextYear" />}</MenuItem>
                            <MenuItem value={TIME_SCHEDULES.OTHER}>{<IntlMessages id="callQueue.other" />}</MenuItem>
                        </Select>
                    </FormControl>

                    {this.props.other ? <FormControl className="w-100 mb-2 position-relative mt-3">
                        <Input
                            type="datetime-local"
							defaultValue={new Date()}
                            value={this.state.dateValue}
                            onChange={(e) => this.onChangeSelectedDate(e)}
						/> 
                    </FormControl> : ''
                    }
                </div>
            </SweetAlert >
        )
    }
}

export default ReschedulePrompt;
