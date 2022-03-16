import { createSelector } from "reselect";

const servicepointState = (state) => state.servicepoint;

export const selectServicepointsListData = createSelector(
    [servicepointState],
    servicepointsListData => servicepointsListData.servicepointsListData
);





