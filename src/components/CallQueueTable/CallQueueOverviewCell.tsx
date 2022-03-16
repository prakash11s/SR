import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardMenu from '../dashboard/Common/CardMenu/CardMenu'
import moment from 'moment';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { setCallQueueId } from '../../actions/Actions/callQueueListActions';
import { ICallQueueOverviewCellProps, ICallQueueOverviewCellState } from './Interface/CallQueueOverviewCellInterface';
import {readableDate} from "../../util/helper";

class CallQueueOverviewCell extends React.Component<ICallQueueOverviewCellProps, ICallQueueOverviewCellState> {

  constructor(props: ICallQueueOverviewCellProps) {
    super(props);
    this.state = {
      anchorEl: undefined,
      menuState: false,
      popUp: false,
			x: 0, y: 0
    }
  }

  onOptionMenuSelect = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = (event: React.MouseEvent<HTMLElement>, path: string) => {
    event.stopPropagation();
    if (path !== 'backdropClick') {
      this.props.history.push(path);
    }
    this.setState({ menuState: false });
  };

  popUpHandler = () => {
    this.setState({ popUp: true });
    this.setState({ menuState: false });
  };

  badgeColor = (status: string) => {
    let statusStyle;
    if (status.includes("awaiting_confirmation")) {
      statusStyle = "text-white bg-success";
    } else if (status.includes("on_hold")) {
      statusStyle = "bg-amber";
    } else if (status.includes("scheduled")) {
      statusStyle = "text-white bg-danger";
    } else if (status.includes("completed")) {
      statusStyle = "text-white bg-grey";
    } else if (status.includes("processing")) {
      statusStyle = "text-white bg-success";
    } else if (status.includes("cancelled")) {
      statusStyle = "text-white bg-danger";
    }
    return statusStyle;
  }

  handleClick = (id: number) => {
    this.props.setCallQueueId(id);
    this.props.history.push(`call-queues/${id}/process-queue`);
  }

  onRowClick = (event,id) => { 
		event.preventDefault();
		if(this.state.menuState) {
			this.setState({ menuState: false, x :0, y: 0, anchorEl: undefined  });
		} else {
			this.setState({ menuState: true, x :event.clientX, y: event.clientY, anchorEl: event.currentTarget  });
		}
	}

  render() {
    const { anchorEl, menuState } = this.state;
    const { id, name, image, entries_count, created_at, updated_at, description } = this.props.data;
    const limitDesctiption = (description && description.length>80) ? `${description.substr(0, 80)}...`: description;
    return (

      <tr onClick={this.handleClick.bind(this, id)}
        onContextMenu={(e) => this.onRowClick(e,id)}
        tabIndex={-1}
        key={id}
        className="mousePointer"
      >
        <td>{id}</td>
        <td>
          <div className="user-profile d-flex flex-row align-items-center">
            <Avatar
              alt={name}
              src={image}
              className="user-avatar"
            >
              {name.charAt(0)}
            </Avatar>
            <div className="user-detail">
              <h5 className="user-name">{name} </h5>
            </div>
          </div>
        </td>
        <td>{entries_count}</td>
        <td>{limitDesctiption}</td>
        <td>{updated_at ? readableDate(updated_at) : '-'}</td>
        <td>{created_at ? readableDate(created_at) : '-'}</td>
        {/* <td> */}
          {/* <IconButton onClick={this.onOptionMenuSelect.bind(this)}>
            <i className="zmdi zmdi-more-vert" /></IconButton> */}
          <CardMenu style={{x:this.state.x,y:this.state.y}} menuState={menuState} anchorEl={anchorEl} pageId={id}
            handleRequestClose={this.handleRequestClose} popUpHandler={this.popUpHandler} isQueues/>
        {/* </td> */}
      </tr>
    );
  }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setCallQueueId: (id: number) => dispatch(setCallQueueId(id)),
  }
};

export default connect(null, mapDispatchToProps)(CallQueueOverviewCell);

