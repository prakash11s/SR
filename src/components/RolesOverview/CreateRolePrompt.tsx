import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';

import IntlMessages from './../../util/IntlMessages';
import { ICreateRolePromptProps, ICreateRolePromptState } from './Interface/CreateRolePromptInterface';

class CreateRolePrompt extends React.Component<ICreateRolePromptProps, ICreateRolePromptState> {

    render() {
        const { show, ...rest } = this.props;

        return (
            <SweetAlert show={show} {...rest}
                cancelBtnBsStyle="default"
                title={<IntlMessages id="roles.createButton" />}
            >
                <div className="mx-5 mt-4">
                    <form className="row" noValidate autoComplete="off">
                        <div className="col-12">
                            <TextField
                                label="Role Name"
                                margin="normal"
                                fullWidth
                                type="text"
                                name="role_name"
                                id="roleName"
                                onChange={(e) => this.props.handleRole(e)}
                            />
                        </div>

                        <div className="col-12">
                            <TextField
                                label="Role Description"
                                placeholder="Minimum 30 characters"
                                multiline
                                margin="normal"
                                fullWidth
                                onChange={(e) => this.props.handleDescription(e)}
                            />
                        </div>
                    </form>
                </div>
            </SweetAlert >
        )
    }
}

export default CreateRolePrompt;
