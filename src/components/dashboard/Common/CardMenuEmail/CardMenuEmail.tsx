import React, { useState, useEffect } from "react";
import Menu from "@material-ui/core/Menu";
import axios from "../../../../util/Api"
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardText, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Avatar, Chip, Input, MenuItem, Select, TextField, Grid, FormControl, Button } from '@material-ui/core';
import IntlMessages from "util/IntlMessages";
import UserHasPermission from "../../../../util/Permission";
import { ICardMenuProps, ICardMenuState } from "./Interface/CardMenuEmailInterface";
import { Formik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const CardMenuEmail = (props) => {

  const [errorMssg, setErrorMssg] = useState("");
  const [showErrorMssg, setShowErrorMssg] = useState(false);
  const [showSuccessMssg, setShowSuccessMssg] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => {
    props.handleClose();
    setShowModal(!showModal)
  }


  const resendEmailApi = async (values) => {
    try {
      await axios.put(`/mail/system/automated-emails/${props.emailId}/resend`, values);
      setShowModal(false);
      setShowSuccessMssg(true);
    } catch (error) {
      setShowModal(false);
      setErrorMssg(error.message);
      setShowErrorMssg(true);
    }
  }



  return (
    <>
      <Menu
        keepMounted
        anchorReference="anchorPosition"
        anchorPosition={{ left: props.style?.x, top: props.style?.y }}
        open={props.menuState}
        onClose={props.handleRequestClose}
        MenuListProps={{
          style: {
            width: "auto",
            paddingTop: 0,
            paddingBottom: 0,

          },
        }}
      >
        <MenuItem
          onClick={(e) =>
            props.handleRequestClose(e, props?.isSystemEmail ? `/support/emails/${props.emailId}` : `/support/orders/${props.orderId}/emails/${props.emailId}`)
          }
        >
          <IntlMessages id={"openEmail"} />
        </MenuItem>
        <MenuItem
          onClick={() => toggleModal()}
        >
          <IntlMessages id={"resendEmail"} />
        </MenuItem>
      </Menu>

      {/* Resent email modal */}
      <Modal
        isOpen={showModal}
        toggle={toggleModal}
        className="modal-align"
        keyboard={false}
        backdrop="static"
      >
        {/* { isSubmitting && <Loader/> } */}
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id={"resendEmail"} />
        </ModalHeader>
        <Formik
          initialValues={{ email: '', name: '' }}
          onSubmit={values => {
            resendEmailApi(values);
          }}
          validate={(values) => {
            let errors = {};
            if (!values.name) {
              errors['name'] = <IntlMessages id="paymentNameRequired" />;
            }
            if (!values.email) {
              errors['email'] = <IntlMessages id="emailRequired" />;
            } else {
              if (!emailRegex.test(values.email)) {
                errors['email'] = <IntlMessages id="invalidEmail" />;
              }
            }

            return errors;
          }}>

          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched
          }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <div className="col-12">
                  <FormControl className="w-100 mb-2">
                    <TextField
                      className="mt-0 mb-4"
                      label={<IntlMessages id="appModule.email" />}
                      margin="normal"
                      fullWidth
                      type="text"
                      name="email"
                      error={errors.email && touched.email}
                      helperText={errors.email && touched.email ? errors.email : ''}
                      value={values.email}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
                <div className="col-12">
                  <FormControl className="w-100 mb-2">
                    <TextField
                      className="mt-0 mb-4"
                      label={<IntlMessages id="appModule.name" />}
                      margin="normal"
                      fullWidth
                      type="text"
                      name="name"
                      error={errors.name && touched.name}
                      helperText={errors.name && touched.name ? errors.name : ''}
                      value={values.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    size="small"
                    onClick={toggleModal}
                    className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-red text-white"
                    color="primary"
                  >
                    <IntlMessages id="sweetAlerts.cancelButton" />
                  </Button>

                  <Button
                    size="small"
                    className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-info text-white"
                    color="primary"
                    type="submit"
                  >
                    <IntlMessages id="send" />
                  </Button>
                </div>
              </ModalBody>

            </form>

          )}
        </Formik>
      </Modal>
      <SweetAlert
        show={showErrorMssg} error title="Error"
        loading
        confirmBtnText="Okay" onConfirm={() => setShowErrorMssg(false)}>
        {errorMssg}
      </SweetAlert>
      <SweetAlert
        show={showSuccessMssg}
        success title="Success"
        confirmBtnText="Okay"
        onConfirm={() => setShowSuccessMssg(false)}>
        <IntlMessages id="emailSuccessSentMssg" />
      </SweetAlert>
      {/* Resent email modal */}
    </>
  );
}

export default CardMenuEmail;
