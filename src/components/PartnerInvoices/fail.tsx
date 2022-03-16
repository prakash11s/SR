import React from "react";
import { Alert } from "@material-ui/lab";

export const PartnerInvoicesFail = () => {
  return (
    <div className="app-wrapper">
      <Alert color="error" variant="outlined">
        <h1>Payment failed!</h1>
        <p>Please contact your bank for assistance!</p>
      </Alert>
    </div>
  );
};

export default PartnerInvoicesFail;
