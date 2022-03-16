export interface IRolesOverviewProps {
 getRoleTable: (limit: number, page: number) => void,
 createRolePopUpTrue: () => void,
 setRole: (e: string) => void,
 checkSubmitButtonStatus: () => void,
 setDescription: (e: string) => void,
 submitForm: () => void,
 createRolePopUpFalse: () => void,
 successValueFalse: () => void,
 warningValueFalse: () => void,
 triggerSubmitForm: () => void,
 alertPopUpValueFalse: () => void,
 fetchRoleTable: (limit: number, page: number) => void,
 deleteRoleTableData,
 rawData: {
     data: IDataDetailsObj[],
     meta: {
         has_more_pages: boolean,
         limit: string,
         page: number,
         total: number
     },
 },
 loader,
 match: match<MatchParams>,
 createRolePopup: boolean,
 buttonStatus: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
 alertPopUpValue: boolean,
 message: string | JSX.Element | null | undefined,
 warningValue: boolean,
 successValue: boolean,
}

interface MatchParams {
 name: string;
}

interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}

interface IDataDetailsObj {
 created_at: string,
 delete_protection: boolean,
 description: string,
 id: string,
 level: null,
 name: string,
 scope: number,
 updated_at: string,
}

export interface IRolesOverviewState {
 alertTitle: string | null,
 deleteActionPopup: boolean,
 deleteId: string,
 deleteMessage: string | null,
 deleteSuccessValue: boolean,
 deleteWarningValue: boolean,
 limit: number,
 page: number,
 readyForCall: boolean,
 showCancel: boolean
}