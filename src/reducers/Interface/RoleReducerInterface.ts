export interface IRoleReducer {
  roleTableData: IRoleData
  isRoleLoading: boolean,
  role: any | null,
  description: any
  isButtonDisabled: boolean,
  createRolePopup: boolean,
  message: string | null,
  warningValue: boolean,
  successValue: boolean,
  alertPopUpValue: boolean
}

interface IRoleData {
  data: [],
  meta: object
}

