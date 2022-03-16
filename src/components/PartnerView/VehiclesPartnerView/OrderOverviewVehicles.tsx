import React, { useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Button, FormControl } from "@material-ui/core";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { Alert, Card, CardBody, CardText, Spinner } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

import PartnerOrderOverviewPreferredDatesTable from "../PartnerOrderOverviewPreferredDatesTable";

import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import {
  getPartnerAvailableOrders,
  finishOrderAction,
  getPartnerOrders,
  orderAction,
} from "actions/Actions/PartnerOrdersActions";
import AlertPopUp from "common/AlertPopUp";
import { formatPrice, readableDateTimeLocale } from "util/helper";
import PaymentList from "components/PaymentList";

const renderLoading = <Spinner color="primary" className={"spinner"} />;
const PartnerOrderOverview = (): JSX.Element => {
  const history = useHistory();
  const commentboxRef = useRef<any>();
  const priceRef = useRef<any>();
  const [acceptPopup, setAcceptPopup] = useState<boolean>(false);
  const [denyPopup, setDenyPopup] = useState<boolean>(false);
  const [finishPopup, setFinishPopup] = useState<boolean>(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [partnerOrders, setPartnerOrders] = useState<any>(null);
  const [popupMsg, setPopupMsg] = useState("");
  const [popupType, setPopupType] = useState("");
  const [error, setError] = useState(null);
  const [preferredDate, setPreferredDate] = useState<any>(undefined);
  const [preferredDates, setPreferredDates] = useState<any>([]);

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { id } = useParams() as any;

  useEffect(() => {
    if (
      partnerOrders &&
      partnerOrders.preferred_dates &&
      partnerOrders.preferred_dates.length > 0
    ) {
      setPreferredDates(partnerOrders.preferred_dates);
      if (!preferredDate) {
        setPreferredDate(
          partnerOrders.preferred_dates[0] &&
          partnerOrders.preferred_dates[0].id
        );
      }
    }
  }, [partnerOrders]);

  useEffect(() => {
    if (window.location.href.indexOf("processing") > 0) {
      dispatch(
        getPartnerAvailableOrders(id, (status, res) => {
          if (status) {
            setPartnerOrders(res);
          } else {
            setError(res);
          }
        })
      );
    } else {
      dispatch(
        getPartnerOrders(id, (status, res) => {
          if (status) {
            setPartnerOrders(res);
          } else {
            setError(res);
          }
        })
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const acceptOrderPopupHandler = () => {
    setAcceptPopup(!acceptPopup);
  };

  const denyOrderPopupHandler = () => {
    setDenyPopup(!denyPopup);
  };

  const finishOrderPopupHandler = () => {
    setFinishPopup(!finishPopup);
  };

  const acceptOrderConfirmHandler = () => {
    dispatch(
      orderAction(
        id,
        "accept",
        (status, res) => {
          if (status) {
            history.push(`/partner/dashboard`);
          } else {
            setPopupType("accept");
            setPopupMsg(res);
            setPopupVisible(true);
          }
        },
        preferredDate
      )
    );
  };

  const denyOrderConfirmHandler = () => {
    dispatch(
      orderAction(
        id,
        "reject",
        (status, res) => {
          if (status) {
            history.push(`/partner/dashboard`);
          } else {
            setPopupType("deny");
            setPopupMsg(res);
            setPopupVisible(true);
          }
        },
        preferredDate,
        commentboxRef.current.getElementsByTagName("textarea")[0].value
      )
    );
  };

  const finishOrderConfirmHandler = () => {
    dispatch(
      finishOrderAction(
        id,
        (status: boolean, res: any) => {
          if (status) {
            history.push(`/partner/dashboard`);
          } else {
            finishOrderPopupHandler();
            setPopupType("finish");
            setPopupMsg(res);
            setPopupVisible(true);
          }
        },
        priceRef.current.children[1].children[0].value * 100
      )
    );
  };
  const onPreferredDateChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const value = event.target.value as string;
    setPreferredDate(value);
  };

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={match}
        title={<IntlMessages id="vehicle.partnerOrderOverview" />}
        textId="vehicle.partnerOrderOverview"
      />

      {!partnerOrders && !error ? (
        renderLoading
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <>
          <div className="jr-card p-0">
            <div className="card-body">
              <ul className="contact-list list-unstyled">
                <li className="media">
                  <span className="media-body">
                    <b>
                      {" "}
                      <IntlMessages id="partnerOrders.department" /> :{" "}
                    </b>
                    {partnerOrders.department}
                  </span>

                  <span className="media-body">
                    <b>
                      {" "}
                      <IntlMessages id="partnerOrders.id" /> :{" "}
                    </b>
                    {partnerOrders.id}
                  </span>

                  <span className="media-body">
                    <b>
                      {" "}
                      <IntlMessages id="partnerOrders.distance" /> :{" "}
                    </b>{" "}
                    {partnerOrders.distance}
                  </span>

                  <span className="media-body">
                    <b>
                      {" "}
                      <IntlMessages id="partnerOrders.address" /> :{" "}
                    </b>{" "}
                    {partnerOrders.address &&
                      `${partnerOrders.address.city}-${partnerOrders.address.zip_code}`}
                  </span>
                </li>

                <li className="media">
                  <span className="media-body">
                    <b>
                      <IntlMessages id="partnerOrders.createdAt" />:
                    </b>{" "}
                    {partnerOrders.created_at
                      ? moment(partnerOrders.created_at).format(
                        "MM-DD-YYYY HH:mm:ss"
                      )
                      : "-"}
                  </span>
                  <span className="media-body">
                    <b>
                      <IntlMessages id="partnerOrders.updatedAt" />:
                    </b>{" "}
                    {partnerOrders.updated_at
                      ? moment(partnerOrders.updated_at).format(
                        "MM-DD-YYYY HH:mm:ss"
                      )
                      : "-"}
                  </span>
                  <span className="media-body">
                    <b>
                      <IntlMessages id="orderDetailViewTable.totalPrice" />:
                    </b>{" "}
                    {partnerOrders &&
                      formatPrice(partnerOrders.meta.total_price)}
                  </span>
                </li>
                <li className="media">
                  <span className="media-body">
                    <h3 className="my-4">
                      <IntlMessages id="partnerUpcomingAssignment.orderDetails" />
                    </h3>
                    {partnerOrders.additional_data.map((data) => {
                      return (
                        <div key={data.key}>
                          {data.json_value.plate
                            ? `License Plate : ${data.json_value.plate}`
                            : null}
                          {data.json_value.plate ? <br /> : null}
                          Brand : {data.json_value.brand.name} <br />
                          Model : {data.json_value.model.name}
                          <br />
                          Fuel : {data.json_value.fuel.name}
                          <br />
                          Construction Year :{" "}
                          {moment(data.json_value.construction_year).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      );
                    })}
                  </span>
                </li>
              </ul>

              <PartnerOrderOverviewPreferredDatesTable
                preferredDates={preferredDates}
              />

              {partnerOrders &&
                partnerOrders.status &&
                partnerOrders.status.id &&
                partnerOrders.status.id === 3 && (
                  <div className="text-center mt-4 mb-2">
                    <Button
                      size="small"
                      className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-light-green text-white"
                      color="primary"
                      onClick={() => acceptOrderPopupHandler()}
                    >
                      <IntlMessages id="partnerOrders.accept" />
                    </Button>

                    <Button
                      size="small"
                      className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                      color="primary"
                      onClick={() => denyOrderPopupHandler()}
                    >
                      <IntlMessages id="partnerOrders.deny" />
                    </Button>
                  </div>
                )}
            </div>
          </div>
          <PaymentList paymentData={partnerOrders?.payments} />
          {/* Attachments List */}
          {partnerOrders &&
            partnerOrders?.attachments &&
            partnerOrders?.attachments.length > 0 && (
              <>
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">
                    <IntlMessages id="orderDetailViewTable.attachmentsList" />
                  </h3>
                </div>

                <Card className={`shadow border-0 `} id="order-details-table">
                  <CardBody>
                    <CardText>
                      <div className="table-responsive-material">
                        <table className="default-table table-unbordered table table-sm table-hover">
                          <thead className="th-border-b">
                            <tr>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsId" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsName" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsFileSize" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsType" />
                              </th>
                              <th>
                                <IntlMessages id="orderDetailViewTable.attachmentsMeta" />
                              </th>
                              <th style={{ textAlign: "center" }}>
                                <IntlMessages id="orderDetailViewTable.attachmentsPath" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {partnerOrders.attachments &&
                              partnerOrders.attachments.map((data: any) => {
                                return (
                                  <>
                                    <tr
                                      data-id={data.id}
                                      tabIndex={-1}
                                      key={data.id}
                                    >
                                      <td>{data.id}</td>
                                      <td>{data.name}</td>
                                      <td>
                                        {(data.filesize / 1000000).toFixed(2) +
                                          " MB"}
                                      </td>
                                      <td>{data.mime}</td>
                                      <td>
                                        {data.meta && data.meta.location
                                          ? data.meta.location
                                          : "-"}
                                      </td>
                                      <td>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          color="primary"
                                          className="btn-block"
                                          onClick={() => window.open(data.path)}
                                        >
                                          Open
                                        </Button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </CardText>
                  </CardBody>
                </Card>
              </>
            )}
          {/* Attachments List */}
          {partnerOrders &&
          partnerOrders.status &&
          (partnerOrders.status.name === "awaiting_completion" ||
            partnerOrders.status.name === "scheduled") ? (
            <Button
              className="MuiButtonBase-root MuiButton-root MuiButton-contained bg-primary text-white mb-5"
              color="primary"
              onClick={finishOrderPopupHandler}
            >
              <IntlMessages id="services.finishOrder" />
            </Button>
          ) : (
            <div className="mb-5"></div>
          )}
        </>
      )}

      <SweetAlert
        show={finishPopup}
        warning
        title={<IntlMessages id="sweetAlerts.finishOrderWarning" />}
        showOk
        showCancel
        cancelBtnText={
          <IntlMessages id="partnerOrderSweetAlerts.cancelButton" />
        }
        confirmBtnText={<IntlMessages id="appModule.finish" />}
        onConfirm={finishOrderConfirmHandler}
        onCancel={finishOrderPopupHandler}
      >
        <div
          className="alert alert-warning"
          role="alert"
          style={{ fontSize: "12px" }}
        >
          <IntlMessages
            id="partnerOrderSweetAlerts.warningMsg"
            values={{
              termsandconditions: (
                <a href="https://serviceright-autos.nl/algemene-voorwaarden-bedrijven/">
                  <IntlMessages id="partnerOrderSweetAlerts.terms" />
                </a>
              ),
            }}
          />
        </div>
        <FormControl className="col-12">
          <TextField
            ref={priceRef}
            type="text"
            label={<IntlMessages id="partnerUpcomingAssignment.price" />}
            variant="outlined"
          />
        </FormControl>
      </SweetAlert>
      <SweetAlert
        show={acceptPopup}
        title={
          <div className="mt-2 mb-2">
            <IntlMessages id="partnerOrders.confirmPopupTitle" />
          </div>
        }
        showOk
        showCancel
        cancelBtnText={
          <IntlMessages id="partnerOrderSweetAlerts.cancelButton" />
        }
        confirmBtnText={
          <IntlMessages id="partnerOrderSweetAlerts.confirmButton" />
        }
        onConfirm={acceptOrderConfirmHandler}
        onCancel={() => acceptOrderPopupHandler()}
      >
        <Card className={`shadow border-0 `} id="order-table">
          <CardBody>
            <CardText>
              <div className="table-responsive-material">
                <table className="default-table table-unbordered table table-sm table-hover">
                  <thead className="th-border-b">
                    <tr>
                      <th>
                        <IntlMessages id="partnerOrders.tableServiceId" />
                      </th>
                      <th>
                        <IntlMessages id="partnerOrders.tableName" />
                      </th>
                      <th>
                        <IntlMessages id="companiesTable.tableTotalPrice" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerOrders &&
                      partnerOrders.services &&
                      partnerOrders.services.map((data) => {
                        return (
                          <tr tabIndex={-1} key={data.id}>
                            <td>{data.service_id}</td>
                            <td>{data.name}</td>
                            <td>
                              {formatPrice(data.calculated_price_inc_vat)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardText>
          </CardBody>
        </Card>
        <FormControl className="w-100 mt-2 h-75">
          <InputLabel id="preferred_dates-simple-select-helper-label">
            <IntlMessages id={`preferredDate`} />
          </InputLabel>
          <Select
            labelId="preferred_dates-simple-select-helper-label"
            id="preferred_dates-simple-select-helper"
            value={preferredDate}
            onChange={onPreferredDateChange}
          >
            {preferredDates.length > 0 &&
              preferredDates.map((option: any) => {
                return (
                  <MenuItem value={option.id}>
                    {readableDateTimeLocale(
                      option.start_date,
                      "MM-DD-YYYY HH:mm:ss"
                    )}{" "}
                    - {option.description}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </SweetAlert>

      <SweetAlert
        show={denyPopup}
        warning
        title={
          <div className="mt-2 mb-2">
            <IntlMessages id="partnerOrders.denyPopupTitle" />
          </div>
        }
        showOk
        showCancel
        cancelBtnText={
          <IntlMessages id="partnerOrderSweetAlerts.cancelButton" />
        }
        confirmBtnText={
          <IntlMessages id="partnerOrderSweetAlerts.confirmButton" />
        }
        onConfirm={denyOrderConfirmHandler}
        onCancel={() => denyOrderPopupHandler()}
      >
        <FormControl className="col-12">
          <TextField
            ref={commentboxRef}
            type="text"
            className="col-12"
            id="outlined-multiline-static"
            label={<IntlMessages id="partnerOrders.denyComments" />}
            multiline
            rows={4}
            variant="outlined"
          />
        </FormControl>
      </SweetAlert>
      <AlertPopUp
        title={
          popupType === "accept" ? (
            <IntlMessages id="sweetAlerts.acceptFail" />
          ) : popupType === "finish" ? (
            <IntlMessages id="sweetAlerts.finishFail" />
          ) : (
            <IntlMessages id="sweetAlerts.rejectFail" />
          )
        }
        show={popupVisible}
        message={popupMsg}
        danger
        confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
        onConfirm={() => setPopupVisible(false)}
      />
    </div>
  );
};

export default PartnerOrderOverview;
