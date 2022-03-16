import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import VehiclesPartnerView from "./VehiclesPartnerView";
import CouriersPartnerView from "./CouriersPartnerView";
import { VEHICLES, COURIERS } from "../../../src/constants/common.constants";
import { IPartnerViewProps } from "./Interface/IndexInterface";
import { setServicepointStartAsync } from "actions/Actions/servicepointDropdownAction";

const PartnerView = (props: IPartnerViewProps): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setServicepointStartAsync(history));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const SelectedDepartment = useSelector(
    (state: any) => state.department.selectedDepartment
  );
  const DepartmentDecider = () => {
    if (SelectedDepartment && SelectedDepartment.slug === VEHICLES) {
      return <VehiclesPartnerView match={props.match} />;
    } else if (SelectedDepartment && SelectedDepartment.slug === COURIERS) {
      return <CouriersPartnerView match={props.match} />;
    }
  };

  return <>{DepartmentDecider()}</>;
};

export default PartnerView;
