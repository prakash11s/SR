import React, { useState, useContext } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment";
import UserHasPermission from "../../util/Permission";
import IntlMessages from "util/IntlMessages";
import AlertPopUp from "../../common/AlertPopUp";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { injectIntl } from "react-intl";
import { readableDateTimeLocale } from "../../util/helper";
import { Card, CardBody, CardText } from "reactstrap";

const formFieldData = [
  {
    label: "start_date",
    type: "datetime-local",
    required: true,
    error: false,
  },
  {
    label: "end_date",
    type: "datetime-local",
    required: true,
    error: false,
  },
  {
    label: "description",
    type: "text",
    required: false,
    error: false,
  },
];

const PreferredDatesTable = (props): JSX.Element => {
  const initialFormState = {
    start_date: `${moment().format("YYYY-MM-DDTHH:mm")}`,
  };
  const {
    deleteRow,
    updatePreferredDate,
    createPreferredDate,
    dataList,
    selectedDepartment,
  } = props;
  const [formFields, setFormFields] = useState<any>(formFieldData);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, SetRowsPerPage] = useState<number>(10);
  const [preferredDateFormData, setPreferredDateFormData] = useState<any>(
    initialFormState
  );
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState<boolean>(
    false
  );
  const [actionType, setActionType] = useState<string>("");
  const [selectedID, setSelectedID] = useState<number>(0);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const handleConfirm = () => {
    setShowConfirmationPopUp(false);
    switch (actionType) {
      case "DELETE":
        deleteRow(selectedID);
        break;
      case "UPDATE":
        updatePreferredDate(selectedID, preferredDateFormData);
        break;
      case "CREATE":
        createPreferredDate(preferredDateFormData);
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferredDateFormData({
      ...preferredDateFormData,
      [name]: value,
    });
  };

  const handlePopupConfirmation = () => {
    setShowPrompt(false);
    setShowConfirmationPopUp(true);
  };
  /**
   * handle page change event
   * @param event
   * @param page
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    setPage(page);
  };

  /**
   * handle Per Page change event
   * @param event
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    SetRowsPerPage(Number(event.target.value));
  };
  const localDateTimeFormat = props.intl.formatMessage({
    id: "localeDateTime",
    defaultMessage: "YYYY-MM-DD hh:mm:ss",
  });
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3 className="mt-2">
          <IntlMessages id="orderDetailViewTable.preferredDatesList" />
        </h3>
        <UserHasPermission permission="booking-service-create-order-preferred-date">
          <Button
            onClick={(e) => {
              setFormFields(
                formFields.map((field) => {
                  field.error = false;
                  return field;
                })
              );
              setActionType("CREATE");
              setPreferredDateFormData(initialFormState);
              return setShowPrompt(true);
            }}
            variant="contained"
            className="jr-btn bg-blue-grey text-white m-1"
          >
            <IntlMessages id="preferredDate.create" />
          </Button>
        </UserHasPermission>
      </div>
      <div className="">
        {/*<CardBox styleName="col-12" cardStyle="p-0" headerOutside>*/}
        <Card className={`shadow border-0 `} id="order-details-table">
          <CardBody>
            <CardText>
              <div className="table-responsive-material">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>
                        <IntlMessages id="preferredDate.start_date" />
                      </TableCell>
                      <TableCell>
                        <IntlMessages id="preferredDate.end_date" />
                      </TableCell>
                      <TableCell>
                        <IntlMessages id="preferredDate.description" />
                      </TableCell>
                      <TableCell>
                        <IntlMessages id="preferredDate.action" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataList &&
                      dataList
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, index: number) => {
                          return (
                            <TableRow
                              key={index}
                              className={
                                data.selected == true ? "set-bg-color" : ""
                              }
                            >
                              <TableCell>{data.id}</TableCell>
                              <TableCell>
                                {data.start_date && !data.is_entire_day
                                  ? moment.utc(data.start_date).format(localDateTimeFormat) 
                                    : data.start_date && data.is_entire_day ? readableDateTimeLocale(
                                      data.start_date,
                                      "YYYY-MM-DD"
                                    ) + " (Hele dag beschikbaar)"
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {data.end_date
                                  ? readableDateTimeLocale(
                                      data.end_date,
                                      localDateTimeFormat
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell>{data.description}</TableCell>
                              <TableCell>
                                <UserHasPermission permission="booking-service-delete-order-preferred-date">
                                  <Button
                                    onClick={(e) => {
                                      setShowConfirmationPopUp(true);
                                      setActionType("DELETE");
                                      return setSelectedID(data.id);
                                    }}
                                    variant="contained"
                                    className="jr-btn bg-danger text-white m-1"
                                  >
                                    <IntlMessages id="preferredDate.delete" />
                                  </Button>
                                </UserHasPermission>
                                <UserHasPermission permission="booking-service-edit-order-preferred-date">
                                  <Button
                                    onClick={(e) => {
                                      setActionType("UPDATE");
                                      setShowPrompt(true);
                                      setPreferredDateFormData({
                                        start_date: moment(
                                          data.start_date
                                        ).format("YYYY-MM-DDTHH:mm"),
                                        end_date: moment(data.end_date).format(
                                          "YYYY-MM-DDTHH:mm"
                                        ),
                                        description: data.description,
                                      });
                                      return setSelectedID(data.id);
                                    }}
                                    variant="contained"
                                    className="jr-btn bg-blue-grey text-white m-1"
                                  >
                                    <IntlMessages id="preferredDate.update" />
                                  </Button>
                                </UserHasPermission>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={dataList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        labelRowsPerPage={<IntlMessages id="tablePaginationLabel"/>}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardText>
          </CardBody>
        </Card>
        {/*</CardBox>*/}
        <Dialog
          className="preferred-dialog"
          onClose={() => {
            return setShowPrompt(false);
          }}
          aria-labelledby="simple-dialog-title"
          open={showPrompt}
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            <IntlMessages id={`${actionType}  preferred date`} />
          </DialogTitle>
          <DialogContent>
            {formFields.map(({ label, type, required, error }, i) => (
              <TextField
                required={required}
                key={i}
                fullWidth
                multiline={label === "description" ? true : false}
                name={label}
                label={<IntlMessages id={`preferredDate.${label}`} />}
                type={type}
                className="preferred-date-input mb-4"
                error={error}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
                value={preferredDateFormData[label]}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPrompt(false)} color="primary">
              <IntlMessages id="sweetAlerts.cancelButton" />
            </Button>
            <Button
              onClick={() => {
                if (selectedDepartment === "vehicles")
                  handlePopupConfirmation();
                else {
                  let haveError = false;
                  setFormFields(
                    formFields.map((field) => {
                      if (
                        field.required &&
                        !preferredDateFormData[field.label]
                      ) {
                        haveError = true;
                        field.error = true;
                      }
                      return field;
                    })
                  );
                  if (!haveError) handlePopupConfirmation();
                }
              }}
              color="primary"
              variant="contained"
              autoFocus
            >
              <IntlMessages id="sweetAlerts.okButton" />
            </Button>
          </DialogActions>
        </Dialog>
        <AlertPopUp
          show={showConfirmationPopUp}
          title={
            <IntlMessages
              id={`sweetAlert.preferredDate.action.${actionType.toLowerCase()}`}
            />
          }
          warning={true}
          showCancel={true}
          onCancel={() => setShowConfirmationPopUp(false)}
          onConfirm={handleConfirm}
          confirmBtnText={<IntlMessages id="sweetAlerts.okButton" />}
          cancelBtnText={<IntlMessages id="sweetAlerts.cancelButton" />}
        />
      </div>
    </div>
  );
};
export default injectIntl(PreferredDatesTable);
