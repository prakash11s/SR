import axios from "../../util/Api";

export const getSubscriptions = (params, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`/subscriptions?load=model`, { params : params})
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getSupportSubscriptionDetails = (
  id,
  callBack: (status, res) => void
) => {
  return () => {
    axios
      .get(`/subscriptions/${id}`)
      .then((response: any) => {
        callBack(true, response.data);
      })
      .catch((error: any) => {
        console.log("error",error)
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getActiveSubscriptions = (params, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`/subscriptions?load=model?only_active_subscriptions=1`, { params : params})
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getExtensionSubscriptions = (params, callBack) => {
  return (dispatch: any) => {
    axios
      .get(`subscriptions?load=model?without_extension=1`, { params : params})
      .then((response) => callBack(true, response.data))
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};