import { ICompanyReducer } from "../../../reducers/Interface/CompanyReducerInterface";
import {
  Call,
  ISoftPhoneReducer,
} from "../../../reducers/Interface/SoftphoneReducerInterface";

interface Imeta {
  has_more_pages: boolean;
}

export interface Istate {
  limit: number;
  page: number;
  searchData: string;
  callNumber: string;
  callName: string;
  callAlert: boolean;
  showDeleted: boolean;
  avatar: string;
  dataList?: any;
}

export interface IData {
  id: string;
  name: string;
  image: undefined | string;
  city: string;
  phone: number;
  avatar: string;
  recognitions: any[];
}

export interface ICompaniesTableProps {
  getQueueEntries: (
    limit: number,
    page: number,
    addData?: boolean,
    showdeleted?: boolean
  ) => void;
  getSearchData: (
    limit: number,
    page: number,
    searchData: string,
    addData?: boolean,
    showdeleted?: boolean
  ) => void;
  clearReducerData: () => void;
  clearCompanyData: () => void;
  toggleLoader: () => void;
  companyData: [];
  meta: {
    has_more_pages: boolean;
  };
  isTableLoading: boolean;
  listError: string;
  callState: Call;
}

export interface IRootCompaniesState {
  companyState: ICompanyReducer;
  softPhone: ISoftPhoneReducer;
}
