import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';

import { ICreateAbilitiesPromptProps } from "./Interface/CreateAbilitiesPromptInterface";

class CreateAbilitiesPrompt extends React.Component<ICreateAbilitiesPromptProps> {

 render() {
  const { show, title, ...rest } = this.props;

  return (
   <SweetAlert show={show} {...rest}
    cancelBtnBsStyle="default"
    title={title}
   >
    <div className="mx-5 mt-4">
     <form className="row" noValidate autoComplete="off">
      <div className="col-12">
       <TextField
        label="Ability Name"
        margin="normal"
        fullWidth
        type="text"
        name="ability_name"
        id="abilityName"
        onChange={(e) => this.props.handleAbility(e)}
       />
      </div>

      <div className="col-12">
       <TextField
        label="Ability Description"
        // placeholder="Minimum 30 characters"
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

export default CreateAbilitiesPrompt;
