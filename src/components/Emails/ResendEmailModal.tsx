import { getEmailOpens } from 'actions/Actions/MarketingAction';
import React, { useState, useEffect } from 'react'
import { useIntl } from "react-intl";
import { readableDateTimeLocale } from "../../util/helper";
import CardMenuEmail from '../dashboard/Common/CardMenuEmail/CardMenuEmail'
import IntlMessages from '../../util/IntlMessages';
import {
    Tooltip,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardText, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Chip, Input, MenuItem, Select, TextField, Grid, FormControl, Button } from '@material-ui/core';
import { Formik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "../../util/Api"

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const ResendEmailModal: React.FC<any> = ({
    toggleModal,
    showModal,
    id
}) => { 

    const [errorMssg, setErrorMssg] = useState("");
    const [showErrorMssg, setShowErrorMssg] = useState(false);
    const [showSuccessMssg, setShowSuccessMssg] = useState(false);

    const resendEmailApi = async (values) => {
        try { 
            await axios.put(`/mail/system/automated-emails/${id}/resend`, values);
            toggleModal(false);
            setShowSuccessMssg(true);
        } catch (error) {
            toggleModal(false);
            setErrorMssg(error.message);
            setShowErrorMssg(true);
        }
    }

    return (
        <>
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
        </>
    )

}

export default ResendEmailModal;