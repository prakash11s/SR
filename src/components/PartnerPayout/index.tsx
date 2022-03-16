import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import {
  getPartnerPayoutMethods,
  addPartnerPayoutMethods,
} from "actions/Actions/PartnerViewActions";
import { IconButton, TextField } from "@material-ui/core";
import PaginationTable from "common/PaginationTable";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Modal, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";

export const PartnerInvoices = (props) => {
  const dispatch = useDispatch();
  const [payoutData, setPayoutData] = useState([]);
  const [meta, setMeta] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addError, setAddError] = useState<any>(null);
  const [successPopup, setSuccessPopup] = useState(false);


  const payoutColumns = [
    {
      name: "paginationTable.name",
      key: "name",
    },
    {
      name: "partnerSettings.iban",
      key: "iban_formatted",
    },
    {
      name: "partnerSettings.bic",
      key: "bic",
    },
    {
      name: "paginationTable.active",
      key: "activated",
      render: (data) => (data.activated ? "True" : "False"),
    },
  ];

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  useEffect(() => {
    fetchData({ page: 0, limit: 25 });
  }, []);

  // const verifyData = () => {
  //   return name === "" || iban === "" || bic === "";
  // };

  const fetchData = ({ page, limit }) => {
    dispatch(
      getPartnerPayoutMethods((status, res) => {
        if (status) {
          setPayoutData(res.data);
          setMeta(res.meta);
          setError("");
        } else {
          setError(res);
        }
        setLoading(false);
      })
    );
  };


  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.payoutMethods" />}
      />

      {!payoutData.length && (
        <Button className="ml-auto d-flex" onClick={toggleCreateModal}>
          <IntlMessages id="partner.addPaymentMethod" />
        </Button>
      )}
      <PaginationTable
        meta={meta}
        dataList={payoutData}
        columns={payoutColumns}
        loading={loading}
        onChange={fetchData}
        error={error}
      />

      <Modal
        isOpen={showCreateModal}
        toggle={toggleCreateModal}
      // style={{ maxWidth: "500px" }}
      >
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="partner.addPaymentMethod" />
          <IconButton className="text-white">
            <CloseIcon onClick={toggleCreateModal} />
          </IconButton>
        </ModalHeader>

        <Formik
          initialValues={{ name: '', iban: '', bic: '' }}
          onSubmit={values => {
        
            dispatch(
              addPartnerPayoutMethods(values, (status, response) => {
                if (status) {
                  setShowCreateModal(false);
                  setSuccessPopup(true);
                } else {
                  setAddError({ message: response });
                }
              })
            );
          }}
          validate={(values) => {
            let errors = {};
            if (!values.name) {
              errors['name'] =    <IntlMessages id="paymentNameRequired" />;
            }
            if (!values.iban) {
              errors['iban'] =    <IntlMessages id="paymentIbanRequired" />;
            }
            if (!values.bic) {
              errors['bic'] =    <IntlMessages id="paymentBicRequired" />;
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
              <div className="pl-4 pr-4 pb-3 pt-3">
                <TextField
                  className="mt-0 mb-4"
                  label={<IntlMessages id="paginationTable.name" />}
                  margin="normal"
                  fullWidth
                  type="text"
                  name="name"
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : ''}
                  // value={name}
                  value={values.name}
                  onChange={handleChange}
                // onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  className="mt-0 mb-4"
                  label={<IntlMessages id="partnerSettings.iban" />}
                  margin="normal"
                  fullWidth
                  name="iban"
                  type="text"
                  error={errors.iban && touched.iban}
                  helperText={errors.iban && touched.iban ? errors.iban : ''}
                  // value={iban}
                  value={values.iban}
                  onChange={handleChange}
                // onChange={(e) => setIban(e.target.value)}
                />
                <TextField
                  className="mt-0 mb-4"
                  label={<IntlMessages id="partnerSettings.bic" />}
                  name="bic"
                  margin="normal"
                  fullWidth
                  type="text"
                  error={errors.bic && touched.bic}
                  helperText={errors.bic && touched.bic ? errors.bic : ''}
                  // value={bic}
                  value={values.bic}
                  onChange={handleChange}
                // onChange={(e) => setBic(e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <Button
                    size="small"
                    onClick={toggleCreateModal}
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
                  // disabled={verifyData()}
                  // onClick={updatePaymentMethod}
                  >
                    <IntlMessages id="partner.add" />
                  </Button>
                </div>
              </div>

            </form>

          )}
        </Formik>

      </Modal>


      <SweetAlert
        show={addError}
        warning
        confirmBtnBsStyle="danger"
        confirmBtnText="Okay"
        onConfirm={() => setAddError(null)}
        title="Error"
      >
        {addError?.message}
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
    </div>
  );
};

export default PartnerInvoices;
