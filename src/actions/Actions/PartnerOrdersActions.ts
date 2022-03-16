import axios from "../../util/Api";

export const getPartnerAvailableOrders = (
  id: string,
  callback: (status, res) => void
) => {
  return () => {
    axios
      .get(`/orders/available-orders/${id}`)
      .then((response) => {
        callback(true, response.data.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getPartnerOrders = (
  id: string,
  callback: (status, res) => void
) => {
  return () => {
    axios
      .get(`/orders/details/${id}`)
      .then((response) => {
        callback(true, response.data.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getVehicleName = (id: string, callback: (status, res) => void) => {
  return () => {
    axios
      .get(`/services/transportation-vehicles/${id}`)
      .then((response) => {
        callback(true, response.data.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getCargoName = (id: string, callback: (status, res) => void) => {
  return () => {
    axios
      .get(`/services/cargo-types/${id}`)
      .then((response) => {
        callback(true, response.data.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const orderAction = (
  id: string,
  action: string,
  callback: (status, res) => void,
  preferred_dates?: string,
  comment?: string
) => {
  const data = { comment };
  if (action === "accept" && preferred_dates) {
    data["preferred_dates"] = [preferred_dates.toString()];
  }
  return () => {
    axios
      .put(`/orders/available-orders/${id}/${action}`, data)
      .then((response) => {
        callback(true, response.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const finishOrderAction = (
  id: string,
  callback: (status, res) => void,
  price: number
) => {
  const data = { price };

  return () => {
    axios
      .put(`/orders/${id}/complete`, data)
      .then((response) => {
        callback(true, response.data);
      })
      .catch((error) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
