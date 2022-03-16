import {ISetting} from '../../../reducers/Interface/SettingInterface';
import {IDepartmentReducer} from '../../../reducers/Interface/DepartmentReducerInterface';
import {IServicePointReducer} from '../../../reducers/Interface/ServicePointReducerInterface';
import {ISoftPhoneReducer} from "../../../reducers/Interface/SoftphoneReducerInterface";
import { IAuth } from 'reducers/Interface/AuthInterface';

export interface IHeaderState {
	selectedValue: string,
	open: boolean,
	anchorEl: undefined,
	searchBox: boolean,
	searchText: string,
	mailNotification: boolean,
	userInfo: boolean,
	langSwitcher: boolean,
	appNotification: boolean,
	departments: boolean,
	servicepoint: boolean,
	apps?: boolean,
	start: any,
	end: any
}

export interface IRootHeaderState {
	settings: ISetting,
	department: IDepartmentReducer,
	servicepoint: IServicePointReducer,
	softPhone: ISoftPhoneReducer,
	auth: IAuth
}
