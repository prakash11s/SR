import React, { useCallback, useState } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { debounce } from "lodash";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import IntlMessages from "../../../util/IntlMessages";
import axios from "../../../util/Api";
import { readableDateTimeLocale } from "util/helper";

const UnsubscribeModal = ({
  show,
  toggleAcceptPopup,
  buttonsList,
  onConfirm,
  selectedButton,
  setSelectedButton,
  vehicle,
  setVehicle,
}: any) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onLicensePlateChange = (e) => {
    axios
      .get(
        `/vehicle-information-service/information?license-plate=${e.target.value}`
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setVehicle(res.data);
        } else {
          setError("Vehicle not found.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };

  const debouncedChangeHandler = useCallback(
    debounce(onLicensePlateChange, 1000),
    []
  );

  return (
    <div>
      <Modal isOpen={show} toggle={toggleAcceptPopup} className="modal-align">
        <ModalHeader toggle={toggleAcceptPopup}>
          <IntlMessages id="callQueueListActionButton.unsubscribe" />
        </ModalHeader>
        <ModalBody>
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <IntlMessages id="orderOptions.reason" />
              </FormLabel>
              <RadioGroup
                aria-label="Select Rechedule"
                name="radio-buttons-group"
                onChange={(e) => {
                  const btn = buttonsList.find(
                    (bt) => bt.id === parseInt(e.target.value)
                  );
                  setVehicle(null);
                  setSelectedButton(btn);
                }}
              >
                {buttonsList.map((button) => (
                  <FormControlLabel
                    value={button.id.toString()}
                    control={<Radio />}
                    label={button.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {selectedButton &&
            selectedButton.key !== "customer.do-not-call-anymore" ? (
              <>
                <hr />
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <IntlMessages id="callQueue.newLicensePlate" />
                    <Input
                      className="mt-2"
                      onChange={(event) => {
                        event.persist();
                        setLoading(true);
                        setVehicle(null);
                        setError("");
                        debouncedChangeHandler(event);
                      }}
                    />
                    {loading && (
                      <div className="mt-2">
                        <IntlMessages id="sweetAlerts.sendCallBackLoading" />
                      </div>
                    )}
                    {error && <div className="text-danger mt-2">{error}</div>}
                  </div>
                  {vehicle && (
                    <div>
                      <b>
                        <IntlMessages id="brand" />
                      </b>
                      : {vehicle.brand.name}
                      <br />
                      <b>
                        <IntlMessages id="model" />
                      </b>
                      : {vehicle.model.name}
                      <br />
                      {vehicle.mandatory_service_expiry_date ? (
                        <>
                          <b>
                            <IntlMessages id="mandatory_service_expiry" />
                          </b>
                          :{" "}
                          <span>
                            {readableDateTimeLocale(
                              vehicle.mandatory_service_expiry_date,
                              "DD-MM-YYYY"
                            )}
                          </span>
                          <br />
                        </>
                      ) : null}
                      <b>
                        <IntlMessages id="vehicleStepperStep1.constructionYear" />
                      </b>
                      :{" "}
                      {readableDateTimeLocale(
                        vehicle.construction_year,
                        "DD-MM-YYYY"
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
            <div className="d-flex w-100 justify-content-between mt-4">
              <Button onClick={toggleAcceptPopup} color="danger">
                <IntlMessages id="sweetAlerts.cancelButton" />
              </Button>
              <Button
                disabled={
                  selectedButton &&
                  selectedButton.key !== "customer.do-not-call-anymore" &&
                  !vehicle
                }
                onClick={onConfirm}
                color="success"
              >
                <IntlMessages id="callQueueListActionButton.approve" />
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default UnsubscribeModal;
