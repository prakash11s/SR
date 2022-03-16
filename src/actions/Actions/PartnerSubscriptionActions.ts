import axios from "../../util/Api";

export const getPartnerSubscriptions = (callBack: (status, res) => void) => {
  return () => {
    axios
      .get(`/subscriptions`)
      .then((response: any) => {
        callBack(true, response.data);
      })
      .catch((error: any) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getPartnerSubscriptionDetails = (
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
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
