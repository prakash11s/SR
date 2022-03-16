import { createSelector } from "reselect";

const selectEmployeesState = (state) => state.employeesState;

export const selectEmployeesData = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.employeesTableData
);

export const selectisTableLoading = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.isTableLoading
);

export const selectroles = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.roles
);

export const selectPhoneCountry = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.countryCodes
);

export const selectedRole = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.selectedRole
);

export const selectEmployeeData = createSelector(
    [selectEmployeesState],
    employeesState => employeesState
);

export const selectedIsFormDisabled = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.isSubmitButtonDisabled
)

export const selectAlertPopUpValue = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.alertPopUp
)

export const selectSuccessValue = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.success
)

export const selectWarningValue = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.warning
)

export const selectErrorMessage = createSelector(
    [selectEmployeesState],
    employeesState => employeesState.errorMessage
)
