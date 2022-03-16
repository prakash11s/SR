import { IDepartmentReducer } from '../../../reducers/Interface/DepartmentReducerInterface';

export interface IDepartmentDropdownListProps {
 setDepartmentStartAsync: () => void;
 setPartnerDepartmentStartAsync: () => void;
 addSelectedDepartment: (p1: IDepartmentList) => void;
 department: any;
 handleRequestClose: () => void;
};

export interface IDepartmentList {
config: {
 chat_key: string;
 colors: {
   main: string;
 }
 default_locale?: string;
 google_analytics_key?: string;
 google_recaptcha_token?: string;
 hotjar_key?: string;
}
feedback: {
 total: number;
 average: number;
}
id: number;
image: {
 small: string;
 large: string;
 favicon: string;
}
slug: string;
name: string;
steps: IStepsObj[]
support_phone: string;
usps: IUspsObj[]
}

interface IStepsObj {
description: string;
heading: string;
}

interface IUspsObj {
 name: string;
}

export interface IRootDepartmentDropdownListState {
  department: IDepartmentReducer
}
