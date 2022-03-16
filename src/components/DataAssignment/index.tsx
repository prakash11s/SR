import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Fab,
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import moment from "moment";
import React, { useEffect } from "react";
import IntlMessages from "../../util/IntlMessages";
import { DatePicker } from "material-ui-pickers";
import { IDataAssignmentProps } from "./Interface/IndexInterface";
import { useIntl } from "react-intl";
import AddIcon from "@material-ui/icons/Add";
// import DateFnsUtils from "@date-io/date-fns";
 import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const DataAssignment = (props: IDataAssignmentProps) => {
  const intl = useIntl();

  const timeOptions = [
    // {
    //   id: "app.select-time",
    //   value: "",
    // },
    {
      id: "app.between8and9",
      value: "08:00",
    },
    {
      id: "app.between9and10",
      value: "09:00",
    },
    {
      id: "app.between10and11",
      value: "10:00",
    },
    {
      id: "app.between11and12",
      value: "11:00",
    },
    {
      id: "app.between12and13",
      value: "12:00",
    },
    {
      id: "app.between13and14",
      value: "13:00",
    },
  ];

  const renderOption = (
    <Select
      labelId={"dataAssignment.selectOption"}
      value={props.selectedOption}
      onChange={(event) =>
        props.onChangeSelectedOption(event.target.value as string)
      }
      input={<Input id="ageSimple2" />}
    >
      {props.optionList &&
        props.optionList.map((option: any) => {
          return <MenuItem value={option.id}>{option.name}</MenuItem>;
        })}
    </Select>
  );

  return (
    <>
      {!props.orderId && <div className="row">
        <div className="col-10">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            {props.preferredDates.map(({ date, time }, i) => (
              <div className="row align-items-end" key={i}>
                <div className="col-4">
                  <FormControl className="w-100 mb-2">
                    <DatePicker
                      fullWidth
                      required
                      minDate={new Date()}
                      format="DD/MM/yyyy"
                      disablePast={true}
                      label={<IntlMessages id={"dataAssignment.selectDate"} />}
                      value={date}
                      onChange={(date: any) =>
                        props.onChangeSelectedDate(date, i)
                      }
                      animateYearScrolling={false}
                      leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                      rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                    />
                  </FormControl>
                </div>
                <div className="col-8 d-flex align-items-end">
                  <FormControl className="w-100 mb-2">
                    <InputLabel id={"dataAssignment.selectTime"}>
                      <IntlMessages id={"dataAssignment.selectTime"} />
                    </InputLabel>
                    <Select
                      labelId={"dataAssignment.selectTime"}
                      required
                      value={time}
                      onChange={(event) =>
                        props.onChangeSelectedTime(
                          event.target.value as string,
                          i
                        )
                      }
                      input={<Input id={`dataAssignmentTime${i}`} />}
                    >
                      {timeOptions.map((time) => {
                        return (
                          <MenuItem key={time.id} value={time.value}>
                            <IntlMessages id={time.id} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {i > 0 && <DeleteIcon className="mb-2" onClick={() => props.deletePreferredDate(i)} />}
                </div>
              </div>
            ))}
          </MuiPickersUtilsProvider>
        </div>
        <div className="col-2">
          <Fab
            className={"float-right"}
            color="primary"
            aria-label="add"
            onClick={props.addDateRow}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>}

      <FormControl className="w-100 mb-2">
        <InputLabel id={"dataAssignment.selectOption"}>
          <IntlMessages id={"dataAssignment.selectOption"} />
        </InputLabel>
        {renderOption}
      </FormControl>
      {!props.orderId && <FormControl className="w-100 mb-2">
        <TextField
          type="textarea"
          label={<IntlMessages id={"dataAssignment.comments"} />}
          value={props.comments}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            props.onChangeComments(event.target.value)
          }
          placeholder={intl.formatMessage({
            id: "dataAssignment.commentsPlaceholder",
          })}
          rows="4"
          multiline={true}
        />
      </FormControl>}
    </>
  );
};

export default DataAssignment;
