import { createSelector } from "reselect";

import { DEVICE_TOKEN } from "../constants/localStorageKeys";

const selectSoftPhone = (state) => state.softPhone;

export const selectMuteState = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.muted
);

export const selectCall = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.Call
)

export const callerName = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.Call.callerName
);

export const selectSoftPhoneAgent = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.softPhoneAgent
)

export const selectDeviceToken = createSelector(
  [selectSoftPhone],
  softPhone => {
    if (
      softPhone.deviceToken &&
      softPhone.deviceToken.token &&
      softPhone.deviceToken.ttl
    ) {
      if (Date.parse(softPhone.deviceToken.ttl) <= Date.now()) {
        return softPhone.deviceToken;
      }
      localStorage.removeItem(DEVICE_TOKEN);
    }
    return null;
  }
);

export const selectShowPopupState = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.showPopup
);

export const selectShowCallListeningPopupState = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.showCallListeningPopup
)

export const selectListenPhoneNumberState = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.listenPhoneNumber
)

export const selectPopupMessageState = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.popupMessage
);

export const selectShowOngoingCallPad = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.Call.showOngoingCallPad
);

export const selectHasActiveUser = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.Call.hasActivePhoneCall
);

export const selectCallInit = createSelector(
  [selectSoftPhone],
  softPhone => softPhone.callInit
);

