import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { useParams } from "react-router";
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";

import ContainerHeader from '../ContainerHeader';
import IntlMessages from '../../util/IntlMessages';

import {
  setCallQueueIdData,
  setName,
  setDescription,
  setDepartment,
  setOrder,
  saveEditedData,
  toggleAlertPopUp
} from 'actions/Actions/callQueueListActions';

const CallQueueIdEdit = (props: any) => {

  const match = useRouteMatch();
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setCallQueueIdData(id));
  }, []);

  const CallQueueIdEditData = useSelector((state: any) => state.callQueueState.callQueueIdData);
  const CallQueueIdEdit = useSelector((state: any) => state.callQueueState);

  const onAlertConfirm = () => {
    dispatch(toggleAlertPopUp())
    history.replace('/support/call-queues')
  }

  return (
    <>
      <ContainerHeader title={<IntlMessages id="callQueueIdEdit.title" />} match={match} />
      <Card className="shadow border-0">
        <h1 className="text-center mt-4"><IntlMessages id="callQueueIdEdit.edit" /></h1>
        <h5 className="text-center mb-5"><IntlMessages id="callQueueIdEdit.SubTitle" /></h5>
        <CardBody>

          <>

            <div className="row col-12">
              <div className="d-flex col-4">
                <label className="mt-2"><IntlMessages id="callQueueListEdit.name" />:</label>
                <Input
                  placeholder="Name"
                  className="mb-3 ml-4 w-75"
                  value={CallQueueIdEditData && CallQueueIdEditData.name}
                  onChange={(event) => dispatch(setName(event.target.value))}
                />
              </div>

              <div className="d-flex col-4">
                <label className="mt-2"><IntlMessages id="callQueueListEdit.description" />:</label>
                <Input
                  placeholder="Description"
                  className="mb-3 ml-4 w-75"
                  value={CallQueueIdEditData && CallQueueIdEditData.description}
                  onChange={(event) => dispatch(setDescription(event.target.value))}
                />
              </div>

              <div className="d-flex col-4">
                <label className="mt-2"><IntlMessages id="callQueueListEdit.department" />:</label>
                <Input
                  placeholder="Department"
                  className="mb-3 ml-4 w-75"
                  value={CallQueueIdEditData && CallQueueIdEditData.department}
                  onChange={(event) => dispatch(setDepartment(event.target.value))}
                />
              </div>
            </div>

            <div className="row col-12 mt-3">
              <div className="d-flex col-4">
                <label className="mt-2"><IntlMessages id="callQueueListEdit.order" />:</label>
                <Input
                  placeholder="Order"
                  className="mb-3 ml-4 w-75"
                  value={CallQueueIdEditData && CallQueueIdEditData.order}
                  onChange={(event) => dispatch(setOrder(Number(event.target.value)))}
                />
              </div>

              <div className="d-flex col-8">
                <label className="mt-2"><IntlMessages id="callQueueListEdit.image" />:</label>
                <img src={CallQueueIdEditData.image} alt={CallQueueIdEditData.name} className="img-responsive ml-5" style={{ width: "100px", height: "50px" }} />
              </div>

              <div className="col text-center mt-5">
                <Button size="small"
                  className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-primary text-white w-25"
                  color="primary"
                  onClick={() => dispatch(saveEditedData(CallQueueIdEditData.id, CallQueueIdEditData.order, CallQueueIdEditData.name, CallQueueIdEditData.description))}
                >
                  <IntlMessages id="callQueueListEdit.save" />
                </Button>
              </div>

            </div>

          </>
        </CardBody>

      </Card>


      <SweetAlert
        show={CallQueueIdEdit.editFailed}
        warning
        title={<IntlMessages id="callQueueListEdit.alertPopupFailed" />}
        confirmBtnText={<IntlMessages id="callQueueListEdit.alertButtonOkay" />}
        onConfirm={() => dispatch(toggleAlertPopUp())}>
      </SweetAlert>

      <SweetAlert
        show={CallQueueIdEdit.editSuccess}
        success
        title={<IntlMessages id="callQueueListEdit.alertPopupSuccess" />}
        confirmBtnText={<IntlMessages id="callQueueListEdit.alertButtonOkay" />}
        onConfirm={() => onAlertConfirm()}>
      </SweetAlert>

    </>
  )
}

export default CallQueueIdEdit
