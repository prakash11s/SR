import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import IntlMessages from '../../util/IntlMessages';

class SidePanel extends React.Component {

  constructor() {
    super();
    this.state = {
      drawerStatus: false,
      isDndEnabled: false,
      isStatusEnabled: false,
      isTimeTrackerEnabled: false
    }
  }
  
  toggleCustomizer = () => {
    this.setState({drawerStatus: !this.state.drawerStatus});
  };

  closeCustomizer = () => {
    this.setState({drawerStatus: false});
  };

  toggleDnd = () => {
    this.setState({isDndEnabled: !this.state.isDndEnabled});
  }

  toggleStatus = () => {
    this.setState({isStatusEnabled: !this.state.isStatusEnabled});
  }

  toggleTimeTracker = () => {
    this.setState({isTimeTrackerEnabled: !this.state.isTimeTrackerEnabled});
  }

  render() {
    
    return (
      <div className="theme-option">
        <IconButton onClick={this.toggleCustomizer.bind(this)}>
          <i className="zmdi zmdi-settings zmdi-hc-spin text-white"/>
        </IconButton>
        <Drawer className="app-sidebar-content right-sidebar"
                anchor="right"
                open={this.state.drawerStatus}
                onClose={this.closeCustomizer.bind(this)}>

          <div className="color-theme" style={{ width: '250px' }}>
            <div className="color-theme-header">
              <h3 className="color-theme-title"><IntlMessages id="sidePanel.headingSettings" /></h3>

              <IconButton className="icon-btn" onClick={this.closeCustomizer}>
                <i className="zmdi zmdi-close text-white"/>
              </IconButton>
            </div>
            <div className="mt-5 mr-5">
             
              <div >
              <div className="col-12 mb-3">
                  <h3 className="mb-1"><IntlMessages id="sidePanel.dnd" /></h3>
                  <Switch color="primary"
                          checked={this.state.isDndEnabled}
                          onChange={this.toggleDnd}
                  />
                </div>
                <div className="col-12 mb-3">
                  <h3 className="mb-1"><IntlMessages id="sidePanel.status" /></h3>
                  <Switch color="primary"
                          checked={this.state.isStatusEnabled}
                          onChange={this.toggleStatus}
                  />
                </div>
                <div className="col-12 mb-3">
                  <h3 className="mb-1"><IntlMessages id="sidePanel.timeTracker" /></h3>
                  <Switch color="primary"
                          checked={this.state.isTimeTrackerEnabled}
                          onChange={this.toggleTimeTracker}
                  />
                </div>
              </div>
            
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({}) => {  
  return {}
};

export default withRouter(connect(mapStateToProps)(SidePanel));

