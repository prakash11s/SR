import { createSelector } from "reselect";

const selectCallQueueState = (state) => state.callQueueState;

export const selectCallQueueListData = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.callQueueListData
);


export const selectLoader = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.loader
);

export const selectShow = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.show
);

export const selectPromptShow = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.promptShow
);

export const selectCallQueueOverviewData = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.callQueueOverviewData
);

export const selectSpinnerValue = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.spinner
);

export const selectCallQueueId = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.callQueueId
);

export const selectCallQueueStatus = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.callQueueStatus
);

export const selectCallQueueTimer = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.showTimer
);

export const selectActiveCaller = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.activeCaller
);

export const selectNoActionTaken = createSelector(
    [selectCallQueueState],
    callQueueState => {
        const dataList = callQueueState.callQueueListData.data.filter((data:any) => data.noActionTaken);
        return callQueueState.callQueueListData.data.length && dataList.length === callQueueState.callQueueListData.data.length;
    }
);

export const selectSnackbarStatus = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.snackBar
);

export const callQueueIdData = createSelector(
    [selectCallQueueState],
    callQueueState => callQueueState.callQueueIdData
);

