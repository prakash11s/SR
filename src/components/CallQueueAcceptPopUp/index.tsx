import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../util/IntlMessages";

const AcceptPopUp = ({
  show,
  toggleAcceptPopup,
  onConfirm,
  price,
  setPrice,
}: any) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <Modal isOpen={show} toggle={toggleAcceptPopup} className="modal-align">
        <ModalHeader toggle={toggleAcceptPopup}>
          <IntlMessages id="partnerOrders.accept" />
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <div>
              <IntlMessages id="callQueue.priceText" />
            </div>
            <CurrencyInput
              placeholder="Enter price"
              allowDecimals={true}
              decimalsLimit={2}
              prefix="€"
              precision={2}
              value={price}
              className={`form-control my-4 w-50 mx-auto ${
                hasError ? "has-error" : ""
              }`}
              onChange={(value) => setPrice(value)}
            />
            <Button onClick={toggleAcceptPopup} color="danger">
              <IntlMessages id="sweetAlerts.cancelButton" />
            </Button>
            <Button
              onClick={() => {
                if (!price) setHasError(true);
                else {
                  onConfirm("accept");
                  setHasError(false);
                }
              }}
              color="success"
            >
              <IntlMessages id="callQueueListActionButton.approve" />
            </Button>
          </div>
          <Button
            style={{ float: "right", marginTop: "-36px" }}
            onClick={() => onConfirm("accept")}
            color="danger"
            outline
          >
            <IntlMessages id="unknownTitle" />
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AcceptPopUp;
