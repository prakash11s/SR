import React, { useState } from "react";
import IntlMessages from "../../util/IntlMessages";
import ContainerHeader from "../ContainerHeader";
import { Card, CardBody, Spinner } from "reactstrap";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { getMaintenanceInfo } from "actions/Actions/Support";
import { useDispatch } from "react-redux";

const services = [
  { id: 1, name: "small_maintenance" },
  { id: 2, name: "large_maintenance" },
  { id: 3, name: "oil_change" },
  { id: 4, name: "battery_replacement" },
  { id: 5, name: "alternator_replacement" },
  { id: 6, name: "spark_plugs_replacement" },
  { id: 7, name: "clutch_replacement" },
  { id: 8, name: "head_gasket_replacement" },
  { id: 9, name: "timing_belt_replacement" },
  { id: 10, name: "water_pump_replacement" },
  { id: 11, name: "catalyst_replacement" },
  { id: 12, name: "brake_pads_front_replacement" },
  { id: 13, name: "brake_pads_back_replacement" },
  { id: 14, name: "front_brake_discs_replacement" },
  { id: 15, name: "front_shock_absorbers_replacement" },
  { id: 16, name: "back_shock_absorbers_replacement" },
  { id: 17, name: "exhaust_replacement" },
  { id: 18, name: "front_brake_discs_and_pads_replacement" },
  { id: 19, name: "front_wiper_replacement" },
  { id: 20, name: "back_wiper_replacement" },
];

const HaynesPage = (props) => {
  const dispatch = useDispatch();
  const [licensePlate, setLicensePlate] = useState("");
  const [service, setService] = useState<any>("");
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = () => {
    if (licensePlate && service) {
      setLoading(true);
      console.log(licensePlate, service);
      dispatch(
        getMaintenanceInfo(licensePlate, service, (status, res) => {
          if (status === "success") {
            setError(null);
            setMaintenanceData(res);
          } else {
            setError(res);
            setMaintenanceData(null);
          }
          setLoading(false);
        })
      );
    }
  };

  return (
    <div>
      <ContainerHeader
        title={<IntlMessages id="sidebar.HaynesPage" />}
        match={props.match}
      />
      <Card
        className={`shadow border-0 `}
        id="order-details-table"
        style={{ marginBottom: 50 }}
      >
        <CardBody>
          <FormControl className="w-25 mb-2 h-75">
            <TextField
              id="vehiclePlate"
              label={<IntlMessages id="vehicleStepperStep1.licensePlate" />}
              value={licensePlate}
              margin="normal"
              onChange={(event) => setLicensePlate(event.target.value)}
              fullWidth
            />
          </FormControl>
          <br />
          <FormControl className="w-25 mb-2 h-75">
            <InputLabel id="demo-simple-select-helper-label">
              Select Service
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              {services.map((data) => (
                <MenuItem value={data.id}>{data.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <Button
            onClick={getData}
            variant="contained"
            color="primary"
            className="jr-btn"
          >
            Get data
          </Button>
          <br />
          <br />
          {loading && <Spinner />}
          {!loading && maintenanceData && (
            <>
              <hr />
              <div className="d-flex">
                <div>
                  {maintenanceData.items.map((item) => (
                    <>
                      <h3>Item Data</h3>
                      <b>Description:</b> {item.description}
                      <br />
                      <b>Labour time:</b> {item.labour_time} minutes
                      <br />
                      <br />
                      {item.articles.length && <h3>Articles Data</h3>}
                      {item.articles.map((article) => (
                        <div>
                          <b>Description:</b> {article.description}
                          <br />
                          <b>Mandatory:</b>{" "}
                          {article.mandatory ? "IS REQUIRED" : "NOT REQUIRED"}
                          <br />
                          <b>Id:</b> {article.id}
                          <br />
                        </div>
                      ))}
                      <br />
                      {item.details.length && <h3>Details Data</h3>}
                      {item.details.map((detail) => (
                        <>
                          <b>Description:</b> {detail.description}
                          <br />
                          <b>Value: </b>
                          {detail.value} minutes
                          <br />
                        </>
                      ))}
                    </>
                  ))}
                  <br />
                  Total labour time: {maintenanceData.labour_time}
                  <br />
                  Total labour price: ${maintenanceData.labour_price}
                </div>
                <div className="ml-5">
                  {maintenanceData.services.map((service) => (
                    <>
                      <b>Name:</b> {service.name}
                      <br />
                      <b>Job:</b> {service.job_id}
                      <br />
                      {service.category_id ? (
                        <>
                          <b>Category:</b>
                          {service.category_id}
                          <br />
                        </>
                      ) : null}
                    </>
                  ))}
                </div>
              </div>
            </>
          )}
          {!loading && error}
        </CardBody>
      </Card>
    </div>
  );
};

export default HaynesPage;
