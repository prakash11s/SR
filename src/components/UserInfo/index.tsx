import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { userSignOut } from 'actions/Actions/Auth';
import IntlMessages from 'util/IntlMessages';
import { IUserInfoProps, IUserInfoState, IRootUserInfoState } from './Interface/IndexInterface';

class UserInfo extends React.Component<IUserInfoProps, IUserInfoState> {
  state = {
    anchorEl: null,
    open: false,
    authUser: null
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { authUser } = this.props;    
    // default placeholder,when user did't uploaded its profile image. The thumb will be displayed
    return (
      authUser && (
        <div className='user-profile d-flex flex-row align-items-center'>
          <Avatar
            alt='user-image'
            src={authUser.avatar}
            className='user-avatar'
          >
            {authUser.first_name.charAt(0)}
          </Avatar>
          <div className='user-detail'>
            <h4 className='user-name' onClick={this.handleClick}>
              {authUser.first_name} {authUser.last_name}{' '}
              <i className='zmdi zmdi-caret-down zmdi-hc-fw align-middle' />
            </h4>
          </div>
          <Menu
            className='user-info'
            id='simple-menu'
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={this.handleRequestClose}
            PaperProps={{
              style: {
                minWidth: 120,
                paddingTop: 0,
                paddingBottom: 0
              }
            }}
          >
            <MenuItem onClick={this.handleRequestClose}>
              <i className='zmdi zmdi-account zmdi-hc-fw mr-2' />
              <IntlMessages id='popup.profile' />
            </MenuItem>
            <MenuItem onClick={this.handleRequestClose}>
              <i className='zmdi zmdi-settings zmdi-hc-fw mr-2' />
              <IntlMessages id='popup.setting' />
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleRequestClose();
                this.props.userSignOut();
              }}
            >
              <i className='zmdi zmdi-sign-in zmdi-hc-fw mr-2' />
              <IntlMessages id='popup.logout' />
            </MenuItem>
          </Menu>
        </div>
      )
    );
  }
}

const mapStateToProps = ({ settings, auth }: IRootUserInfoState) => {
  const { locale } = settings;
  const { authUser } = auth;
  return { locale, authUser };
};

export default connect(mapStateToProps, { userSignOut })(UserInfo as any);
