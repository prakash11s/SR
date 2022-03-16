import React, { Component } from 'react';
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { Avatar, CircularProgress, Button } from '@material-ui/core';
import { Card, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import {
  selectEmployeesData,
  selectisTableLoading,
  selectroles, selectedRole,
  selectPhoneCountry,
  selectedIsFormDisabled,
  selectAlertPopUpValue,
  selectSuccessValue,
  selectWarningValue,
  selectErrorMessage
} from './../../selectors/EmployeesSelectors';
import {
  getEmployeesTable,
  setFirstName,
  setLastName,
  setEmail,
  setPhoneCountry,
  setPhone,
  setRole,
  submitNewEmployeeDetails,
  setSubmitButtonStatus,
  cancelAlertPopUp,
  fetchEmployeesTable,
  getCountryCodes
} from '../../actions/Actions/EmployeesActions';
import softPhoneService from './../../components/Phone/softPhone.service';
import CreateEmployeePrompt from './createEmployeePrompt';
import AlertPopUp from './../../common/AlertPopUp/index';
import { IEmployeesTableProps,IEmployeesTableState } from './Interface/IndexInterface';
import SipCallService from "../Phone/SipCallService";

class EmployeesTable extends Component<IEmployeesTableProps, IEmployeesTableState> {
  constructor(props) {
    super(props);
    this.state = {
      limit: 25,
      page: 1,
      employeePopup: false,
      successPopUp: false,
    }
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.props.getCountryCodes();
    this.state.limit && this.state.page && this.props.getEmployeesTable(this.state.limit, this.state.page);
  }

  callPhone = (phoneNumber: string) => {
    SipCallService.startCall(phoneNumber);
    //softPhoneService.connectCall(phoneNumber);
  }

  fetchData() {
    this.setState({ page: this.state.page + 1 }, () => this.props.fetchEmployeesTable(this.state.limit, this.state.page))
  }

  createEmployeePopUpHandler = () => {
    this.setState({ employeePopup: true })
  }

  onConfirmEmployeePopUp = () => {
    this.props.submitNewEmployeeDetails();
    this.setState({ employeePopup: false })
  }

  onCancelEmployeePopUp = () => {
    this.setState({ employeePopup: false })
  }

  hideSuccessPopup = () => {
    this.setState({ successPopUp: false })
  }

  /**
   * Unused code
   */
  // handleChange = (e) => {
  //   const fieldName = e.currentTarget.name;
  //   this.setState(
  //     { [fieldName]: e.currentTarget.value }
  //   );
  //   e.preventDefault()
  // }

  handleFirstName = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setFirstName(e.currentTarget.value)
    this.props.setSubmitButtonStatus()
  }

  handleLastName = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setLastName(e.currentTarget.value)
    this.props.setSubmitButtonStatus()
  }

  handleEmail = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setEmail(e.currentTarget.value)
    this.props.setSubmitButtonStatus()
  }

  handlePhone = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setPhone(e.currentTarget.value)
    this.props.setSubmitButtonStatus()
  }

  handlePhoneCountry = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setPhoneCountry(e.target.value)
    this.props.setSubmitButtonStatus()
  }

  handleRole = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.props.setRole(e.target.value)
    this.props.setSubmitButtonStatus()
  }

  handleAlertPopUp = () => {
    this.props.cancelAlertPopUp()
  }

  render() {
    const { rawData, loader } = this.props
    const data = rawData.data
    const meta = rawData.meta
    const tableLoading = loader && ((<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));

    return (
      <div className="d-flex justify-content-center">
        <div className="col-12 table-container">
          <ContainerHeader title={<div><IntlMessages id="breadCrumbBar.employees" /><span className="ml-5"><Button onClick={this.createEmployeePopUpHandler} variant="contained" className="jr-btn bg-blue-grey text-white" ><IntlMessages id="employeeTables.createEmployee" /></Button></span></div>} match={this.props.match} />
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
                            <th> <IntlMessages id="employeesTable.name" /></th>
                            <th> <IntlMessages id="employeesTable.email" /></th>
                            <th> <IntlMessages id="employeesTable.phone" /></th>
                            <th> <IntlMessages id="employeesTable.roles" /></th>
                            <th> <IntlMessages id="employeesTable.createdAt" /></th>
                            <th> <IntlMessages id="employeesTable.updatedAt" /></th>
                            <th> <IntlMessages id="employeesTable.action" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data.map((data) => {
                            const updatedAt = moment(data.updated_at).format('DD-MM-YYYY, HH:MM:SS')
                            const createdAt = moment(data.created_at).format('DD-MM-YYYY, HH:MM:SS')
                            return (
                              <tr
                                tabIndex={-1}
                                key={data.id}
                              >
                                <td>
                                  <div className="user-profile d-flex flex-row align-items-center">
                                    <Avatar
                                      alt={data.first_name}
                                      src={data.avatar}
                                      className="user-avatar"
                                    >
                                    {data.first_name.charAt(0)}
                                    </Avatar>
                                    <div className="user-detail">
                                      <h5 className="user-name">{`${data.first_name} ${data.last_name}`}</h5>
                                    </div>
                                  </div>
                                </td>
                                <td>{data.email}</td>
                                <td className="underlineElement" onClick={() => this.callPhone(data.phone)}>{data.phone}</td>
                                <td><div>{data.roles && data.roles.map((role) => {
                                  return <div key={role.id}>{role.title}</div>
                                })}</div></td>
                                <td>{updatedAt}</td>
                                <td>{createdAt}</td>
                                <td>
                                  <Link to={`/admin/employees/${data.id}`}><Button variant="contained" className="jr-btn bg-blue-grey text-white" ><IntlMessages id="employeesTable.editButton" /></Button></Link>
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

            <CreateEmployeePrompt
              show={this.state.employeePopup}
              message={<IntlMessages id="sweetAlerts.createEmployee" />}
              title={<IntlMessages id="sweetAlerts.deleteSuccessTitle" />}
              showOk
              showCancel
              confirmBtnText={<IntlMessages id="sweetAlerts.submitButton" />}
              onConfirm={this.onConfirmEmployeePopUp}
              onCancel={this.onCancelEmployeePopUp}
              roles={this.props.roles}
              countryCodes={this.props.phoneCountry}
              handleFirstName={this.handleFirstName}
              handleCountryCode={this.handlePhoneCountry}
              handleLastName={this.handleLastName}
              handleEmail={this.handleEmail}
              handlePhone={this.handlePhone}
              handleRole={this.handleRole}
              role={this.props.role}
              disabled={this.props.isFormDisabled}
            />

            <AlertPopUp show={this.props.alertPopUpValue} message={this.props.message && this.props.message} title={this.props.warningValue ? <IntlMessages id="sweetAlerts.createEmployeeFailed" /> : <IntlMessages id="sweetAlerts.createEmployeeSuccess" />} success={this.props.successValue} warning={this.props.warningValue} showOk
              confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
              onConfirm={this.handleAlertPopUp}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getEmployeesTable: (limit: number, page: number) => dispatch(getEmployeesTable(limit, page)),
  fetchEmployeesTable: (limit: number, page: number) => dispatch(fetchEmployeesTable(limit, page)),
  setFirstName: (firstName: string) => dispatch(setFirstName(firstName)),
  setLastName: (lastName: string) => dispatch(setLastName(lastName)),
  setEmail: (email: string) => dispatch(setEmail(email)),
  setPhone: (phone: string) => dispatch(setPhone(phone)),
  setPhoneCountry: (code: string) => dispatch(setPhoneCountry(code)),
  setRole: (role: string) => dispatch(setRole(role)),
  getCountryCodes: () => dispatch(getCountryCodes()),
  submitNewEmployeeDetails: () => dispatch(submitNewEmployeeDetails()),
  setSubmitButtonStatus: () => dispatch(setSubmitButtonStatus()),
  cancelAlertPopUp: () => dispatch(cancelAlertPopUp())
});

const mapStateToProps = createStructuredSelector({
  rawData: selectEmployeesData,
  loader: selectisTableLoading,
  roles: selectroles,
  role: selectedRole,
  phoneCountry: selectPhoneCountry,
  isFormDisabled: selectedIsFormDisabled,
  alertPopUpValue: selectAlertPopUpValue,
  successValue: selectSuccessValue,
  warningValue: selectWarningValue,
  message: selectErrorMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesTable);
