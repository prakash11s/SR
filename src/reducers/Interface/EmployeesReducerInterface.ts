export interface IEmployeesReducer {
  employeesTableData: IEmployeeData;
  isTableLoading: boolean;
  roles: [];
  first_name: any;
  last_name: any;
  email: any;
  phone: any;
  phoneCountry: any;
  countryCodes: any;
  selectedRole: [];
  isSubmitButtonDisabled: boolean;
  alertPopUp: boolean;
  success: boolean;
  warning: boolean;
  errorMessage: any
};


interface IEmployeeData {
  data: [];
  meta: object;
}
