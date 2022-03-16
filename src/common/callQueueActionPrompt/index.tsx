import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import IntlMessages from '../../util/IntlMessages';
import { ICallQueueActionPromptProps } from './Interface/IndexInterface';

class CallQueueActionPrompt extends React.Component<ICallQueueActionPromptProps> {

    handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        this.props.onChangeHandlerId(e.target.value as string);
    };

    render() {
        const { show, actionError, ...rest } = this.props;
        return (
            <SweetAlert show={show} {...rest}
                showCancel
                cancelBtnBsStyle="default"
                title={<IntlMessages id={`${this.props.title}`} />}
            >

                <div className="mx-5">
                    <FormControl className="w-100 mb-2 position-relative" error={actionError && this.props.options}>
                        <InputLabel id="demo-simple-select-label">{<IntlMessages id={`${this.props.title}Options`} />}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            value={this.props.options}
                            onChange={(e) => this.handleChange(e)}
                            input={<Input id="ageSimple1" />}
                        >
                            <MenuItem value="none" disabled>
                            </MenuItem>

                            {this.props.callQueueOptionDropdownList.map((data) => (
                                <MenuItem key={data.id} value={data.id}>{<IntlMessages id={`${data.name}`} />}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </SweetAlert >
        )
    }
}
export default CallQueueActionPrompt;

