import axios from "../../util/Api";

export const getPartnerInvoices = (callback: (status, res) => void) => {
  return () => {
    axios
      .get(`/invoices`)
      .then((response: any) => {
        if (callback) {
          callback(true, response.data);
        }
      })
      .catch((error: any) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const getPartnerInvoiceDetail = (
  id,
  callback: (status, res) => void
) => {
  return () => {
    axios
      .get(`/invoices/${id}`)
      .then((response: any) => {
        callback(true, response.data);
      })
      .catch((error: any) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const downloadInvoice = (id, callback: (status, res) => void) => {
  return () => {
    axios
      .get(`/invoices/${id}/download`)
      .then((response: any) => {
        callback(true, response.data);
      })
      .catch((error: any) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const payInvoice = (
  id: number | string,
  data: any,
  callback: (status, res) => void
) => {
  return () => {
    const url = id === "pay-all" ? `/invoices/pay-all` : `/invoices/${id}/pay`;
    axios
      .put(url, data)
      .then((response: any) => {
        callback(true, response.data);
      })
      .catch((error: any) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};

export const payAllInvoices = (callback: (status, res) => void) => {
  return () => {
    axios
      .put(`/invoices/pay-all`)
      .then((response: any) => {
        callback(true, response.data);
      })
      .catch((error: any) => {
        callback(
          false,
          error.response ? error.response.data.message : "Something went wrong."
        );
      });
  };
};
