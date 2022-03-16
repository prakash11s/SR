export interface IAppModuleHeaderState {
 anchorEl: undefined;
 searchBox: boolean;
 popoverOpen: boolean;
}

export interface IAppModuleHeaderProps {
 placeholder: string;
 onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 value: string;
 user: Iuser;
 notification: string|boolean;
 apps: string|boolean;
}

interface Iuser {
 name: string;
 email: string;
 avatar: string;
}

export interface IAppModuleDefaultProps {
 defaultProps: IAppDefaultValues
}

interface IAppDefaultValues {
 styleName: string;
 value: string;
 notification: boolean;
 apps: boolean;
}