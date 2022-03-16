import React from "react";
import { Card, CardBody, CardText } from "reactstrap";

const CardComponent = ({ header, noPadding = false, children }) => {
  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center cardheader">
        {header}
      </div>
      <CardBody className={noPadding ? "p-0" : ""}>
        <CardText>{children}</CardText>
      </CardBody>
    </Card>
  );
};

export default CardComponent;
