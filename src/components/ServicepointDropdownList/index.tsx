import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import {
  addSelectedServicepoint,
  setServicepointStartAsync,
} from "../../actions/Actions/servicepointDropdownAction";
import {
  IServicepointDropdownListProps,
  IServicePointDetails,
  IRootServicepointDropdownListState,
} from "./Interface/IndexInterface";

class ServicepointDropdownList extends Component<
  IServicepointDropdownListProps,
  IRootServicepointDropdownListState
> {
  componentDidUpdate(prevProps) {
    if (prevProps.departmentsList !== this.props.departmentsList) {
      const { setServicepointStartAsync } = this.props;
      setServicepointStartAsync(this.props.history);
    }
  }

  handleListItemClick = (servicepoint: IServicePointDetails) => {
    if (
      !this.props.servicepoint ||
      !this.props.servicepoint.selectedServicepoint ||
      servicepoint.name !== this.props.servicepoint.selectedServicepoint.name
    ) {
      const { addSelectedServicepoint } = this.props;
      addSelectedServicepoint(servicepoint);
    }
    this.props.handleRequestClose();
  };

  render() {
    const { servicepoint } = this.props;
    return (
      <List>
        {servicepoint.servicepointsList.data &&
          servicepoint.servicepointsList.data.map((servicepoint) => (
            <ListItem
              key={servicepoint.id}
              button
              onClick={() => this.handleListItemClick(servicepoint)}
              className="department-list"
            >
              <ListItemText>{servicepoint.name}</ListItemText>
            </ListItem>
          ))}
      </List>
    );
  }
}

(ServicepointDropdownList as any).propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setServicepointStartAsync: (history: string) =>
      dispatch(setServicepointStartAsync(history)),
    addSelectedServicepoint: (servicepoint: IServicePointDetails) =>
      dispatch(addSelectedServicepoint(servicepoint)),
  };
};

const mapStateToProps = (state: IRootServicepointDropdownListState) => ({
  servicepoint: state.servicepoint,
  departmentsList: state.department.departmentsList,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicepointDropdownList);
