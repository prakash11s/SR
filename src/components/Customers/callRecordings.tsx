import React, { useEffect, useState } from "react";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import {
    downloadRecording,
    getCallRecordings,
    updateRecording,
} from "actions/Actions/CallRecordingActions";
import PaginationTable from "common/PaginationTable";
import {
    Button, FormControl, TextField, Select,
    InputLabel, MenuItem
} from "@material-ui/core";
import AlertPopUp from "common/AlertPopUp";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { useIntl } from "react-intl";

import "react-nice-dates/build/style.css";
import { sortObjectOnKeys } from 'util/helper';
import axios from "../../util/Api";



const CallQueueOverviewTable = (props) => {

    const intl = useIntl();

    const dispatch = useDispatch();
    const [callRecords, setCallRecords] = useState<any>([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [recordingUrl, setRecordingUrl] = useState<any>({});
    const [updateData, setUpdateData] = useState<any>({});
    const [updateError, setUpdateError] = useState<any>(null);
    const [successPopup, setSuccessPopup] = useState(false);

    const [apiProps, setApiProps] = useState({
        page: 1,
        limit: 10
    })

    const [callRecordColumns, setcallRecordColumns] = useState([
        {
            name: "paginationTable.id",
            key: "id",
        },
        {
            name: "employeeAccountOverview.alias",
            key: "alias",
        },
        {
            name: "callHistory.agent",
            key: "agent",
            render: (data) => renderAgent(data),
        },
        {
            name: "callHistory.phone-number",
            key: "phone_number",
        },
        {
            name: "extension",
            key: "extension_id",
        },
        {
            name: "orderDetailViewTable.attachmentsFileSize",
            key: "filesize",
            render: (data) => renderFileSize(data),
        },
        {
            name: "paginationTable.inbound",
            key: "is_inbound",
            render: (data) => renderBooleanLabel(data,),
        },
        {
            name: "paginationTable.recordedAt",
            key: "recorded_at",
            format: "paginationTable.datetime",
        },
        {
            name: "paginationTable.action",
            key: "action",
            align: "right",
            render: (data, url) => renderOrderAction(data, url),
        },
    ]);

    const updateDataUtil = (dataObject) => {
        const updatedRecordings = callRecords.map((el) => el.id == dataObject.id ? {...dataObject}: el);
        setCallRecords(updatedRecordings);
    }

    //call-recordings
    const fetchCallRecordings = (id) => {

        const params = {
            page: 1,
            limit: 10
        }

        const sortBase64 = window.btoa(
            unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(params))))
        );
        let dataParams = { data: sortBase64 };

        if (id) {
            setLoading(true);
            axios
                .get(`customers/${id}/recordings`, { params: dataParams })
                .then((respose: any) => {
                    setCallRecords(respose.data.data);
                    setMeta(respose.data.meta);
                })
                .catch((error) => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

    }

    const renderAgent = (data) => {
        if (data?.agent) {
            return (
                <div className="d-flex flex-column align-items-center">
                    {data?.agent?.avatar && (
                        <img
                            width="70px"
                            height="70px"
                            style={{ borderRadius: "100%" }}
                            src={data?.agent?.avatar}
                        />
                    )}
                    {data?.agent?.name}
                </div>
            );
        }
        return null;
    };

    const renderFileSize = (data) => {
        return (data.filesize / 1000000).toFixed(2) + " MB";
    };

    const renderBooleanLabel = (data) => {
        if (data.is_inbound) {
            return <span className="text-success">True</span>
        } else {
            return <span className="text-danger">False</span>
        }
    }

    const renderOrderAction = (data, url) => {


        return (
            <div className="d-flex justify-content-end align-items-center">
                <td align="left" className="user-profile">
                    <div className="d-flex">
                        <div id={data.id} className="d-none align-items-center">
                            <audio controls>
                                <source src={url[data.id]}></source>
                            </audio>
                        </div>
                        <Button
                            id={`${data.id}-play-btn`}
                            size="small"
                            className="jr-btn jr-btn-sm mr-0"
                            color="secondary"
                            onClick={() => onClickDownload(data.id)}
                        >
                            <span>{<IntlMessages id="play" />}</span>
                        </Button>
                        <Button
                            id={`${data.id}-play-btn`}
                            size="small"
                            className="jr-btn jr-btn-sm mr-0"
                            color="primary"
                            onClick={() => {
                                toggleModal();
                                setUpdateData({
                                    id: data.id,
                                    alias: data.alias,
                                    description: data.description,
                                });
                            }}
                        >
                            <span>{<IntlMessages id="employeesTable.editButton" />}</span>
                        </Button>
                    </div>
                </td>
            </div>
        );
    };


    const onClickDownload = (id) => {
        dispatch(
            downloadRecording(id, (status, res) => {
                if (status) {

                    setRecordingUrl((prevState) => ({
                        ...prevState,
                        [id]: res.url
                    }));

                    const elem = document.getElementById(id);
                    const playBtn = document.getElementById(`${id}-play-btn`);
                    if (elem && playBtn) {
                        setTimeout(() => {
                            elem.classList.remove("d-none");
                            elem.classList.add("d-flex");
                            playBtn.classList.add("d-none");
                            const audio = elem.children[0] as any;
                            audio.load();
                            audio.play().catch((error) => {
                                setAlertMsg(error);
                                setAlertVisible(true);
                            });

                        }, 1000);
                    }
                } else {
                    setAlertMsg(res);
                    setAlertVisible(true);
                }
            })
        );
    };


    useEffect(() => {
        fetchCallRecordings(props.id)
    }, [props.id]);

    const fetchData = ({ page = 0, limit = 25 }) => {


        const params = {
            page: page + 1,
            limit: limit
        }
        setApiProps({
            page: page + 1,
            limit
        });


        const sortBase64 = window.btoa(
            unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(params))))
        );
        const data = { data: sortBase64 };
        let orderId = props?.id;
        setLoading(true);
        axios
            .get(`/orders/${orderId}/recordings`, { params: data })
            .then((respose: any) => {
                setCallRecords(respose.data.data);
                setMeta(respose.data.meta);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onSave1 = () => {
        dispatch(
            updateRecording(
                updateData.id,
                { alias: updateData.alias, description: updateData.description },
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
    };

    const onSave = () => {
        let orderId = props.id;
        const payload = { alias: updateData.alias, description: updateData.description };
        axios
            .patch(`/orders/${orderId}/recordings/${updateData.id}`, payload)
            .then((res: any) => {
                console.log('res----->', res);
                //updateDataUtil(res.data.data)
                setShowModal(false);
                setSuccessPopup(true);
            })
            .catch((error) => {
                setUpdateError({ message: error.response ? error.response.data.message : "Something went wrong." });
            });
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mt-2">
                    <IntlMessages id="orderDetailViewTable.callrecordingList" />
                </h3>
            </div>
            <PaginationTable
                meta={meta}
                dataList={callRecords}
                columns={callRecordColumns}
                loading={loading}
                onChange={fetchData}
                error={error}
                recordingUrl={recordingUrl}
            />
            <AlertPopUp
                title={<IntlMessages id="sweetAlerts.downloadFail" />}
                show={alertVisible}
                message={alertMsg}
                danger
                confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
                onConfirm={() => setAlertVisible(false)}
            />
            <Modal
                isOpen={showModal}
                toggle={toggleModal}
                className="modal-align"
                keyboard={false}
                backdrop="static"
            >

                <ModalHeader toggle={toggleModal}>
                    <IntlMessages id={"callRecording.update"} />
                </ModalHeader>
                <ModalBody>
                    <div className="col-12">
                        <FormControl className="w-100 mb-2">
                            <TextField
                                // error={commentError}
                                rows="4"
                                type="input"
                                multiline={true}
                                value={updateData.alias}
                                className="w-80 mb-2 h-75 form-control"
                                label={
                                    <IntlMessages
                                        id={"employeeAccountOverview.alias"}
                                        defaultMessage={"Alias"}
                                    />
                                }
                                placeholder="Content"
                                onChange={(e) =>
                                    setUpdateData({ ...updateData, alias: e.target.value })
                                }
                            />
                        </FormControl>
                    </div>
                    <div className="col-12">
                        <FormControl className="w-100 mb-2">
                            <TextField
                                // error={commentError}
                                rows="4"
                                type="input"
                                multiline={true}
                                value={updateData.description}
                                className="w-80 mb-2 h-75 form-control"
                                label={
                                    <IntlMessages
                                        id={"entries.description"}
                                        defaultMessage="Description"
                                    />
                                }
                                placeholder="Content"
                                onChange={(e) =>
                                    setUpdateData({ ...updateData, description: e.target.value })
                                }
                            />
                        </FormControl>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="small"
                        className="MuiButtonBase-root MuiButton-root MuiButton-contained jr-btn bg-white text-black"
                        color="primary"
                        onClick={onSave}
                    >
                        <IntlMessages id={"callRecording.update"} />
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
export default CallQueueOverviewTable;
