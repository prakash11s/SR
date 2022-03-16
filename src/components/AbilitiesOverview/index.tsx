import React from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ContainerHeader from '../ContainerHeader';
import IntlMessages from 'util/IntlMessages';
import CreateAbilitiesPrompt from './CreateAbilitiesPrompt';
import AlertPopUp from '../../common/AlertPopUp/index';

import {
setAbility,
setDescription,
checkSubmitButtonStatus,
createAbilityPopUpTrue,
createAbilityPopUpFalse,
successValueFalse,
warningValueFalse,
alertPopUpValueFalse,
triggerSubmitForm
} from '../../actions/Actions/AbilityActions';
import {
 selectButtonStatus,
 selectCreateAbilityPopup,
 selectWarningValue,
 selectSuccessValue,
 selectAlertPopUpValue,
 selectErrorMessage
} from '../../selectors/AbilitySelectors';
import { IAbilitiesOverviewProps } from './Interface/IndexInterface';

class AbilitiesOverview extends React.Component<IAbilitiesOverviewProps> {

 createAbilityPopUpHandler = () => {
  this.props.createAbilityPopUpTrue();
 }

 handleAbility = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  this.props.setAbility(e.currentTarget.value);
  this.props.checkSubmitButtonStatus();
 }

 handleDescription = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  this.props.setDescription(e.currentTarget.value);
  this.props.checkSubmitButtonStatus();
 }

 onConfirmAbilityPopUp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  this.props.createAbilityPopUpFalse();
  this.submitForm();
 }

 onCancelAbilityPopUp = () => {
  this.props.createAbilityPopUpFalse();
  this.props.successValueFalse();
  this.props.warningValueFalse();
 }

 submitForm = () => {
  this.props.triggerSubmitForm();
 }

 closeAlertPopUp = () => {
  this.props.alertPopUpValueFalse();
 }

 render() {
  return (
   <div>
    <ContainerHeader match={this.props.match}
                     title={<div><IntlMessages id="admin.abilities"/><span className="ml-5"><Button
                       onClick={this.createAbilityPopUpHandler} variant="contained"
                       className="jr-btn bg-blue-grey text-white"><IntlMessages
                       id="roles.createButton"/></Button></span></div>}    />
    <h1>Abilities Overview Page.. </h1>

    <AlertPopUp
     show={this.props.alertPopUpValue}
     message={this.props.message && this.props.message}
     title={this.props.warningValue ? <IntlMessages id="sweetAlerts.createAbilityFailed" /> : <IntlMessages id="sweetAlerts.createAbilitySuccess" />}
     showOk
     success={this.props.successValue}
     warning={this.props.warningValue}
     confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
     onConfirm={this.closeAlertPopUp}
    />

    <CreateAbilitiesPrompt show={this.props.createAbilityPopup} title={<IntlMessages id="abilitiesPrompt.createAbility" />}
     showOk
     showCancel
     confirmBtnText={<IntlMessages id="sweetAlerts.submitButton" />}
     onConfirm={this.onConfirmAbilityPopUp}
     onCancel={this.onCancelAbilityPopUp}
     disabled={this.props.buttonStatus}
     handleAbility={this.handleAbility}
     handleDescription={this.handleDescription}
    />

   </div>
  );
 }
}

const mapDispatchToProps = (dispatch: any) => ({
 setAbility: (role: string) => dispatch(setAbility(role)),
 setDescription: (description: string) => dispatch(setDescription(description)),
 checkSubmitButtonStatus: () => dispatch(checkSubmitButtonStatus()),
 createAbilityPopUpTrue: () => dispatch(createAbilityPopUpTrue()),
 createAbilityPopUpFalse: () => dispatch(createAbilityPopUpFalse()),
 successValueFalse: () => dispatch(successValueFalse()),
 warningValueFalse: () => dispatch(warningValueFalse()),
 alertPopUpValueFalse: () => dispatch(alertPopUpValueFalse()),
 triggerSubmitForm: () => dispatch(triggerSubmitForm())
});

const mapStateToProps = createStructuredSelector({
 buttonStatus: selectButtonStatus,
 createAbilityPopup: selectCreateAbilityPopup,
 warningValue: selectWarningValue,
 successValue: selectSuccessValue,
 alertPopUpValue: selectAlertPopUpValue,
 message: selectErrorMessage
});


export default connect(mapStateToProps, mapDispatchToProps)(AbilitiesOverview);
