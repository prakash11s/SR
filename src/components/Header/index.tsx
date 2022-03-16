import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import {
	BELOW_THE_HEADER,
	COLLAPSED_DRAWER,
	FIXED_DRAWER,
	HORIZONTAL_NAVIGATION,
	INSIDE_THE_HEADER,
} from 'constants/ActionTypes';
import SearchBox from 'components/SearchBox';
import MailNotification from '../MailNotification/index';
import AppNotification from '../AppNotification/index';
import CardHeader from 'components/dashboard/Common/CardHeader';
import { switchLanguage, toggleCollapsedNav } from 'actions/Actions/Setting';
import { openDialPad, onForwardPadToggle } from 'actions/Actions/SoftPhoneActions';
import IntlMessages from 'util/IntlMessages';
import LanguageSwitcher from 'components/LanguageSwitcher/index';
import Menu from 'components/TopNav/Menu';
import UserInfoPopup from 'components/UserInfo/UserInfoPopup';
import DepartmentDropdownList from 'components/DepartmentDropdownList';
import ServicepointDropdownList from './../ServicepointDropdownList';
import { Call } from '@material-ui/icons';
import RBACContext from "./../../rbac/rbac.context";
import { ACCESS_SOFT_PHONE } from "../../rbac/abilities.constants";
import { IHeaderState, IRootHeaderState } from './Interface/IndexInterface';
import axios from '../../util/Api';

import moment from "moment"
import { getDashboardOrder, startLoading } from "../../actions/Actions/DashboardActions";
import { IDashboardOrder } from "../../reducers/Interface/DashboardReducerInterface";

class Header extends React.Component<any, IHeaderState> {
	constructor(props: any) {
		super(props);

		let now = new Date();
		let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0));
		let end = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));

		this.state = {
			selectedValue: "",
			open: false,
			anchorEl: undefined,
			searchBox: false,
			searchText: '',
			mailNotification: false,
			userInfo: false,
			langSwitcher: false,
			appNotification: false,
			departments: false,
			servicepoint: false,
			start: start,
			end: end
		}
	}

	onAppNotificationSelect = () => {
		this.setState({
			appNotification: !this.state.appNotification
		})
	};

	onMailNotificationSelect = () => {
		this.setState({
			mailNotification: !this.state.mailNotification
		})
	};

	onLangSwitcherSelect = (event: any) => {
		this.setState({
			langSwitcher: !this.state.langSwitcher, anchorEl: event.currentTarget
		})
	};
	onSearchBoxSelect = () => {
		this.setState({
			searchBox: !this.state.searchBox
		})
	};
	onAppsSelect = () => {
		this.setState({
			apps: !this.state.apps
		})
	};

	departmentSelectionToggle = () => {
		this.setState({
			departments: !this.state.departments
		})
	};

	servicepointSelectionToggle = () => {
		this.setState({
			servicepoint: !this.state.servicepoint
		})
	}

	onUserInfoSelect = () => {
		this.setState({
			userInfo: !this.state.userInfo
		})
	};

	handleLanguageRequestClose = () => {
		this.setState({
			langSwitcher: false,
			userInfo: false,
			mailNotification: false,
			appNotification: false,
			searchBox: false,
			apps: false
		});
	};
	onToggleCollapsedNav = () => {
		const val = !this.props.navCollapsed;
		this.props.toggleCollapsedNav(val);
	};

	updateSearchText = (evt: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			searchText: (evt.target as HTMLInputElement).value,
		});
	};

	Apps = () => {

		return (
			<ul className="jr-list jr-list-half">

				<li className="jr-list-item">
					<Link className="jr-list-link" to="/support/email">
						<i className="zmdi zmdi-email zmdi-hc-fw" />
						<span className="jr-list-text"><IntlMessages id="sidebar.appModule.mail" /></span>
					</Link>
				</li>

				<li className="jr-list-item">
					<Link className="jr-list-link" to="/support/orders/create">
						<i className="zmdi zmdi-plus-circle-o zmdi-hc-fw" />
						<span className="jr-list-text">Create Order</span>
					</Link>
				</li>
			</ul>)
	};

	handleRequestClose = (value: string) => {
		localStorage.setItem("department", value)
		this.setState({ open: false });
	};

	render() {
		const { drawerType, locale, navigationStyle, horizontalNavPosition, department, servicepoint, isWebsocketConnected } = this.props;
		const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'd-block d-xl-none' : drawerType.includes(COLLAPSED_DRAWER) ? 'd-block' : 'd-none';

		return (
			<RBACContext.Consumer>
				{({ userCan, abilities }: any) => (
					<AppBar
						className={`app-main-header ${(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === BELOW_THE_HEADER) ? 'app-main-header-top' : ''}  ${process.env.NODE_ENV === 'production' ? '' : 'fixed-top-header'}`}>
						<Toolbar className="app-toolbar" disableGutters={false}>
							{navigationStyle === HORIZONTAL_NAVIGATION ?
								<div className="d-block d-md-none pointer mr-3" onClick={this.onToggleCollapsedNav}>
									<span className="jr-menu-icon">
										<span className="menu-icon" />
									</span>
								</div>
								:
								<IconButton className={`jr-menu-icon mr-3 ${drawerStyle}`} aria-label="Menu"
									onClick={this.onToggleCollapsedNav}>
									<span className="menu-icon" />
								</IconButton>
							}

							{/*<Link className="app-logo mr-2 d-none d-sm-block" to="/">*/}
							{/*	<img src={require("assets/images/serviceRight.png")}*/}
							{/*			 alt="service-right" title="service-right"/>*/}
							{/*</Link>*/}

							<div className="ml-3 mt-1 mb-0">
								{isWebsocketConnected === 2 ?
									<span className="badge badge-warning">Connecting</span> :
									isWebsocketConnected === 1 ? <span className="badge badge-success">Online</span> : <span className="badge badge-danger">Offline</span>
								}
							</div>

							{/* <SearchBox styleName="d-none d-lg-block" placeholder=""
												 onChange={this.updateSearchText.bind(this)}
												 value={this.state.searchText}/> */}
							{(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === INSIDE_THE_HEADER) &&
								<Menu />}
							<ul className="header-notifications list-inline ml-auto">
								{/* <li className="list-inline-item">
									<Dropdown
										className="quick-menu app-notification"
										isOpen={this.state.apps}
										toggle={this.onAppsSelect.bind(this)}>
										<DropdownToggle
											className="d-inline-block"
											tag="span"
											data-toggle="dropdown">
                      <span className="app-notification-menu">
                        <i className="zmdi zmdi-apps zmdi-hc-fw zmdi-hc-lg"/>
                        <span>Apps</span>
                      </span>
										</DropdownToggle>

										<DropdownMenu>
											{this.Apps()}
										</DropdownMenu>
									</Dropdown>
								</li> */}

								<li className="list-inline-item">
									<Dropdown
										className={`quick-menu department-dropdown ${department.departmentsList.length > 1 ? 'pointer' : ''}`}
										isOpen={this.state.departments}
										toggle={department.departmentsList.length > 1 && this.departmentSelectionToggle as any}>
										<DropdownToggle
											className="d-inline-block"
											tag="span"
											data-toggle="dropdown">
											<span className="d-flex align-items-center">
												{department.selectedDepartment ? <span className="department-list"> <Avatar variant="square"
													alt={department.selectedDepartment.name}
													src={department.selectedDepartment.image.small}></Avatar> <div>{department.selectedDepartment.name}</div> </span> :
													<span><IntlMessages id="department.selectedDepartment" /></span>}
												{department.departmentsList.length > 1 && <span className="down-arrow-icon"></span>}
											</span>
										</DropdownToggle>

										<DropdownMenu right className="department-list">
											<DepartmentDropdownList handleRequestClose={this.departmentSelectionToggle} />
										</DropdownMenu>
									</Dropdown>
								</li>

								{/partner/.test(window.location.href) && (
									<li className="list-inline-item">
										<Dropdown
											className={`quick-menu department-dropdown ${servicepoint.servicepointsList && servicepoint.servicepointsList.length > 1 ? 'pointer' : ''}`}
											isOpen={this.state.servicepoint}
											toggle={servicepoint.servicepointsList.data && servicepoint.servicepointsList.data.length > 1 && this.servicepointSelectionToggle as any}>

											<DropdownToggle
												className="d-inline-block"
												tag="span"
												data-toggle="dropdown">
												<span className="d-flex align-items-center">
													{servicepoint.selectedServicepoint ? <span className="department-list"> <div>{servicepoint.selectedServicepoint.name}</div> </span> :
														<span><IntlMessages id="servicepoint.selectedServicepoint" /></span>}
													{servicepoint.servicepointsList.data && servicepoint.servicepointsList.data.length > 1 &&
														<span className="down-arrow-icon"></span>}
												</span>
											</DropdownToggle>

											<DropdownMenu right className="department-list">
												<ServicepointDropdownList history={this.props.history}
													handleRequestClose={this.servicepointSelectionToggle} />
											</DropdownMenu>
										</Dropdown>
									</li>
								)}

								<li className="d-inline-block d-lg-none list-inline-item">
									<Dropdown
										className="quick-menu nav-searchbox"
										isOpen={this.state.searchBox}
										toggle={this.onSearchBoxSelect.bind(this)}>

										<DropdownToggle
											className="d-inline-block"
											tag="span"
											data-toggle="dropdown">
											<IconButton className="icon-btn">
												<i className="zmdi zmdi-search zmdi-hc-fw" />
											</IconButton>
										</DropdownToggle>

										<DropdownMenu right className="p-0">
											<SearchBox styleName="search-dropdown" placeholder=""
												onChange={this.updateSearchText.bind(this)}
												value={this.state.searchText} />
										</DropdownMenu>
									</Dropdown>
								</li>
								<li className="list-inline-item">
									<Dropdown
										className="quick-menu"
										isOpen={this.state.langSwitcher}
										toggle={this.onLangSwitcherSelect.bind(this)}>

										<DropdownToggle
											className="d-inline-block"
											tag="span"
											data-toggle="dropdown">
											<IconButton className="icon-btn">
												<i className={`flag flag-24 flag-${locale.icon}`} />
											</IconButton>
										</DropdownToggle>

										<DropdownMenu right className="w-50">
											<LanguageSwitcher switchLanguage={this.props.switchLanguage}
												handleRequestClose={this.handleLanguageRequestClose} />
										</DropdownMenu>
									</Dropdown>
								</li>
								{userCan(abilities, ACCESS_SOFT_PHONE) && Boolean(this.props.softPhoneAgent.length) && (
									<li
										className="list-inline-item"
										onClick={() => {
											this.props.openDialPad();
											if (this.props.Call.showForwardPad)
												this.props.onForwardPadToggle();
										}}
									>
										<Call fontSize="small" />
									</li>)}
								{/*<li className="list-inline-item mail-tour">*/}
								{/*	<Dropdown*/}
								{/*		className="quick-menu"*/}
								{/*		isOpen={this.state.mailNotification}*/}
								{/*		toggle={this.onMailNotificationSelect.bind(this)}*/}
								{/*	>*/}
								{/*		<DropdownToggle*/}
								{/*			className="d-inline-block"*/}
								{/*			tag="span"*/}
								{/*			data-toggle="dropdown">*/}

								{/*			<IconButton className="icon-btn">*/}
								{/*				<i className="zmdi zmdi-comment-alt-text zmdi-hc-fw"/>*/}
								{/*			</IconButton>*/}
								{/*		</DropdownToggle>*/}


								{/*		<DropdownMenu right>*/}
								{/*			<CardHeader styleName="align-items-center"*/}
								{/*									heading={<IntlMessages id="mailNotification.title"/>}/>*/}
								{/*			<MailNotification/>*/}
								{/*		</DropdownMenu>*/}
								{/*	</Dropdown>*/}
								{/*</li>*/}

								{navigationStyle === HORIZONTAL_NAVIGATION &&
									<li className="list-inline-item user-nav">
										<Dropdown
											className="quick-menu"
											isOpen={this.state.userInfo}
											toggle={this.onUserInfoSelect.bind(this)}>

											<DropdownToggle
												className="d-inline-block"
												tag="span"
												data-toggle="dropdown">
												<IconButton className="icon-btn size-30">
													<Avatar
														alt='...'
														src={'https://via.placeholder.com/150x150'}
														className="size-30"
													/>
												</IconButton>
											</DropdownToggle>

											<DropdownMenu right>
												<UserInfoPopup />
											</DropdownMenu>
										</Dropdown>
									</li>}
							</ul>

							<div className="ellipse-shape"></div>
						</Toolbar>
					</AppBar>
				)
				}
			</RBACContext.Consumer>
		)
	}
}

/**
 * dispatch actions
 */
const mapDispatchToProps = (dispatch: any) => {
	return {
		/**
		 * get daily order handler
		 */
		getDashboardOrder: (data: IDashboardOrder[]) => {
			dispatch(startLoading());
			dispatch(getDashboardOrder(data))
		},
		toggleCollapsedNav: (value: boolean) => dispatch(toggleCollapsedNav(value)),
		switchLanguage: (locale: object) => dispatch(switchLanguage(locale)),
		openDialPad: () => dispatch(openDialPad()),
		onForwardPadToggle: () => dispatch(onForwardPadToggle())
	}
};

const mapStateToProps = ({ settings, department, servicepoint, softPhone, auth }: IRootHeaderState) => {
	const { drawerType, locale, navigationStyle, horizontalNavPosition } = settings;
	const { softPhoneAgent, Call } = softPhone
	const { isWebsocketConnected } = auth
	return { drawerType, locale, navigationStyle, horizontalNavPosition, department, servicepoint, softPhoneAgent, Call, isWebsocketConnected }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
