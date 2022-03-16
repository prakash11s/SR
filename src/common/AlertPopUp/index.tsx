import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

import { IAlertPopUpProps } from "./Interface/IndexInterface";

const AlertPopUp = (props: IAlertPopUpProps): JSX.Element => {
  const { show, title, message, ...rest } = props;

  return (
    <SweetAlert show={show} {...rest} title={title}>
      {message}
    </SweetAlert>
  );
};

export default AlertPopUp;
