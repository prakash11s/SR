export interface IDepartmentReducer {
  department?: [];
  departmentsList: [];
  error: string;
  selectedDepartment: object | undefined;
}

export interface IDepartmentList {
  slug: string;
}
