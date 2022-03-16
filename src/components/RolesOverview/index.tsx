import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Button } from 'reactstrap';
import { Card, CardBody, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InfiniteScroll from 'react-infinite-scroll-component';

import axios from './../../util/Api';
import AlertPopUp from './../../common/AlertPopUp/index';
import ContainerHeader from './../../components/ContainerHeader/index';
import IntlMessages from './../../util/IntlMessages';
import CreateRolePrompt from './CreateRolePrompt';
import {
    setRole,
    setDescription,
    checkSubmitButtonStatus,
    createRolePopUpTrue,
    createRolePopUpFalse,
    successValueFalse,
    warningValueFalse,
    alertPopUpValueFalse,
    triggerSubmitForm,
    getRoleTable,
    fetchRoleTable,
    deleteRoleTableData
} from '../../actions/Actions/RoleActions';
import {
    selectButtonStatus,
    selectRoleData,
    selectCreateRolePopup,
    selectWarningValue,
    selectSuccessValue,
    selectAlertPopUpValue,
    selectErrorMessage,
    selectisRoleLoading
} from './../../selectors/RoleSelectors';
import { IRolesOverviewProps, IRolesOverviewState } from './Interface/IndexInterface';

class RolesOverview extends Component<IRolesOverviewProps, IRolesOverviewState> {

    constructor(props: IRolesOverviewProps) {
        super(props);
        this.state = {
            limit: 25,
            page: 1,
            deleteActionPopup: false,
            deleteMessage: null,
            deleteWarningValue: false,
            deleteSuccessValue: false,
            deleteId: "",
            alertTitle: null,
            showCancel: false,
            readyForCall: false
        }
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.state.limit && this.state.page && this.props.getRoleTable(this.state.limit, this.state.page);
    }

    createRolePopUpHandler = () => {
        this.props.createRolePopUpTrue();
    }

    handleRole = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.props.setRole(e.currentTarget.value);
        this.props.checkSubmitButtonStatus();
    }

    handleDescription = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.props.setDescription(e.currentTarget.value);
        this.props.checkSubmitButtonStatus();
    }

    onConfirmRolePopUp = (e: React.MouseEvent<HTMLElement>) => {
        this.props.createRolePopUpFalse();
        this.submitForm();
    }

    onCancelRolePopUp = () => {
        this.props.createRolePopUpFalse();
        this.props.successValueFalse();
        this.props.warningValueFalse();
    }

    submitForm = () => {
        this.props.triggerSubmitForm();
    }

    closeAlertPopUp = () => {
        this.props.alertPopUpValueFalse();
    }

    fetchData() {
        this.setState({ page: this.state.page + 1 }, () => this.props.fetchRoleTable(this.state.limit, this.state.page))
    }

    deleteRoleWarning = (id: string) => {
        this.setState({ ...this.state, deleteSuccessValue: false, readyForCall: true, showCancel: true, alertTitle: "sweetAlerts.deleteRoleWarning", deleteActionPopup: true, deleteWarningValue: true, deleteId: id }, () => console.log(this.state, 'id from stateee'))
    }

    deleteRolePopupFalse = () => {
        this.setState({ ...this.state, deleteActionPopup: false })
    }

    deleteRole = () => {
        this.setState({ ...this.state, deleteActionPopup: false })
        if (this.state.readyForCall === true) {
            axios.delete(`/system/authorization/roles/${this.state.deleteId}`)
                .then((response) => { this.setState({ ...this.state, readyForCall: false, showCancel: false, deleteWarningValue: false, deleteSuccessValue: true, deleteActionPopup: true, alertTitle: "sweetAlerts.deleteRoleSuccess" }) }, this.props.deleteRoleTableData(this.state.deleteId))
                .catch((error) => { this.setState({ ...this.state, readyForCall: false, showCancel: false, deleteSuccessValue: false, deleteWarningValue: true, deleteActionPopup: true, alertTitle: "sweetAlerts.deleteRoleFailed", deleteMessage: error.response.data.message }) })
        }
    }

    render() {
        const { rawData, loader } = this.props  
        const data = rawData.data
        const meta = rawData.meta
        const tableLoading = loader && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));

        return (
            <div>
                <ContainerHeader match={this.props.match} title={<div><IntlMessages id="admin.roles" /><span className="ml-5"><Button outline color="blue-grey" onClick={this.createRolePopUpHandler} className="jr-btn bg-blue-grey text-white" ><IntlMessages id="roles.createButton" /></Button></span></div>} />

                <div>
                    <Card className={`shadow border-0`} id="order-table">
                        <CardBody>
                            <CardText>
                                <InfiniteScroll
                                    height="60vh"
                                    loader={tableLoading}
                                    dataLength={data && data.length}
                                    next={this.fetchData}
                                    hasMore={meta && meta.has_more_pages}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b><IntlMessages id="infinityScrollBar.noDataLeft" /></b>
                                        </p>
                                    }
                                >
                                    <div className="table-responsive-material">
                                        <table className="default-table table-unbordered table table-sm table-hover">
                                            <thead className="th-border-b">
                                                <tr>
                                                    <th> <IntlMessages id="roleTable.id" /></th>
                                                    <th> <IntlMessages id="roleTable.name" /></th>
                                                    <th> <IntlMessages id="roleTable.description" /></th>
                                                    {/* <th> <IntlMessages id="roleTable.deleteProtection" /></th>
                                                    <th> <IntlMessages id="roleTable.abilities" /></th>
                                                    <th> <IntlMessages id="roleTable.level" /></th>
                                                    <th> <IntlMessages id="roleTable.scope" /></th>
                                                    <th> <IntlMessages id="roleTable.updatedAt" /></th>
                                                    <th> <IntlMessages id="roleTable.createdAt" /></th>
                                                    <th> <IntlMessages id="roleTable.createdAt" /></th> */}
                                                    <th> <IntlMessages id="roleTable.Action" /></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data && data.map((data) => {
                                                    return (
                                                        <tr
                                                            tabIndex={-1}
                                                            key={data.id}
                                                            className="rowHeightt"
                                                        >
                                                            <td>{data.id}</td>
                                                            <td>{data.name}</td>
                                                            <td >{data.description}</td>
                                                            {/*<td >{data.delete_protection}</td>
                                                            <td><div>{data.abilities && data.abilities.map((abilities) => {
                                                            return <div>{abilities.name}</div>
                                                            })}</div></td>
                                                             <td >{data.level}</td>
                                                            <td >{data.scope}</td>
                                                            <td>{updatedAt}</td>
                                                            <td>{createdAt}</td> */}
                                                            <td>
                                                                <Button onClick={() => this.deleteRoleWarning(data.id)} disabled={data.delete_protection} outline color="blue-grey" className="jr-btn bg-blue-grey text-white" ><IntlMessages id="roleTable.deleteButton" /></Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </InfiniteScroll>
                            </CardText>
                        </CardBody>
                    </Card>

                </div>

                <CreateRolePrompt show={this.props.createRolePopup} title={<IntlMessages id="roles.createButton" />}
                    showOk
                    showCancel
                    confirmBtnText={<IntlMessages id="sweetAlerts.submitButton" />}
                    onConfirm={this.onConfirmRolePopUp}
                    onCancel={this.onCancelRolePopUp}
                    disabled={this.props.buttonStatus}
                    handleRole={this.handleRole}
                    handleDescription={this.handleDescription}
                />
                <AlertPopUp show={this.props.alertPopUpValue}
                    message={this.props.message && this.props.message}
                    title={this.props.warningValue ? <IntlMessages id="sweetAlerts.createRoleFailed" /> : <IntlMessages id="sweetAlerts.createRoleSuccess" />}
                    showOk
                    success={this.props.successValue}
                    warning={this.props.warningValue}
                    confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
                    onConfirm={this.closeAlertPopUp}
                />

                <AlertPopUp show={this.state.deleteActionPopup}
                    message={this.state.deleteMessage && this.state.deleteMessage}
                    title={<IntlMessages id={this.state.alertTitle} />}
                    //   title={this.state.deleteMessage == null ? <IntlMessages id="sweetAlerts.deleteRoleFailed" /> : <IntlMessages id="sweetAlerts.deleteRoleSuccess" />}
                    success={this.state.deleteSuccessValue}
                    warning={this.state.deleteWarningValue}
                    showOk
                    showCancel={this.state.showCancel}
                    confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
                    onConfirm={this.deleteRole}
                    onCancel={this.deleteRolePopupFalse}
                />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => ({
    getRoleTable: (limit: number, page: number) => dispatch(getRoleTable(limit, page)),
    fetchRoleTable: (limit: number, page: number) => dispatch(fetchRoleTable(limit, page)),
    setRole: (role: string) => dispatch(setRole(role)),
    setDescription: (description: string) => dispatch(setDescription(description)),
    checkSubmitButtonStatus: () => dispatch(checkSubmitButtonStatus()),
    createRolePopUpTrue: () => dispatch(createRolePopUpTrue()),
    createRolePopUpFalse: () => dispatch(createRolePopUpFalse()),
    successValueFalse: () => dispatch(successValueFalse()),
    warningValueFalse: () => dispatch(warningValueFalse()),
    alertPopUpValueFalse: () => dispatch(alertPopUpValueFalse()),
    triggerSubmitForm: () => dispatch(triggerSubmitForm()),
    deleteRoleTableData: (id: string) => dispatch(deleteRoleTableData(id))
});

const mapStateToProps = createStructuredSelector({
    loader: selectisRoleLoading,
    rawData: selectRoleData,
    buttonStatus: selectButtonStatus,
    createRolePopup: selectCreateRolePopup,
    warningValue: selectWarningValue,
    successValue: selectSuccessValue,
    alertPopUpValue: selectAlertPopUpValue,
    message: selectErrorMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(RolesOverview);
