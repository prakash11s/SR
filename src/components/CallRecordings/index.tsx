import React, { useEffect, useState } from "react";

import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import moment from "moment";
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
import { DateRangePicker } from 'react-nice-dates'
import { sortObjectOnKeys } from 'util/helper';
import { enGB } from 'date-fns/locale'




const CallQueueOverviewTable = (props) => {

  const intl = useIntl();

  const dispatch = useDispatch();
  const [callRecords, setCallRecords] = useState([]);
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
  const [searchProps, setSearchProps] = useState<any>({})

  const [sort, setSort] = useState<any>({
    sort: {
      // alias: "asc",
      // extension_id: "asc",
      // id: "asc",
      // is_inbound: "asc",
      // phone_number: "asc",
      recorded_at: "desc",
    },
  });

  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()

  const [timer, setTimer] = useState<any>(null);

  const [callRecordColumns, setcallRecordColumns] = useState([
    {
      name: "paginationTable.id",
      key: "id",
      search: true,
      type: 'number',
      value: '',
      sort: true
    },
    {
      name: "employeeAccountOverview.alias",
      key: "alias",
      search: true,
      type: 'text',
      value: '',
      sort: true
    },
    {
      name: "callHistory.agent",
      key: "agent",
      render: (data) => renderAgent(data),
    },
    {
      name: "callHistory.phone-number",
      key: "phone_number",
      search: true,
      type: 'text',
      value: '',
      sort: true
    },
    {
      name: "extension",
      key: "extension_id",
      search: true,
      type: 'number',
      value: '',
      sort: true
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
      search: true,
      type: 'boolean',
      value: '',
      sort: true
    },
    {
      name: "paginationTable.recordedAt",
      key: "recorded_at",
      format: "paginationTable.datetime",
      search: true,
      type: 'date',
      value: '',
      sort: true
    },
    {
      name: "paginationTable.action",
      key: "action",
      align: "right",
      render: (data, url) => renderOrderAction(data, url),
    },
  ]);


  const onSortChange = (field: string) => {

    const oldSort = { ...sort };
    const newSort = { sort: {} };
    newSort.sort[field] = (oldSort.sort[field] === "asc" || oldSort.sort[field] === undefined) ? "desc" : "asc";
    setSort(newSort);
  };


  const fetchCallRecordingToSearchKeyword = (parameter) => {
    setLoading(true);

    const data = {
      ...apiProps,
      page: 1,
      sort: sort.sort,
      ...parameter
    }


    const sortBase64 = window.btoa(
      unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(data))))
    );
    const params = { data: sortBase64 };
    dispatch(
      getCallRecordings(params, (status, respose) => {

        if (status) {
          setCallRecords(respose.data);
          setMeta(respose.meta);
        } else {
          setError(respose);
        }
        setLoading(false);
      })
    );
  }

  const createSearchFieldQueryParam = () => {
    const tempObj = {};
    callRecordColumns.map(item => {
      if (item.value != '') {
        const dynamicKey = item.key == 'is_inbound' ? 'inbound' : item.key;
        tempObj[dynamicKey] = item.value
      }
    });
    return tempObj;
  }

   
  const handleKeyPressTimeOut = (tempObj) => {
    // Clears running timer and starts a new one each time the user types
    clearTimeout(timer);
    setTimer(setTimeout(() => {
      fetchCallRecordingToSearchKeyword(tempObj);
    }, 1000))
  }

  const handleSeachToggle = (key, value) => {


    const updatedList = callRecordColumns.map((obj: any) => obj.key == key ? { ...obj, value: value } : obj);
    setcallRecordColumns(updatedList);
    delete searchProps[key];
    const tempObj = { ...searchProps };
    updatedList.map(item => {
      if (item.value != '') {
        const dynamicKey = item.key;
        tempObj[dynamicKey] = item.value
      }
    })

    if (tempObj.hasOwnProperty('recorded_at') && tempObj.hasOwnProperty('recorded[from]') && tempObj.hasOwnProperty('recorded[to]')) {
      setStartDate('')
      setEndDate('');
      delete tempObj['recorded[from]']
      delete tempObj['recorded[to]']
    }
 
    setSearchProps(tempObj)
    //Debounced function 
    handleKeyPressTimeOut(tempObj);
  }

  const renderAgent = (data) => {
    if (data.agent) {
      return (
        <div className="d-flex flex-column align-items-center">
          {data.agent.avatar && (
            <img
              width="70px"
              height="70px"
              style={{ borderRadius: "100%" }}
              src={data.agent.avatar}
            />
          )}
          {data.agent.name}
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
    if (startDate && endDate) {


      const params = { ...searchProps };
      // const sortObject = [];
      //sortObject['from'] = moment(startDate).format('YYYY-MM-DD');
      //sortObject['to'] = moment(endDate).format('YYYY-MM-DD')
      params['recorded[from]'] = moment(startDate).format('YYYY-MM-DD');
      params['recorded[to]'] = moment(endDate).format('YYYY-MM-DD');
      if (params.hasOwnProperty('recorded_at')) {
        const updatedColumnsValues = callRecordColumns.map((el: any) => el.key == 'recorded_at' ? { ...el, value: '' } : el);
        setcallRecordColumns(updatedColumnsValues);
        delete params.recorded_at
      }

      fetchCallRecordingToSearchKeyword(params)
      setSearchProps(params)
    }
  }, [startDate, endDate])

  useEffect(() => {
    const params = { ...searchProps };
    params['sort'] = sort.sort;
    fetchCallRecordingToSearchKeyword(params)
  }, [sort]);

  const fetchData = ({ page = 0, limit = 25 }) => {
    /* const sortBase64 = window.btoa(
      unescape(encodeURIComponent(JSON.stringify(sort)))
    ); */
    const querySearchParams = createSearchFieldQueryParam();
    const params = {
      page: page + 1,
      limit: limit,
      sort: sort.sort,
      ...querySearchParams,
      ...searchProps,
    }
    setApiProps({
      page: page + 1,
      limit
    });


    const sortBase64 = window.btoa(
      unescape(encodeURIComponent(JSON.stringify(sortObjectOnKeys(params))))
    );
    const data = { data: sortBase64 };

    dispatch(
      getCallRecordings(data, (status, respose) => {
        setLoading(false);
        if (status) {
          setCallRecords(respose.data);
          setMeta(respose.meta);
        } else {
          setError(respose);
        }
      })
    );
  };


  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onSave = () => {
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



  return (
    <>
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="breadCrumb.call-recordings" />}
      />


      <div className="d-flex justify-content-start position-relative">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          // maximumDate={new Date()}
          minimumLength={1}
          format='dd-MM-yyyy'
          locale={enGB}
        >
          {({ startDateInputProps, endDateInputProps, focus }) => (
            <>

              <div className='date-range'>

                <input
                  className={'input start-date-range' + (focus === 'startDate' ? ' -focused' : '')}
                  {...startDateInputProps}
                  placeholder='From date'

                />

                <span className='date-range_arrow' />
                <input
                  className={'input end-date-range' + (focus === 'endDate' ? ' -focused' : '')}
                  {...endDateInputProps}
                  placeholder='To date'

                />
              </div>
            </>
          )}
        </DateRangePicker>
      </div>

      <PaginationTable
        meta={meta}
        dataList={callRecords}
        columns={callRecordColumns}
        loading={loading}
        onChange={fetchData}
        handleSeachToggle={handleSeachToggle}
        onSort={onSortChange}
        sortColumns={sort.sort}
        secondHeader={true}
        isSortable={true}
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
        {/* { isSubmitting && <Loader/> } */}
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
