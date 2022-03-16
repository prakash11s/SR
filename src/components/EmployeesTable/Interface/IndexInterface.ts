export interface IEmployeesTableProps {
 alertPopUpValue: boolean;
 cancelAlertPopUp: () => void;
 getCountryCodes: () => void;
 fetchEmployeesTable: (limit: number, page: number) => void;
 getEmployeesTable: (limit: number, page: number) => void;
 isFormDisabled: boolean;
 loader: boolean;
 match: {
   isExact: boolean;
   params: {};
   path: string;
   url: string;
 };
 message: null;
 rawData: {
   data: IDataObj[];   
   meta: {
     has_more_pages: boolean;
   };
 };
 role: [];
 roles: [];
 phoneCountry: [];
 setFirstName: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setLastName: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setEmail: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setPhone: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setRole: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setPhoneCountry: (e: (React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) | unknown) => void;
 setSubmitButtonStatus: () => void;
 staticContext: undefined;
 submitNewEmployeeDetails: () => void;
 successValue: boolean;
 warningValue: boolean;
}

interface IDataObj {
 activated_at: string | null;
 alias: string | null;
 avatar: string;
 created_at: string;
 deleted_at: string | null;
 email: string;
 first_name: string;
 id: string;
 last_name: string;
 phone: string;
 roles: IRolesObj[]
 salutation: string | null;
 updated_at: string;
}

interface IRolesObj {
 created_at: string;
 delete_protection: number;
 id: string;
 level: null;
 name: string;
 pivot: {
   entity_id: string;
   role_id: number;
   entity_type: string;
   scope: number;
 }
 scope: null;
 title: string;
 updated_at: string;
}

export interface IEmployeesTableState {
 limit: number;
 page: number;
 employeePopup: boolean;
 successPopUp: boolean;
}
