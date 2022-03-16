import React, { useEffect, useState } from "react";

import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import PaginationTable from "common/PaginationTable";
import { Button, Input, TextField } from "@material-ui/core";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  enableService,
  getServices,
  updateService,
  updateServiceComment,
} from "actions/Actions/ServicesActions";
import { useParams } from "react-router";
import { DatePicker } from "material-ui-pickers";
import { readableDateTimeLocale } from "util/helper";
import { useIntl } from "react-intl";

const ServiceList = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  let { id } = useParams<any>();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState<any>();
  const [comment, setComment] = useState<any>();
  const [date, setDate] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<any>();
  const [selectedService, setSelectedService] = useState<any>();
  const [isAfterDate, setIsAfterDate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<any>(null);
  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    if (id) fetchData({ page: 0, limit: 25 });
  }, [id]);

  const servicesColumns = [
    {
      name: "paginationTable.name",
      key: "name",
    },
    {
      name: "paginationTable.enabled",
      key: "action",
      render: (data) => renderEnabled(data),
    },
    {
      name: "paginationTable.price",
      key: "action",
      render: (data) => renderPrice(data),
    },
    {
      name: "paginationTable.after_date",
      key: "service",
      render: (data) => renderAfterDate(data),
    },
    {
      name: "CallQueueCommentPopUp.comment",
      key: "action",
      render: (data) => renderComment(data),
    },
  ];

  const renderPrice = (data) => {
    if (data.service && data.service.static_price && data.service.price) {
      return (data.service.price / 100).toFixed(2);
    }
  };

  const renderEnabled = (data) => {
    if (data.service) {
      return readableDateTimeLocale(
        data.service.enabled,
        "DD-MM-YYYY HH:mm:ss"
      );
    }
    return (
      <Button
        size="small"
        className="jr-btn bg-blue-grey text-white"
        color="primary"
        onClick={() => {
          toggleModal();
          setSelectedServiceId(data.id);
          setSelectedService(data);
        }}
      >
        <span>{<IntlMessages id="services.enable" />}</span>
      </Button>
    );
  };

  const renderAfterDate = (data) => {
    if (!data.service) return null;
    if (data.service.after_date) {
      return readableDateTimeLocale(data.service.after_date, "DD-MM-YYYY");
    }
    return (
      <Button
        size="small"
        className="jr-btn bg-blue-grey text-white"
        color="primary"
        onClick={() => {
          toggleModal();
          setSelectedServiceId(data.service.id);
          setSelectedService(data);
          setIsAfterDate(true);
        }}
      >
        <span>{<IntlMessages id="services.setDate" />}</span>
      </Button>
    );
  };

  const renderComment = (data) => {
    if (data.service)
      return (
        <>
          <div>{data.service && data.service.comment}</div>
          <Button
            size="small"
            className="jr-btn jr-btn-sm mr-0"
            color="primary"
            onClick={() => {
              toggleModal();
              setIsEdit(true);
              setComment(data.service.comment);
              setSelectedServiceId(data.service.id);
              setSelectedService(data);
            }}
          >
            <IntlMessages id="employeesTable.editButton" />
          </Button>
        </>
      );
  };

  const fetchData = ({ page, limit }) => {
    dispatch(
      getServices(id, page + 1, limit, (status, respose) => {
        setLoading(false);
        if (status) {
          setServices(respose.data);
        } else {
          setError(respose);
        }
      })
    );
  };

  const toggleModal = () => {
    if (!showModal) {
      setIsAfterDate(false);
      setIsEdit(false);
    }
    setDate(null);
    setComment(undefined);
    setPrice(undefined);
    setShowModal(!showModal);
  };

  const onSave = () => {
    if (isAfterDate) {
      dispatch(
        updateService(
          id,
          selectedServiceId,
          {
            price: price ? price * 100 : undefined,
            after_date: date ? date : undefined,
            comment,
          },
          (status, response) => {
            if (status) {
              setShowModal(false);
              setSuccessPopup(true);
            } else {
              setUpdateError({
                message: Object.keys(response.errors).length
                  ? response.errors[
                      Object.keys(response.errors)[
                        Object.keys(response.errors).length - 1
                      ]
                    ][0]
                  : response.message,
              });
            }
          }
        )
      );
    } else if (isEdit) {
      dispatch(
        updateServiceComment(
          id,
          selectedServiceId,
          { comment },
          (status, response) => {
            if (status) {
              setShowModal(false);
              setSuccessPopup(true);
            } else {
              setUpdateError({
                message: Object.keys(response.errors).length
                  ? response.errors[
                      Object.keys(response.errors)[
                        Object.keys(response.errors).length - 1
                      ]
                    ][0]
                  : response.message,
              });
            }
          }
        )
      );
    } else {
      dispatch(
        enableService(
          id,
          {
            price: price ? price * 100 : undefined,
            after_date: date ? date : undefined,
            comment,
            service_id: selectedServiceId,
          },
          (status, response) => {
            if (status) {
              setShowModal(false);
              setSuccessPopup(true);
            } else {
              setUpdateError({ message: response });
            }
          }
        )
      );
    }
  };

  return (
    <>
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="sidebar.services" />}
      />
      <PaginationTable
        meta={{}}
        dataList={services}
        columns={servicesColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />
      <Modal
        isOpen={showModal}
        toggle={toggleModal}
        className="modal-align"
        keyboard={false}
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          {isAfterDate || isEdit ? (
            <IntlMessages id="orderDetailViewTable.update" />
          ) : (
            <IntlMessages id="services.enable" />
          )}
          &nbsp;
          {!isEdit && <IntlMessages id="orderDetailViewTable.name" />}
        </ModalHeader>
        <ModalBody>
          {!isEdit && (
            <>
              {selectedService && selectedService.static && (
                <div className="row">
                  <div className="d-flex col-12 align-items-end mb-2">
                    <label className="mt-2">
                      <IntlMessages id="services.price" />:
                      &emsp;&emsp;&emsp;&emsp;&emsp;
                    </label>
                    <Input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                    />
                  </div>
                </div>
              )}
              <div className="row">
                <div className="d-flex col-12 align-items-end mb-2">
                  <label className="mt-2">
                    <IntlMessages id="paginationTable.after_date" />:
                    &emsp;&emsp;&emsp;
                  </label>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={date}
                    minDate={new Date()}
                    animateYearScrolling={false}
                    leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                    rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                    onChange={(date) => setDate(date)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="row">
            <div className="d-flex col-12 align-items-end mb-2">
              <label className="mt-2">
                <IntlMessages
                  id={"CallQueueCommentPopUp.comment"}
                  defaultMessage={"Comment"}
                />
                : &emsp;&emsp;&emsp;
              </label>
              <TextField
                rows="4"
                type="input"
                multiline={true}
                value={comment}
                className="w-80 mb-2 h-75 form-control"
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            size="small"
            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
            color="primary"
            onClick={onSave}
          >
            {isAfterDate || isEdit ? (
              <IntlMessages id="orderDetailViewTable.update" />
            ) : (
              <IntlMessages id="services.enable" />
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <SweetAlert
        show={updateError}
        warning
        confirmBtnBsStyle="danger"
        confirmBtnText="Okay"
        onConfirm={() => setUpdateError(null)}
        title="Error"
      >
        {updateError?.message}
      </SweetAlert>
      <SweetAlert
        show={successPopup}
        success
        confirmBtnText="Great"
        onConfirm={() => {
          setSuccessPopup(false);
          fetchData({ page: 0, limit: 25 });
        }}
        title="Success"
      />
    </>
  );
};
export default ServiceList;
