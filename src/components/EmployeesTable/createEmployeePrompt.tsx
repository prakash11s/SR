import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';

import IntlMessages from './../../util/IntlMessages';
import { getEmployeeRoles } from '../../actions/Actions/EmployeesActions';

import { ICreateEmployeePromptProps } from './Interface/createEmployeePromptInterface';

class CreateEmployeePrompt extends React.Component<ICreateEmployeePromptProps> {

    componentDidMount(){
        this.props.getEmployeeRoles()
    }

    render() {
        const { show, ...rest } = this.props;                

        return (
            <SweetAlert show={show} {...rest}
                cancelBtnBsStyle="default"
                title={<IntlMessages id="employeeTables.createEmployee" />}
            >
                <div className="mx-5 mt-4">
                    <form className="row" noValidate autoComplete="off">
                        <div className="col-12">
                            <TextField
                                label="First Name"
                                margin="normal"
                                fullWidth
                                type="text"
                                name="first_name"
                                id="firstName"
                                onChange={(e) => this.props.handleFirstName(e)}
                            />
                        </div>
                        <div className="col-12">
                            <TextField
                                label="Last Name"
                                margin="normal"
                                fullWidth
                                type="text"
                                name="last_name"
                                id="lastsName"
                                onChange={(e) => this.props.handleLastName(e)}
                            />
                        </div>
                        <div className="col-12">
                            <TextField
                                label="Email"
                                margin="normal"
                                fullWidth
                                type="email"
                                name="email"
                                id="email"
                                onChange={(e) => this.props.handleEmail(e)}
                            />
                        </div>
                        <div className="col-12 d-flex">
                            <div className="col-4 p-0 mt-3">
                            <FormControl className="w-100">
                                <InputLabel htmlFor="name-multiple">Phone Country</InputLabel>
                                <Select
                                    onChange={this.props.handleCountryCode}
                                >
                                    {this.props.countryCodes.map((code:any) => {
                                        return <MenuItem key={code.id} value={code.calling_code}>{`+${code.calling_code} (${code.code_iso_3166_2})`}</MenuItem>
                                    })}

                                </Select>
                            </FormControl>
                            </div>
                            <div className="col-8 pr-0">
                                <TextField
                                    label="Phone"
                                    margin="normal"
                                    fullWidth
                                    type="number"
                                    name="phone"
                                    id="phone"
                                    onChange={(e) => this.props.handlePhone(e)}
                                />
                            </div>
                        </div>
                        <div className="col-12 mt-3 mb-3">
                            <FormControl className="w-100">
                                <InputLabel htmlFor="name-multiple">Select Role</InputLabel>
                                <Select
                                    multiple
                                    value={this.props.role}
                                    onChange={(e) => this.props.handleRole(e)}
                                >
                                    {this.props.roles.map((role) => {
                                        return <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                    })}

                                </Select>
                            </FormControl>
                        </div>
                    </form>
                </div>
            </SweetAlert >
        )
    }
}

const mapDispatchToProps = (dispatch: any) => ({   
    getEmployeeRoles: () => dispatch(getEmployeeRoles()),   
  });

export default connect(null, mapDispatchToProps)(CreateEmployeePrompt);
