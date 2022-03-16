import React, {useEffect, useState} from 'react';
import {
	Alert,
	Card,
	CardBody,
	CardText,
	CardTitle,
	Col,
	Row,
	Spinner
} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import ContainerHeader from '../ContainerHeader';
import IntlMessages from '../../util/IntlMessages';
import {
	IEmployeeAccountOverviewProps,
	ICheckedObj
} from './Interface/EmployeeAccountOverviewInterface';
import {
	Fab,
	FormControl,
	Grid,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Button,
	Switch
} from "@material-ui/core";

import {
	createSoftPhoneCredential,
	deleteAdminEmployeeAction,
	deleteSoftPhoneCredentialAction,
	getAdminEmployeeCredentialAction,
	getAdminEmployeeDetailAction,
	getAdminEmployeePermissionAction
} from "../../actions/Actions/AdminEmployeeActions";
import AddIcon from '@material-ui/icons/Add';
import {
	CREATE_AGENT_CONNECTION_CREDENTIALS,
	DELETE_AGENT_CONNECTION_CREDENTIALS,
	SHOW_AGENTS_CREDENTIALS
} from "../../rbac/abilities.constants";
import RBACContext from "../../rbac/rbac.context";
import CreateCredentialPrompt from "./createCredentialPrompt";
import AlertPopUp from "../../common/AlertPopUp";
import {Cancel} from "@material-ui/icons";

const EmployeeAccountOverview: React.FC<IEmployeeAccountOverviewProps> = (props) => {

	const dispatch = useDispatch();

	const AdminEmployeeState = useSelector((state: any) => state.adminEmployeeState);

	const [checked, setChecked] = useState<any>([]);
	const [credentialPrompt, setCredentialPrompt] = useState<boolean>(false);
	const [alertVisible, setAlertVisible] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<string>('');
	const [alertMsg, setAlertMsg] = useState<string>('');

	const [showPopUpValue, setShowPopUpValue] = useState<boolean>(false);
	const [warningValue, setWarningValue] = useState<boolean>(false);
	const [successValue, setSuccessValue] = useState<boolean>(false);
	const [errorCode, setErrorCode] = useState<string>('');

	const [permissionList, setPermissionList] = useState<any>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [whatToDelete, setWhatToDelete] = useState<string>('');
	const [deleteId, setDeleteId] = useState<string>('');

	const [searchPermission, setSearchPermission] = useState('');

	const onDismiss = () => {
		setAlertType('');
		setAlertMsg('');
		setAlertVisible(false)
	};

	/**
	 * handle page change event
	 * @param event
	 * @param page
	 */
	const handleChangePage = (event: any, page: any) => {
		setPage(page);
	};

	/**
	 * handle Per Page change event
	 * @param event
	 */
	const handleChangeRowsPerPage = (event: any) => {
		setRowsPerPage(event.target.value);
	};

	useEffect(() => {
		dispatch(getAdminEmployeeDetailAction(props.match.params.id));
		if (!Boolean(permissionList.length)) {
			dispatch(getAdminEmployeePermissionAction())
		}
		dispatch(getAdminEmployeeCredentialAction(props.match.params.id));
	}, []);

	useEffect(() => {
		if (AdminEmployeeState.employeeData) {
			setChecked(AdminEmployeeState.employeeData.permissions)
		}
	}, [AdminEmployeeState.employeeData]);

	/**
	 * setting permission list in local state
	 */
	useEffect(() => {
		if (searchPermission.length === 0 && Boolean(AdminEmployeeState.permissionList.length)) {
			setPermissionList(AdminEmployeeState.permissionList)
		}
	}, [AdminEmployeeState.permissionList])

	useEffect(() => {
		if (Boolean(permissionList.length)) {
			if (searchPermission) {
				const searched = permissionList.filter((permission: any) => permission.title && permission.title.includes(searchPermission));
				setPermissionList(searched)
			} else {
				setPermissionList(AdminEmployeeState.permissionList);
			}
		}
	}, [searchPermission]);

	const searchBoxChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchPermission(event.target.value);
	};

	const handleToggle = (value: ICheckedObj) => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}
		setChecked(newChecked);
	};

	const deleteEmployeePopUpHandler = (deleteField: string, id: string) => {
		setWhatToDelete(deleteField)
		setDeleteId(id)
		setShowPopUpValue(true)
		setWarningValue(true)
	}

	const handleOnConfirmButton = () => {
		if (warningValue) {
			setShowPopUpValue(false)
			if (whatToDelete === 'softphone') {
				dispatch(deleteSoftPhoneCredentialAction(props.match.params.id, AdminEmployeeState.employeeData.id, deleteId, (status: boolean, msg: string) => {
					if (status) {
						setWarningValue(false);
						setSuccessValue(true);
					} else {
						setWarningValue(false)
						setErrorCode(msg)
					}
					setShowPopUpValue(true)
				}))
			} else if (whatToDelete === 'employee') {
				dispatch(deleteAdminEmployeeAction(props.match.params.id, (status: boolean, msg: string) => {
					if (status) {
						setWarningValue(false);
						setSuccessValue(true);
					} else {
						setWarningValue(false)
						setErrorCode(msg)
					}
					setShowPopUpValue(true)
				}))
			}
		} else if (successValue) {
			if (whatToDelete === 'employee') {
				props.history.goBack();
			}
			setShowPopUpValue(false)
			setSuccessValue(false)
		} else {
			setShowPopUpValue(false)
		}
		setErrorCode('')
	}

	const handleOnCancelButton = () => {
		setShowPopUpValue(false);
		setWarningValue(false);
		setSuccessValue(false);
		setErrorCode('');
	}

	const handleTitle = () => {
		if (warningValue) {
			return <IntlMessages id="sweetAlerts.deleteEmployeeWarning"/>
		} else if (successValue) {
			return whatToDelete === 'employee' ? <IntlMessages id="sweetAlerts.deleteEmployeeSuccess"/> :
				<IntlMessages id="sweetAlerts.deleteSoftPhoneSuccess"/>
		} else {
			return <IntlMessages id="sweetAlerts.deleteEmployeeError"/>
		}
	}

	const convertStringToPassword = (password: string) => {
		let pass = '';
		for (let i = 0; i < password.length; i++) {
			pass += '*';
		}
		return pass;
	}

	const saveCredential = (extension: string, password: string) => {
		setCredentialPrompt(false)
		let data = {
			agent_id: props.match.params.id,
			extension: extension,
			password: password,
		}
		dispatch(createSoftPhoneCredential(data, () => {
			setAlertType('primary')
			setAlertMsg('Loading....')
			setAlertVisible(true)
		}, (status, response) => {
			setAlertType(status ? 'success' : 'warning')
			setAlertMsg(response)
			setAlertVisible(true)
		}))
	}

	return (
		<div>
			<ContainerHeader
				title={<div><IntlMessages id="breadCrumbBar.employeeOverview"/><span className="ml-5"><Button
					onClick={() => deleteEmployeePopUpHandler('employee', '')}
					variant="contained"
					className="jr-btn bg-blue-grey text-white"><IntlMessages
					id="employeesOverview.deleteButton"/></Button></span></div>}
				match={props.match}/>
			<Card>
				<CardBody>
					<CardText>
						{AdminEmployeeState.employeeLoading && !AdminEmployeeState.employeeError && <Row>
                <Col sm={{size: 1, offset: 5}}>
                    <Spinner className="float-right spinner" color="primary"/>
                </Col>
            </Row>}
						{!AdminEmployeeState.employeeLoading && AdminEmployeeState.employeeError && <Row>
                <Col sm={{size: 4, offset: 3}}>
                    <h2>{AdminEmployeeState.employeeError}</h2>
                </Col>
            </Row>}
						<div className='manage-margin d-flex justify-content-between'>
							{!AdminEmployeeState.employeeLoading && !AdminEmployeeState.employeeError && <div>
                  <h4><b><IntlMessages id="employeeAccountOverview.firstName"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.first_name}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.lastName"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.last_name}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.alias"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.alias}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.salutation"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.salutation}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.email"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.email}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.phone"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.phone}</h4>
                  <h4><b><IntlMessages id="employeeAccountOverview.roles"/>:&nbsp;
                  </b>{AdminEmployeeState.employeeData.roles && AdminEmployeeState.employeeData.roles.toString()}</h4>
              </div>}
						</div>
					</CardText>
				</CardBody>
			</Card>
			<Row>
				<Col sm={{size: 6}}>
					<Card style={{marginBottom: 50}}>
						<CardBody>
							<CardTitle>
								<div className="clearfix" style={{padding: '.5rem'}}>
									<b className="float-left"><IntlMessages id="employeeAccountOverview.permissions"/>:</b>
									<FormControl className="mb-3 float-right">
										<InputLabel htmlFor="search_permission"><IntlMessages
											id={'searchPermissionLabel'}/></InputLabel>
										<Input
											id="search_permission"
											type='text'
											value={searchPermission}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => searchBoxChanged(event)}
											endAdornment={
												<InputAdornment position="end">
													{searchPermission.length ?
														<IconButton
															aria-label="toggle password visibility"
															onClick={() => setSearchPermission('')}
														>
															<Cancel/>
														</IconButton> : null}
												</InputAdornment>
											}
										/>
									</FormControl>
								</div>
							</CardTitle>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell><b>Name</b></TableCell>
										<TableCell><b>Action</b></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Boolean(permissionList.length) && !AdminEmployeeState.permissionListLoading && !AdminEmployeeState.permissionListError && permissionList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((permission: any) => {
										return (
											<TableRow>
												<TableCell>{permission.title}</TableCell>
												<TableCell>
													<Switch
														classes={{
															checked: 'text-secondary',
															// bar: 'bg-secondary',
														}}
														onClick={() => handleToggle(permission)}
														checked={Boolean(checked.length) && checked.findIndex((item) => item.id === permission.id) > -1}
													/>
												</TableCell>
											</TableRow>
										)
									})}
									{AdminEmployeeState.permissionListLoading && !AdminEmployeeState.permissionListError &&
                  <TableRow>
                      <TableCell colSpan={2}>
                          <Col sm={{size: 1, offset: 5}}>
                              <Spinner className="spinner" color="primary"/>
                          </Col>
                      </TableCell>
                  </TableRow>
									}
									{!AdminEmployeeState.permissionListLoading && AdminEmployeeState.permissionListError &&
                  <TableRow>
                      <TableCell colSpan={2}>
                          <Col sm={{size: 4, offset: 3}}>
                              <h2>{AdminEmployeeState.permissionListError}</h2>
                          </Col>
                      </TableCell>
                  </TableRow>
									}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TablePagination
											count={permissionList.length}
											rowsPerPage={rowsPerPage}
											page={page}
											onChangePage={handleChangePage}
											onChangeRowsPerPage={handleChangeRowsPerPage}
											labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
										/>
									</TableRow>
								</TableFooter>
							</Table>
						</CardBody>
					</Card>
				</Col>
				<Col sm={{size: 6}}>
					<RBACContext.Consumer>
						{({userCan, abilities}: any) => (
							<>
								<Alert color={alertType} isOpen={alertVisible} toggle={onDismiss}>
									{alertMsg}
								</Alert>
								{userCan(abilities, SHOW_AGENTS_CREDENTIALS) &&
                <Card>
                    <CardBody>
                        <CardTitle>
                            <div className="clearfix">
                                <b><IntlMessages id="softPhoneCredential"/></b>
															{userCan(abilities, CREATE_AGENT_CONNECTION_CREDENTIALS) &&
                              <Fab
                                  className={"float-right"}
                                  color="primary"
                                  aria-label="add"
                                  onClick={() => setCredentialPrompt(true)}>
                                  <AddIcon/>
                              </Fab>
															}
                            </div>
                        </CardTitle>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b><IntlMessages id="extension"/></b></TableCell>
                                    <TableCell><b><IntlMessages id="password"/></b></TableCell>
                                    <TableCell><b><IntlMessages id="companiesTable.action"/></b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
															{Boolean(AdminEmployeeState.softPhoneCredentials.length) && !AdminEmployeeState.softPhoneCredentialsLoading && !AdminEmployeeState.softPhoneCredentialsError &&
															AdminEmployeeState.softPhoneCredentials.map((credential: any) =>
																<TableRow>
																	<TableCell className={"TableCell"}>{credential.extension}</TableCell>
																	<TableCell
																		className={"TableCell"}>{convertStringToPassword(credential.password)}</TableCell>
																	<TableCell>
																		<Button variant="outlined" color="secondary" disabled={!userCan(abilities, DELETE_AGENT_CONNECTION_CREDENTIALS)}
																						onClick={() => deleteEmployeePopUpHandler('softphone', credential.id)}>
																			<IntlMessages id={"sweetAlerts.Delete"}/>
																		</Button>
																	</TableCell>
																</TableRow>
															)}
															{!Boolean(AdminEmployeeState.softPhoneCredentials.length) && AdminEmployeeState.softPhoneCredentialsError && !AdminEmployeeState.softPhoneCredentialsLoading &&
                              <TableRow>
                                  <TableCell colSpan={3} align={"center"} size={"medium"} variant={"head"}>
																		{AdminEmployeeState.softPhoneCredentialsError}
                                  </TableCell>
                              </TableRow>
															}
															{!Boolean(AdminEmployeeState.softPhoneCredentials.length) && !AdminEmployeeState.softPhoneCredentialsError && AdminEmployeeState.softPhoneCredentialsLoading &&
                              <TableRow>
                                  <TableCell colSpan={3} align={"center"} size={"medium"} variant={"head"}>
                                      <Spinner color="primary" className={"spinner"}/>
                                  </TableCell>
                              </TableRow>
															}
															{!Boolean(AdminEmployeeState.softPhoneCredentials.length) && !AdminEmployeeState.softPhoneCredentialsError && !AdminEmployeeState.softPhoneCredentialsLoading &&
                              <TableRow>
                                  <TableCell colSpan={3} align={"center"} size={"medium"} variant={"head"}>
                                      <IntlMessages id={"error404"}/>
                                  </TableCell>
                              </TableRow>
															}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
								}
							</>
						)}
					</RBACContext.Consumer>
				</Col>
			</Row>

			<CreateCredentialPrompt
				show={credentialPrompt}
				title={<IntlMessages id="credentialPrompt.createCredential"/>}
				showOk
				showCancel
				confirmBtnText={<IntlMessages id="sweetAlerts.submitButton"/>}
				onConfirm={saveCredential}
				onCancel={() => setCredentialPrompt(false)}
				disabled={false}
			/>

			<AlertPopUp
				show={showPopUpValue}
				message={errorCode && errorCode}
				title={handleTitle()}
				success={successValue}
				warning={warningValue}
				showOk
				showCancel={warningValue}
				confirmBtnText={<IntlMessages id="sweetAlerts.okButton"/>}
				onConfirm={handleOnConfirmButton}
				onCancel={handleOnCancelButton}
			/>
		</div>
	);
}

export default EmployeeAccountOverview;

