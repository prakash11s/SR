import React from "react";
import { Alert } from "@material-ui/lab";

export const PartnerInvoicesSuccess = () => {
  return (
    <div className="app-wrapper">
      <Alert color="success" variant="outlined">
        <h1>Thanks for your order!</h1>
        <p>We appreciate your business!</p>
      </Alert>
    </div>
  );
};

export default PartnerInvoicesSuccess;
