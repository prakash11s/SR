export interface IEmployeeTableProps {
  onRowClick: Function;
  deleteEmployee: Function;
  notificationAction: Function;
  dataList: IDataList[];
  callPhone: Function;
  onChange: Function;
  toggleCreateModal?: () => void;
  meta: {
    has_more_pages: boolean;
    limit: number;
    page: number;
    total: number;
  };
}

export interface IDataList {
  activated_at: string;
  alias: string;
  avatar: string;
  created_at: string;
  deleted_at: string;
  email: string;
  first_name: string;
  id: number;
  notifications: boolean;
  last_name: string;
  phone: string;
  role: string;
  salutation: string;
  service_point_id: string;
  user_id: string;
  updated_at: string;
}
