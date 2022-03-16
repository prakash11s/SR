import { ISetting } from '../../../reducers/Interface/SettingInterface';
import { IAuth } from '../../../reducers/Interface/AuthInterface';

export interface IUserInfoProps {
 authUser: IAuthObj,
 userSignOut: () => void;
}

interface IAuthObj {
 avatar: string,
 first_name: string,
 last_name: string
}

export interface IUserInfoState {
 anchorEl: Element|null,
 open: boolean,
 authUser: IAuthObj|null
}

export interface IRootUserInfoState {
 settings: ISetting,
 auth: IAuth,
}