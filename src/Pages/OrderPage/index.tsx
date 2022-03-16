import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardText, CardTitle } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Chip, Input, MenuItem, Select, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import IntlMessages from '../../util/IntlMessages';
import OrderTable from '../../components/OrderTable';
import ContainerHeader from '../../components/ContainerHeader/index';
import axios from '../../util/Api';
import * as AXIOS from '../../util/ApiSecond';
import Loader from 'containers/Loader/Loader';
import AlertPopUp from '../../common/AlertPopUp';
import SearchServicePoint from "./searchServicepoint";
import CancelOrder from "./cancelOrder";
import { setDataList } from 'actions/Actions/OrderPageActions';
import { IStatus } from "../../components/ContainerHeader/Interface/IndexInterface";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import _ from 'lodash';
import {
	SHOW_EMPLOYEES_FILTER
} from "../../rbac/abilities.constants";
import RBACContext from "../../rbac/rbac.context";
import settings from 'reducers/Reducers/Settings';

class OrderPage extends Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			dataList: [],
			metaData: null,
			statuses: [],
			limit: 30,
			isLoading: false,
			showDeleteSuccess: false,
			selectedFilters: [],
			page: 1,
			total: null,
			isTableLoading: false,
			searchServiceModal: false,
			cancelOrderPopUp: false,
			orderId: 0,
			otherDepartmentStatuses: [],
			showCancelPopup: false,
			servicePoints: [],
			servicePointLoader: false,
			selectedServicePointId: [],
			search: "",
			empList: [],
			selectedEmp: undefined
		};

		this.transformData = this.transformData.bind(this);
		this.deleteOrder = this.deleteOrder.bind(this);
		this.hideDeleteSuccessPopup = this.hideDeleteSuccessPopup.bind(this);
		this.toggleSelectedFilters = this.toggleSelectedFilters.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.getOrders = this.getOrders.bind(this);
		this.fetchOtherDepartmentData = this.fetchOtherDepartmentData.bind(this);
	}

	openSearchServiceModal = () => {
		this.setState({ searchServiceModal: true })
	};
	closeSearchServiceModal = () => {
		this.setState({ searchServiceModal: false, clearRange: 0 })
	};
	handleRequestClose = (orderId: any) => {
		this.setState({ orderId: orderId, cancelOrderPopUp: true, showCancelPopup: true });
	};
	onSuccessCancelPopUp = () => {
		this.setState({ cancelOrderPopUp: false });
	};

	onInitApi = async (url, selectedFilters, selectedAgent) => {
		try {
			const responseOrders = await axios.get(url);
			const responseStatus = await axios.get("/statuses");
			const responseEmpList = await axios.get(`/system/employees`);
			var self = this;
			const empListArray = responseEmpList.data.data;
			empListArray.forEach(function (item, i) {
				if (item.id === self.props.authUserId) {
					empListArray.splice(i, 1);
					empListArray.unshift({ ...item, first_name: 'My', last_name: 'Orders' });
				}
			});
			this.props.setDataList(this.transformData(responseOrders.data.data));
	
			this.setState({
				dataList: this.props.dataList,
				metaData: responseOrders.data.meta,
				statuses: responseStatus.data,
				empList: empListArray,
				isLoading: false,
				selectedFilters: selectedFilters || [],
				selectedEmp: selectedAgent || undefined
			});
		} catch (error) {
			this.setState({ isLoading: false })
		}

	}


	componentDidMount() {
		this.setState({ isLoading: true });
		let url: any = `/orders?limit=${this.state.limit}`;
		let encodedString: any = "";
		const { department } = this.props;
		const search = this.props.location.search; // could be '?foo=bar'
		const params = new URLSearchParams(search);
		const filterString = params.get('status');


		const filterArray = filterString && filterString.split(',');
		const selectedFilters = filterArray && filterArray.filter(num => (/^\d+$/).test(num)).map(num => parseInt(num));
		if (this.state.selectedServicePointId.length == 0 && filterArray) {
			encodedString = btoa(unescape(encodeURIComponent(JSON.stringify({ status_id: selectedFilters }))));
		} else if (this.state.selectedServicePointId.length > 0 && !filterArray) {
			encodedString = btoa(unescape(encodeURIComponent(JSON.stringify({ service_point_id: this.state.selectedServicePointId }))));
		} else if (this.state.selectedServicePointId.length > 0 && filterArray) {
			encodedString = btoa(unescape(encodeURIComponent(JSON.stringify({ "status_id": selectedFilters, "service_point_id": this.state.selectedServicePointId }))));
		}

		const filterStringLockedAgent = params.get('locked_by_agent_id');
		if (this.state.selectedEmp == undefined && filterStringLockedAgent) {
			encodedString = btoa(unescape(encodeURIComponent(JSON.stringify({ locked_by_agent_id: filterStringLockedAgent }))));
		}


		if (encodedString !== "") {
			url += `&data=${encodedString}`
		} else {
			url = url
		}

		this.onInitApi(url, selectedFilters, filterStringLockedAgent);

		this.setState({ ...this.state, otherDepartmentStatuses: [] });
		// this.fetchOtherDepartmentData(department)
	}

	componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
		const { department } = this.props
		const {
			department: prevDepartment,
		} = prevProps
		if (department.departmentsList.length !== prevDepartment.departmentsList.length || department.selectedDepartment !== prevDepartment.selectedDepartment) {
			this.setState({ ...this.state, otherDepartmentStatuses: [] })
			// this.fetchOtherDepartmentData(department)
		}
	}

	toggleCancelOrderPopup = () => {
		this.setState({ showCancelPopup: !this.state.showCancelPopup });
	};

	fetchOtherDepartmentData = (department: any) => {
		department && department.departmentsList.length > 0 && department.departmentsList.map((dept: any) => {
			if (department.selectedDepartment && department.selectedDepartment.slug !== dept.slug) {
				AXIOS.attachDepartment(dept.slug);
				AXIOS.get("/statuses")
					.then((response: any) => {
						const statuses = [...this.state.otherDepartmentStatuses];
						statuses.push({ department_name: dept.slug, statuses: response });
						this.setState({ ...this.state, otherDepartmentStatuses: statuses })
					})
					.catch((error: any) => console.log(error))
			}
		})
	};

	transformData(dataList: any) {
		return dataList.map((data: any) => {
			return {
				orderId: data.id,
				name: data.name,
				image: null,
				department: data.department,
				completion_requests: data.completion_requests,
				services: data.services,
				address: data.address,
				phone: data.phone,
				email: data.email,
				orderDate: data.created_at,
				deliveryDate: null,
				status: data.status,
				locked: data.locked,
				additionalData: data.additional_data,
				preferred_dates: data.preferred_dates.length ? data.preferred_dates[0] : null,
				meta: data.meta
			}
		});
	}

	deleteOrder = (id: any) => {
		this.setState({ isLoading: true })
		axios.delete(`/orders/${id}`)
			.then(() => {
				this.props.setDataList(this.state.dataList.filter((item: any) => item.orderId !== id));
				this.setState({
					dataList: this.props.dataList,
					showDeleteSuccess: true,
					isLoading: false
				});
			})
			.catch((error) => {
				this.setState({
					isLoading: false
				})
			})
	};

	hideDeleteSuccessPopup() {
		this.setState({ showDeleteSuccess: false })
	}

	async getOrders(addData = false) {
		let queryParams = {};
		if (this.state.selectedFilters.length > 0) {
			queryParams['status_id'] = this.state.selectedFilters;
		}
		if (this.state.selectedEmp) {
			queryParams['locked_by_agent_id'] = this.state.selectedEmp;
		}

		let encodedString = btoa(unescape(encodeURIComponent(JSON.stringify(queryParams))));
		try {
			this.setState({ isLoading: !addData ? true : false, isTableLoading: addData ? true : false });
			const res = await axios.get(`/orders?limit=${this.state.limit}&data=${encodedString}&page=${this.state.page}&query=${this.state.search}`);
			const data = res.data;
			if (addData) {
				this.props.setDataList([...this.state.dataList, ...this.transformData(data.data)]);
				this.setState({
					dataList: this.props.dataList,
					metaData: data.meta,
					limit: this.state.limit,
					page: this.state.page,
					isLoading: false,
					isTableLoading: false
				});
			} else {
				this.props.setDataList(this.transformData(data.data))
				this.setState({
					dataList: this.props.dataList,
					metaData: data.meta,
					limit: this.state.limit,
					page: this.state.page,
					isLoading: false,
					isTableLoading: false
				});
			}
		} catch (err) {
			this.setState({ isLoading: false, isTableLoading: false });
		}
	}

	fetchData() {
		this.setState({ page: this.state.page + 1 }, () => this.getOrders(true));
	}

	toggleSelectedFilters(id: any) {
		let currentUrlParams = new URLSearchParams(window.location.search);
		this.setState({
			page: 1,
			limit: this.state.limit,
			selectedFilters: this.state.selectedFilters.includes(id) ? this.state.selectedFilters.filter((curr: any) => curr !== id) : [...this.state.selectedFilters, id]
		}, () => {
			if (this.state.selectedFilters.length > 0) {
				currentUrlParams.set('status', this.state.selectedFilters);
			} else {
				currentUrlParams.delete('status');
			}

			this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
			this.getOrders();
		});
	}

	handleLimitChange = (e: any) => {
		this.setState({ page: 1, limit: e.target.value }, () => {
			this.getOrders();
		})
	};

	getOptions = (event: any) => {
		
		this.setState({ servicePointLoader: true })
		if (Boolean(event.target.value) && event.target.value.length > 1) {
			axios.get(`/service-points?query=${event.target.value}`).then((response) => {
				this.setState({
					servicePoints: response.data.data,
					servicePointLoader: false
				})
			}).catch((error: any) => {
				this.setState({
					servicePoints: [],
					servicePointLoader: false
				})
			})
		}
	};

	getSelectedOption = (event: any, value: any) => {
	
		if (value) {
			this.setState({ isLoading: true, selectedServicePointId: value.id });
			let encodedString = btoa(unescape(encodeURIComponent(JSON.stringify({ service_point_id: [value.id] }))));
			axios.get(`/orders?limit=${this.state.limit}&data=${encodedString}&page=${this.state.page}`)
				.then((response) => {
					this.props.setDataList(this.transformData(response.data.data));
					this.setState({
						dataList: this.props.dataList,
						metaData: response.data.meta,
						isLoading: false
					});
				}).catch(err => {
					this.setState({ isLoading: false })
				});
		} else {
			this.setState({ page: 1, selectedServicePointId: [] }, () => this.getOrders());
		}
	};


	handleEmpChange = (event, value) => {

		this.setState({ selectedEmp: value ? value.id : undefined, page: 1 }, () => {
			let currentUrlParams = new URLSearchParams(window.location.search);
			if (value) {
				currentUrlParams.set('locked_by_agent_id', value.id);
			} else {
				currentUrlParams.delete('locked_by_agent_id');
			}
			this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
			this.getOrders()
		})

	}

	debounce = _.debounce(this.getOrders, 1500)

	render() {


		const { cancelOrderPopUp, menuState, orderId, otherDepartmentStatuses, servicePoints, servicePointLoader, empList, selectedEmp } = this.state;
		
		const tableLoading = this.state.isTableLoading && ((
			<div className="d-flex justify-content-center"><CircularProgress className="infinite-loader" /></div>));
		const headerContent = (
			<div className="pageLimitArea">
				
				<span><IntlMessages id={`order.pageLimit`} /> </span>
				<Select
					value={this.state.limit}
					onChange={this.handleLimitChange}
					input={<Input id="limit" />}>
					<MenuItem value={10}>10</MenuItem>
					<MenuItem value={30}>30</MenuItem>
					<MenuItem value={50}>50</MenuItem>
					<MenuItem value={100}>100</MenuItem>
				</Select>
			</div>
		);
	

		return (
			<div>
				{this.state.isLoading && <Loader />}
				{/* {Boolean(otherDepartmentStatuses.length) && otherDepartmentStatuses.map((dept: any) => {
					return <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center d-flex">
						<h2 className="title mb-3 mb-sm-0">{dept.department_name}</h2>
						<div>
							{dept.statuses && dept.statuses.map((status: IStatus) =>
								<Chip disabled
											avatar={<Avatar>{status.orders_count}</Avatar>}
											size="medium"
											className="cursor-pointer mx-2"
											color="primary"
											variant={'outlined'}
											label={<IntlMessages id={`orderStatus.${status.name}`}/>}
								/>
							)}
						</div>
					</div>
				})} */}
				<ContainerHeader title={<IntlMessages id="breadCrumbBar.ordersList" />} match={this.props.match}
					statuses={this.state.statuses} toggleSelectedFilters={this.toggleSelectedFilters}
					selectedFilters={this.state.selectedFilters} />
			
				<div className="d-flex justify-content-between" style={{ zIndex: 0, position: 'relative' }}>
					<Autocomplete
						className="w-25 mb-2 h-75"
						id="support-code"
						options={servicePoints}
						getOptionLabel={(option: { name: string, city: string }) => `${option.name} - ${option.city}`}
						style={{ width: 300, zIndex: 10000 }}
						loading={servicePointLoader}
						renderInput={(params) => <TextField {...params}
							label={<IntlMessages id="orderOptions.search-service-point" />}
							variant="outlined" />}
						onInputChange={(event) => this.getOptions(event)}
						onChange={(event, value) => this.getSelectedOption(event, value)}
					/>
					<div className="d-flex justify-content-end w-100" >
						<RBACContext.Consumer>
							{({ userCan, abilities }: any) => (
								<>
									{userCan(abilities, SHOW_EMPLOYEES_FILTER) && (
										<Autocomplete
											className="w-25 mb-2 mr-2 h-75"
											id="emp-list"
											options={empList}
											value={empList.find(el => el.id == selectedEmp) || null }
											getOptionLabel={(option: { first_name: string, last_name: string }) => `${option.first_name} ${option.last_name}`}
											style={{ width: 300, zIndex: 10000 }}
											renderInput={(params) => <TextField {...params}
												label={<IntlMessages id="breadCrumbBar.employees" />}
												variant="outlined" />
											}
											onChange={(event, value) => this.handleEmpChange(event, value)}
										/>

									)}
								</>
							)}
						</RBACContext.Consumer>



						<TextField
							onChange={(e) => {
								this.setState({ search: e.target.value });
								this.debounce();
							}}
							value={this.state.search}
							label={<IntlMessages id="orderOptions.search-orders" />}
							variant="outlined" />
					</div>
				</div>

				<Card className={`shadow border-0 `} id="order-table">
					<CardBody>
						<CardTitle>{headerContent}</CardTitle>
						<CardText>
							<InfiniteScroll
								height="60vh"
								loader={tableLoading}
								dataLength={this.state.dataList.length} //This is important field to render the next data
								next={this.fetchData}
								hasMore={this.state.metaData && this.state.metaData.has_more_pages}
								endMessage={
									<p style={{ textAlign: 'center' }}>
										<b><IntlMessages id="infinityScrollBar.noDataLeft" /></b>
									</p>
								}>
								<OrderTable openSearchServiceModal={this.openSearchServiceModal} menuState={menuState}
									handleRequestClose={this.handleRequestClose} dataList={this.props.dataList}
									deleteOrder={this.deleteOrder} className=""/>
							</InfiniteScroll>
						</CardText>
					</CardBody>
				</Card>

				{
					this.state.showDeleteSuccess &&
					<AlertPopUp
						show={this.state.showDeleteSuccess}
						message={<IntlMessages id="sweetAlerts.deleteSuccessMessage" />}
						title={<IntlMessages id="sweetAlerts.deleteSuccessTitle" />} success={true} showOk
						confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
						onConfirm={this.hideDeleteSuccessPopup}
					/>
				}
				<SearchServicePoint
					toggle={this.closeSearchServiceModal}
					clear={this.state.clearRange}
					isOpen={this.state.searchServiceModal} />
				{
					cancelOrderPopUp &&
					<CancelOrder
						getOrders={this.getOrders}
						closePopUp={this.onSuccessCancelPopUp}
						show={cancelOrderPopUp}
						orderId={orderId}
						togglePopup={this.toggleCancelOrderPopup}
						showPopUp={this.state.showCancelPopup} />
				}
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		setDataList: (data: any) => dispatch(setDataList(data))
	};
};

const mapStateToProps = (state: any) => {
	return {
		dataList: state.orderPageState.dataList,
		department: state.department,
		authUserId: state.auth.authUser.id
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
