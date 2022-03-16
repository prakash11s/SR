import axios from "../../util/Api";

export const getServices = (page, limit, callBack) => {
  return () => {
    axios
      .get(`/services`)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const enableService = (data, callBack) => {
  return () => {
    axios
      .post(`/services`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const updateService = (id, data, callBack) => {
  return () => {
    axios
      .put(`/services/${id}`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data : "Something went wrong."
        );
      });
  };
};

export const updateServiceComment = (id, data, callBack) => {
  return () => {
    axios
      .put(`/services/${id}/comment`, data)
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data : "Something went wrong."
        );
      });
  };
};
