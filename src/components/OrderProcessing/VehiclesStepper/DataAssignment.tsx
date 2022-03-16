import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Fab,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import moment from "moment";
import React, { useState } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { DatePicker } from "material-ui-pickers";
import { useIntl } from "react-intl";
import AddIcon from "@material-ui/icons/Add";
import { IDataAssignmentProps } from "components/DataAssignment/Interface/IndexInterface";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Popover, PopoverBody } from "reactstrap";

const ShowPopupIcon = ({ i }: { i: number }) => {
	const [showPopup, setShowPopup] = useState(false);
	return (
		<>
			<Popover
				placement="bottom"
				isOpen={showPopup}
				target={`preferred-date-info-${i}`}
			>
				<PopoverBody>Dit is uw gewenste datum. Het is niet definitief dat de opdracht op deze datum wordt uitgevoerd. Bij afwijkende mogelijkheden wordt er contact met u opgenomen</PopoverBody>
			</Popover>
      <IconButton id={`preferred-date-info-${i}`} onMouseEnter={() => setShowPopup(true)}
				onMouseLeave={() => {
					setShowPopup(false);
				}} className="icon-btn">
          <i className="zmdi zmdi-info" />
      </IconButton>
		</>
	);
};

const DataAssignment = (props: IDataAssignmentProps) => {
  const intl = useIntl();
  const { times, selectedDates, preferredDates, onDateClick, isLoading } = props;

  const renderOption = (
    <Select
      labelId={"dataAssignment.selectOption"}
      value={props.selectedOption}
      onChange={(event) =>
        props.onChangeSelectedOption(event.target.value as string)
      }
      input={<Input id="ageSimple2" />}
    >
      {props.optionList.map((option: any) => {
          return <MenuItem value={option.id}>{option.name}</MenuItem>;
        })}
    </Select>
  );

  const handleOpenDatePicker = (day: any, i:any) => {
    onDateClick && onDateClick(day, i);
  }
  const disableDates = (c_date: any, i: number, date: string) => {
    let day = c_date && c_date._d && moment(c_date._d).format("YYYY-MM-DD");
    let dates = selectedDates && selectedDates[i] || {};
    const foundSimilarDate = preferredDates.find(
			data => moment(data.date).format("YYYY-MM-DD") === day
		);

		let disable =
			Object.keys(dates).includes(day) &&
			(!foundSimilarDate ||
				(foundSimilarDate && foundSimilarDate.time !== "is_entire_day"));
    // let disable = Object.keys(dates).includes(day);
    return !disable
  }
 
  return (
    <>
      {!props.orderId && <div className="row">
        <div className="col-10">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            {preferredDates && preferredDates.map(({ date, time }, i) => {
              const localDate = moment(date).format("YYYY-MM-DD");
              const sameDatesData: any = [];
              let filteredTimes: any = times[i] || {};
              preferredDates.map((innerDateTime, j) => {
              const localDateTwo = moment(innerDateTime.date).format("YYYY-MM-DD");
              if (localDateTwo == localDate && i !== j) {
                  sameDatesData.push(innerDateTime.time);
                }
              });
    
              if (times[i] && sameDatesData.length) {
                filteredTimes = Object.keys(times[i])
                  .filter(key => !sameDatesData.includes(key))
                  .reduce((obj: any, key: any) => {
                    obj[key] = times[i][key];
                    return obj;
                  }, {});
              }
              return (
                <div className="row align-items-end" key={i}>
                  <div className="col-5 align-items-center d-flex">
                    <ShowPopupIcon i={i} />
                    <FormControl className="w-75 mb-2">
                      <DatePicker
                        fullWidth
                        // required
                        minDate={new Date()}
                        format="DD/MM/yyyy"
                        disablePast={true}
                        onOpen={()=>handleOpenDatePicker(moment().format('YYYY-MM-DD'), i)}
                        shouldDisableDate={(e) => {
                          if (isLoading) {
                            return true
                          }
                          return disableDates(e, i, date)
                        }}
                        label={<IntlMessages id={"dataAssignment.selectDate"} />}
                        value={date}
                        onMonthChange={(e) => handleOpenDatePicker(moment(e._d).format('YYYY-MM-DD'), i)}
                        onChange={(date: any) => {
                          props.onChangeSelectedDate(date, i)
                        }
                        }
                        animateYearScrolling={false}
                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                        rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                      />
                    </FormControl>
                  </div>
                  <div className="col-7 d-flex align-items-end">
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
                        {Object.keys(filteredTimes || {}).map((item) => {
                          return (
                            <MenuItem key={item} value={item}>
                              {times[i][`${item}`]}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    {i > 0 && <DeleteIcon className="mb-2" onClick={() => props.deletePreferredDate(i)} />}
                  </div>
                </div>
              )
            })}
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
      {props.paymentOptionList.length ? (
        <FormControl className="w-100 mb-2">
          <InputLabel id={"dataAssignment.selectPaymentType"}>
            <IntlMessages id={"dataAssignment.selectPaymentType"} />
          </InputLabel>
          <Select
            labelId={"dataAssignment.selectPaymentType"}
            required
            value={props.selectedPaymentOption as number}
            onChange={(event) =>
              props.onChangeSelectedPaymentOption(event.target.value as number)
            }
          >
            {props.paymentOptionList.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : null}
    </>
  );
};

export default DataAssignment;
