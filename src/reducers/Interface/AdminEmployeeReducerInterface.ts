export interface IAdminEmployeeReducer {
  employeeData: IAdminEmployee,
  employeeLoading: boolean,
  employeeError: string,
  permissionList: [],
  permissionListLoading: boolean,
  permissionListError: string,
  softPhoneCredentials: ISoftPhoneCredential[],
  softPhoneCredentialsLoading: boolean,
  softPhoneCredentialsError: string,
}

export interface IAdminEmployee {
  first_name: string,
  last_name: string,
  alias: string,
  salutation: string,
  email: string,
  phone: string,
  roles: string,
  permissions: IEmployeePermission[],
}

export interface IEmployeePermission {
  id: string,
  name: string
}

export interface ISoftPhoneCredential {
  extension: string,
  password: string,
}
