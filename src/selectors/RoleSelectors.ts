import { createSelector } from "reselect";

const selectRoleState = (state) => state.roleState;

export const selectButtonStatus = createSelector(
    [selectRoleState],
    roleState => roleState.isButtonDisabled
);

export const selectRoleData = createSelector(
    [selectRoleState],
    roleState => roleState.roleTableData
);

export const selectisRoleLoading = createSelector(
    [selectRoleState],
    roleState => roleState.isRoleLoading
);

export const selectCreateRolePopup = createSelector(
 [selectRoleState],
 roleState => roleState.createRolePopup
);

export const selectWarningValue = createSelector(
 [selectRoleState],
 roleState => roleState.warningValue
);

export const selectSuccessValue = createSelector(
 [selectRoleState],
 roleState => roleState.successValue
);

export const selectAlertPopUpValue = createSelector(
 [selectRoleState],
 roleState => roleState.alertPopUpValue
);

export const selectErrorMessage = createSelector(
 [selectRoleState],
 roleState => roleState.message
)
