import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import { addSelectedDepartment, setDepartmentStartAsync,setPartnerDepartmentStartAsync } from 'actions/Actions/DepartmentActions';
import { getUser } from '../../actions/Actions/Auth';
import { IDepartmentDropdownListProps, IRootDepartmentDropdownListState, IDepartmentList } from './Interface/IndexInterface'

class DepartmentDropdownList extends Component<IDepartmentDropdownListProps, IRootDepartmentDropdownListState> {

  componentDidMount() {
    const { setDepartmentStartAsync,setPartnerDepartmentStartAsync } = this.props;
    if (window.location.href.indexOf("partner") > 0) {
      setPartnerDepartmentStartAsync();
    } else {
      setDepartmentStartAsync();
    }
  }

  handleListItemClick = (department: IDepartmentList) => {
    if (!this.props.department || !this.props.department.selectedDepartment || department.slug !== this.props.department.selectedDepartment.slug) {
      const { addSelectedDepartment } = this.props;
      addSelectedDepartment(department);
    }
    this.props.handleRequestClose();
  };

  render() {
    const { department } = this.props;
    return (
      <List>
        {department && department.departmentsList.map((department:any) =>
          <ListItem button onClick={() => this.handleListItemClick(department)} key={department.id} className="department-list">
            {/* <ListItemAvatar >
              <Avatar variant="square" alt={department.name} src={department.image.small} />
            </ListItemAvatar> */}
            <ListItemText>
              {department.name.replace("ServiceRight ", "")}
            </ListItemText>
          </ListItem>
        )}
      </List>
    )
  }
}

(DepartmentDropdownList  as any ).propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const mapDispatchToProps = (dispatch:any) => {
  return {
    // dispatching actions
    setDepartmentStartAsync: () => dispatch(setDepartmentStartAsync()),
    setPartnerDepartmentStartAsync: () => dispatch(setPartnerDepartmentStartAsync()),
    addSelectedDepartment: (department:object) => dispatch(addSelectedDepartment(department)),
    getUser: () => dispatch(getUser())
  }
}

const mapStateToProps = (department: IRootDepartmentDropdownListState) => ({
  department: department.department
});

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentDropdownList);
