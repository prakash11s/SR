import { createSelector } from "reselect";

const selectAbilityState = (state) => state.abilityState;

export const selectButtonStatus = createSelector(
 [selectAbilityState],
 abilityState => abilityState.isButtonDisabled
);

export const selectCreateAbilityPopup = createSelector(
 [selectAbilityState],
 abilityState => abilityState.createAbilityPopup
);

export const selectWarningValue = createSelector(
 [selectAbilityState],
 abilityState => abilityState.warningValue
);

export const selectSuccessValue = createSelector(
 [selectAbilityState],
 abilityState => abilityState.successValue
);

export const selectisRoleLoading = createSelector(
 [selectAbilityState],
 abilityState => abilityState.isRoleLoading
);

export const selectAlertPopUpValue = createSelector(
 [selectAbilityState],
 abilityState => abilityState.alertPopUpValue
);

export const selectErrorMessage = createSelector(
 [selectAbilityState],
 abilityState => abilityState.message
)
