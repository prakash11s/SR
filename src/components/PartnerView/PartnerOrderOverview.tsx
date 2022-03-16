import React from "react";
import { useSelector} from "react-redux";

import VehiclesOrderOverview from "./VehiclesPartnerView/OrderOverviewVehicles";
import CouriersOrderOverview from "./CouriersPartnerView/OrderOverviewCouriers";
import { VEHICLES, COURIERS } from "../../../src/constants/common.constants";

const PartnerOrderOverview = (): JSX.Element => {
  const SelectedDepartment = useSelector(
    (state: any) => state.department.selectedDepartment
  );

  const DepartmentDecider = () => {
    if (SelectedDepartment && SelectedDepartment.slug === VEHICLES) {
      return <VehiclesOrderOverview />;
    } else if (SelectedDepartment && SelectedDepartment.slug === COURIERS) {
      return <CouriersOrderOverview />;
    }
  };

  return <>{DepartmentDecider()}</>;
};

export default PartnerOrderOverview;
