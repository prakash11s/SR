import React, {useState} from "react";
import {Modal, ModalHeader} from "reactstrap";
import IntlMessages from "../../util/IntlMessages";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MapWithRadius from "./MapWithRadius";
import ServicePointTable from "./servicePointTable";

const SearchServicePoint = (props:any) => {

    const [range, setRange] = useState(0)
    const data:any = [
        {
            id: 1,
            name: "Park Slope",
            latitude: "40.6710729",
            longitude: "-73.9988001"
        },
        {
            id: 2,
            name: "Bushwick",
            latitude: "40.6942861",
            longitude: "-73.9389312"
        },
        {
            id: 3,
            name: "East New York",
            latitude: "40.6577799",
            longitude: "-73.9147716"
        }
    ];

    const handleChange = (value:any) => {
            setRange(value)
    }

    data[0].circle = {
        radius: range * 1000,
        options: {
            strokeColor: "#000000",
            fillColor: "#d8514a"
        }
    };

    return (
        <React.Fragment>
            <Modal className="modal-box modal-box-mail" toggle={props.toggle}  isOpen={props.isOpen} style={{zIndex: 2600}}>
                <ModalHeader className="modal-box-header bg-primary text-white">
                    <IntlMessages id="orderOptions.search-service-point" />
                    <IconButton className="text-white">
                        <CloseIcon onClick={props.toggle}/>
                    </IconButton>
                </ModalHeader>
                <div className="modal-box-content  d-flex flex-column">
                    <ul className="contact-list list-unstyled">
                        <li className="media">
                             <span className="media-body">
                             <div className="col-sm-6 col-12">
                                  <FormControl className="w-100 mb-2">
                                    <InputLabel htmlFor="age-helper">Select Range</InputLabel>
                                    <Select
                                        value={range}
                                        onChange={ (e) => handleChange(e.target.value)}
                                        input={<Input id="age-helper"/>}>
                                      <MenuItem value={3}>3 Km</MenuItem>
                                      <MenuItem value={6}>6 Km</MenuItem>
                                      <MenuItem value={9}>9 Km</MenuItem>
                                      <MenuItem value={12}>12 Km</MenuItem>
                                    </Select>
                                    <FormHelperText>Select Range to find service points</FormHelperText>
                                  </FormControl>
                             </div>
                             </span>
                        </li>
                        <li>
                            <MapWithRadius
                                places={data}
                                containerElement={<div className="embed-responsive embed-responsive-21by9"/>}
                                mapElement={<div className="embed-responsive-item"/>}
                            />
                        </li>

                        <li>
                            <ServicePointTable places={data}/>
                        </li>
                    </ul>
                </div>
            </Modal>
        </React.Fragment>
    );
}

export default SearchServicePoint;
