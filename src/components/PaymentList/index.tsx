import React from "react";
import { useIntl } from "react-intl";
import { Card, CardBody, CardText, Spinner } from "reactstrap";
import { currencyConventor, readableDateTimeLocale } from "util/helper";
import IntlMessages from "../../util/IntlMessages";

const PaymentList = ({
  paymentData,
  actionButton = null,
  isLoading = false,
  error = "",
}: {
  paymentData: any;
  actionButton?: any;
  isLoading?: boolean;
  error?: string;
}) => {
  const intl = useIntl();
  const localDateTimeFormat = intl.formatMessage({
    id: "localeDateTime",
    defaultMessage: "DD-MM-YYYY hh:mm:ss",
  });

  const totalPaymentSum = () => {
    const totalPayment = paymentData.reduce(
      (n, { status, price }) => n + (status === "paid" ? price : price * -1),
      0
    );

    return currencyConventor(
      totalPayment / 100,
      paymentData[0] && paymentData[0].currency_code_iso
    );
  };

  const badgeColor = (status: any) => {
    let classname = "warning";
    switch (status) {
      case "late":
      case "uncollectible":
      case "reminded":
        classname = "danger";
        break;
      case "paid":
        classname = "success";
        break;
      case "draft":
        classname = "primary";
        break;
    }

    return (
      <div className={`badge badge-${classname} badge-pill`}>
        <label style={{ textTransform: "capitalize" }}>{status}</label>
      </div>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between my-2 align-items-center">
        <h3 className="m-0">
          <IntlMessages id="orderDetailViewTable.paymentList" />
        </h3>
        {actionButton}
      </div>
      <Card className={`shadow border-0 `} id="order-details-table">
        <CardBody>
          <CardText>
            <div className="table-responsive-material">
              <table className="default-table table-unbordered table table-sm table-hover">
                <thead className="th-border-b">
                  <tr>
                    <th>
                      <IntlMessages id="appModule.name" />
                    </th>
                    {/* <th>
                      <IntlMessages id="orderDetailViewTable.amount" />
                    </th> */}
                    <th>
                      <IntlMessages id="orderDetailViewTable.price" />
                    </th>
                    <th>
                      <IntlMessages id="preferredDate.description" />
                    </th>
                    <th>
                      <IntlMessages id="order.status" />
                    </th>
                    <th>
                      <IntlMessages id="dateTitle" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {error && (
                    <tr>
                      <td colSpan={6} align="center">
                        {error}
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={6} align="center">
                        <Spinner color="primary" />
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                  !error &&
                  paymentData &&
                  Boolean(paymentData.length)
                    ? paymentData.map((el: any) => {
                        return (
                          <>
                            <tr tabIndex={-1} key={el.id}>
                              <td>{el.name}</td>

                              {/* <td>{el.amount}</td> */}

                              <td>
                                {currencyConventor(
                                  el.price / 100,
                                  el.currency_code_iso
                                )}
                              </td>

                              <td style={{ maxWidth: "300px" }}>
                                {el.description}
                              </td>

                              <td>{badgeColor(el.status)}</td>
                              <td>
                                {el.created_at
                                  ? readableDateTimeLocale(
                                      el.created_at,
                                      localDateTimeFormat
                                    )
                                  : "-"}
                              </td>
                            </tr>
                          </>
                        );
                      })
                    : !isLoading &&
                      !error && (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <IntlMessages id="orderDetailViewTable.paymentListNotFound" />
                          </td>
                        </tr>
                      )}
                  {!isLoading &&
                    !error &&
                    paymentData &&
                    Boolean(paymentData.length) && (
                      <tr>
                        <td></td>
                        <td>{totalPaymentSum()}</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </CardText>
        </CardBody>
      </Card>
    </>
  );
};

export default PaymentList;
