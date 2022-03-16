import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";

import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import {
  IRootPartnerViewState,
  IPartnerViewProps,
} from "./VehiclesPartnerView/Interface/IndexInterface";
import { getDebts } from "actions/Actions/DashboardActions";

const VehiclesPartnerView = (props: IPartnerViewProps): JSX.Element => {
  const dispatch = useDispatch();
  const [debts, setDebts] = useState<any>(null);
  const servicePointData = useSelector(
    (state: IRootPartnerViewState) => state.servicepoint.selectedServicepoint
  );
  const departmentsList = useSelector(
    (state: IRootPartnerViewState) => state.department.departmentsList
  );

  useEffect(() => {
    if (departmentsList.length && servicePointData)
      dispatch(
        getDebts((status, res) => {
          if (status && res.data && res.data.length) {
            let isUncollectible = false;
            res.data.forEach((data) => {
              if (data.status.name === "uncollectible") {
                isUncollectible = true;
              }
            });
            setDebts(isUncollectible ? "danger" : "warning");
          }
        })
      );
  }, [departmentsList, servicePointData]);

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="sidebar.dashboard" />}
      />
      {debts && (
        <div className={`alert alert-${debts} d-flex`} role="alert">
          <svg
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
            ></path>
          </svg>
          <div className="ml-3">
            <IntlMessages id="partnerUpcomingAssignment.errorInfoBoxMessage1" />{" "}
            <Link to="/partner/invoices">
              <IntlMessages id="supportTab.invoices" />
            </Link>{" "}
            <IntlMessages id="partnerUpcomingAssignment.errorInfoBoxMessage2" />
          </div>
        </div>
      )}
      <Alert color="info">
        <IntlMessages id="partnerUpcomingAssignment.welcomeInfoBox" />
        {servicePointData && ` ${servicePointData.name} `}
        <IntlMessages id="partnerUpcomingAssignment.welcomeInfoBoxMessage1" />
        <br />
        <br />
        <IntlMessages id="partnerUpcomingAssignment.welcomeInfoBoxMessage2" />
        <br />
        <br />
        <IntlMessages id="partnerUpcomingAssignment.welcomeInfoBoxMessage3" />
      </Alert>
    </div>
  );
};

export default VehiclesPartnerView;
