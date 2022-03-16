import axios from "../../util/Api";

export const getCallRecordings = (params, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`/system/phone-system/call-recordings`, { params : params})
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const downloadRecording = (id, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`/system/phone-system/call-recordings/${id}/download`)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const updateRecording = (id, data, callBack) => {
  return () => {
    axios
      .patch(`/system/phone-system/call-recordings/${id}`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
