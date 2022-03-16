import axios from "util/Api";

export const getPartnerViewData = (callBack: (status, res) => void) => {
  return () => {
    axios
      .get("/orders/available-orders")
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getPartnerOrdersByStatus = (
  page: number,
  limit: number,
  status: string,
  callBack: (status, res) => void
) => {
  return () => {
    axios
      .get(`/orders/status/${status}?page=${page}&limit=${limit}`)
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getPartnerPayoutMethods = (callBack: (status, res) => void) => {
  return () => {
    axios
      .get("/settings/payout-methods")
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const addPartnerPayoutMethods = (
  data,
  callBack: (status, res) => void
) => {
  return () => {
    axios
      .post("/settings/payout-methods", data)
      .then((response) => {
        callBack(true, response.data);
      })
      .catch((error) => {
        callBack(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
