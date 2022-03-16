import React, { Component, useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardText, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContainerHeader from '../../components/ContainerHeader/index';
import IntlMessages from '../../util/IntlMessages';
import { Avatar, Chip, Input, MenuItem, Select, TextField, Grid, FormControl, Button } from '@material-ui/core';
import axios from "../../util/Api"
import Loader from 'containers/Loader/Loader';
import { useParams } from "react-router";
import { useIntl } from "react-intl";
import { Formik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import { readableDateTimeLocale } from "../../util/helper";


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const EmailDetail: React.FC<any> = (props) => {


    let { id, notifyId } = useParams();
    const [emailDetail, setEmailDetail] = useState<any>({});
    const [emailID, setEmailID] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [errorMssg, setErrorMssg] = useState("");
    const [showErrorMssg, setShowErrorMssg] = useState(false);
    const [successMssg, setSuccessMssg] = useState("")
    const [showSuccessMssg, setShowSuccessMssg] = useState(false);
    const [emailDetailFile, setEmailDetailFile] = useState<any>(undefined);
    const [showModal, setShowModal] = useState<boolean>(false);

    const intl = useIntl();

    const emailDetailApi = async (id, emailId) => {
       
        setIsLoading(true);
        try {
            const response = await axios.get(`/orders/${id}/emails/${emailId}`);
            const { data } = await axios.get(`/mail/system/automated-emails/${emailId}/contents`);
            const emailAWSFile = data?.data && data?.data?.link ? data.data.link : undefined;

            setEmailDetailFile(emailAWSFile)
          
            const details = response?.data && response.data?.data ? response.data.data : {};
            setEmailDetail(details);
            setIsLoading(false);

        } catch (error) {
            setErrorMssg(error.message);
            setIsLoading(false);
        }
    }

    const RecipientCell = ({
        obj
    }) => {

        const toTitle = obj?.to ? `${obj?.to.name} <${obj.to.email}>` : '-';
        const bccTitles = obj?.bcc?.length > 0 ? obj?.bcc : [];

        return (
            <ul className="table_recipient_cell m-0 p-0">
                <li><span><IntlMessages id="toTitle" />:</span> {toTitle} </li>
                <li><span><IntlMessages id="bccEmail" />:</span>
                    {bccTitles.length > 0 ? bccTitles.map((bccObj, i) => {
                        return (
                            `${bccObj?.name} <${bccObj?.email}>`
                        )
                    }) : '-'}
                </li>
            </ul>
        )
    }

    const dateTimeCell = (datetime) => {
        const localDateTimeFormat = intl.formatMessage({ id: 'localeDateTime', defaultMessage: "DD-MM-YYYY hh:mm:ss" });
        const formattedOrderDate = (datetime && readableDateTimeLocale(datetime, localDateTimeFormat));
        return formattedOrderDate;
    }


    const toggleModal = () => {
        setShowModal(!showModal)
    }


    const resendEmailApi = async (values) => {
        try {
            await axios.put(`/mail/system/automated-emails/${id}/resend`, values);
            setShowModal(false);
            setShowSuccessMssg(true);
        } catch (error) {
            setShowModal(false);
            setErrorMssg(error.message);
            setShowErrorMssg(true);
        }
    }
    
  
    useEffect(() => {
        if (id) { 
            emailDetailApi(id, notifyId)
        }
    }, [id]);

    return (
        <>
            {/* <ContainerHeader title={<IntlMessages id="sidebar.emails.system" />} match={props.match} /> */}
            <Card className={`shadow border-0 `} id="order-table">
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <CardText>
                                {isLoading ? <Loader /> : (
                                    <>
                                        <h1><IntlMessages id="email_detail" /></h1>
                                        <ul className="table_recipient_cell m-0 p-0">
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="subject" />:</span> {emailDetail?.['subject'] ? emailDetail?.['subject'] : '-'} </li>
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="sender" />:</span> {emailDetail?.['sender'] ? `${emailDetail.sender.name} <${emailDetail.sender.email}>` : '-'} </li>
                                            <li className="mb-2 recipient_detail"><span className="email_detail_span"><IntlMessages id="recipients" />:</span> <RecipientCell obj={emailDetail.recipients} /> </li>
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="open_count" />:</span> {emailDetail.opens_counts} </li>
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="driver" />:</span> {emailDetail?.driver ? emailDetail?.driver : '-'} </li>
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="status" />:</span> {emailDetail?.status ? emailDetail?.status : '-'} </li>
                                            <li className="mb-2"><span className="email_detail_span"><IntlMessages id="created_date" />:</span> {emailDetail?.created_at ? dateTimeCell(emailDetail?.created_at) : '-'} </li>
                                        </ul>
                                        <Button
                                            size="small"
                                            className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn  bg-primary text-white"
                                            color="primary"
                                            onClick={toggleModal}
                                        >
                                            <IntlMessages id="resend" />
                                        </Button>
                                    </>
                                )}

                            </CardText>
                        </Grid>
                        <Grid item xs={6}>

                            <CardText >
                                {emailDetailFile && (
                                    <iframe src={emailDetailFile} width="100%" height="500px"></iframe>
                                )}

                            </CardText>
                        </Grid>
                    </Grid>

                </CardBody>
            </Card>
            
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
    )
}

export default EmailDetail;