import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import mails from '../data/mails';
import folders from '../data/folders';
import filters from '../data/filters';
import labels from '../data/labels';
import options from '../data/options';
import MailList from 'components/mail/MailList';

import ComposeMail from 'components/mail/Compose';
import AppModuleHeader from 'components/AppModuleHeader';
import MailDetail from 'components/mail/MailDetail';
import IntlMessages from 'util/IntlMessages';
import _ from 'lodash';
import CustomScrollbars from 'util/CustomScrollbars';

import {
  getInitValues,
  getUserAssociatedEmail,
  getUserAssociatedFolder,
  getFolderAssociatedMails
} from 'actions/Actions/Mail';

class Mail extends Component<any,any> {

  constructor(props:any) {
    super(props);
    this.state = {
      associatedEmailId: '',
      searchMail: '',
      noContentFoundMessage: 'No mail found in selected folder',
      alertMessage: '',
      showMessage: false,
      drawerState: false,
      optionName: 'None',
      anchorEl: null,
      allMail: mails,
      loader: true,
      currentMail: null,
      user: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        avatar: 'https://via.placeholder.com/150x150'
      },
      selectedMails: 0,
      selectedFolder: 0,
      composeMail: false,
      labelMenuState: false,
      folderMenuState: false,
      optionMenuState: false,
      folderMails: []
    }
  }

  componentDidMount() {
          this.props.getInitValues()
  }

  handleChange = (id:any) => {
    this.setState({ associatedEmailId: id, currentMail: null });
    this.props.getUserAssociatedFolder(id)
  };

  MailSideBar = () => {
    const { associatedEmails, commonData } = this.props
    const { associatedEmailId } = this.state
    return <div className="module-side">

      <div className="module-side-header">
        <div className="module-logo">
          <i className="zmdi zmdi-email mr-3" />
          <span><IntlMessages id="mail.mailbox" /></span>
        </div>
      </div>

      <div className="module-side-content">
        <CustomScrollbars className="module-side-scroll scrollbar"
          style={{ height: this.props.width >= 1200 ? 'calc(100vh - 200px)' : 'calc(100vh - 80px)' }}>
          {/* <div className="px-3 mt-3">
            <div className="row">
              <div className="col-12">
                <FormControl className="w-100 mb-2">
                  <InputLabel htmlFor="age-simple">Select Your Email</InputLabel>
                  <Select
                    value={!_.isEmpty(associatedEmails.associatedEmails) ? parseInt(associatedEmails.associatedEmails[0].id) : ''}
                    onChange={(event) => this.handleChange(event)}
                    displayEmpty
                    className="mt-3"
                  >
                    {associatedEmails.associatedEmails &&
                      associatedEmails.associatedEmails.map((item, index) => {
                        return (<MenuItem key={index} value={item.id}>{item.email}</MenuItem>)
                      })
                    }
                  </Select>
                </FormControl>
              </div>
            </div>
          </div> */}

          {associatedEmails.associatedEmails &&
            associatedEmails.associatedEmails.map((item:any, index:any) => {
              return (<li onClick={() => this.handleChange(item.id)} key={index} value={item.id}>
                <span className={`jr-link ${associatedEmailId === '' ?
                  index === 0 ? 'active' : '' :
                  associatedEmailId === item.id ? 'active' : ""
                  }`}>
                  {item.email}
                </span>
              </li>)
            })
          }

          <div className="module-add-task">
            <Button variant="contained" color="primary" className="btn-block"
              onClick={() => {
                this.setState({ composeMail: true })
              }}>
              <i className="zmdi zmdi-edit zmdi-hc-fw" />
              <IntlMessages id="mail.compose" /> </Button>
          </div>

          <ul className="module-nav">
            {commonData.loading &&
              <div className="loader-view"
                style={{ height: 'calc(100vh - 238px)' }}>
                <CircularProgress />
              </div>
            }
            {associatedEmails.associatedFolder && !commonData.loading &&
              this.getNavFolders()
            }
            {/* <li className="module-nav-label">
              <IntlMessages id="mail.filters" />
            </li>

            {this.getNavFilters()}

            <li className="module-nav-label">
              <IntlMessages id="mail.labels" />
            </li>

            {this.getNavLabels()} */}

          </ul>
        </CustomScrollbars>
      </div>
    </div>
  };

  onDeleteMail = () => {
    const mails = this.state.allMail.map((mail:any) =>
      mail.selected && (mail.folder === this.state.selectedFolder) ?
        { ...mail, folder: 4, selected: false, } : mail
    );
    this.setState({
      alertMessage: 'Mail Deleted Successfully',
      showMessage: true,
      selectedMails: 0,
      allMail: mails,
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
  };

  getFolderMails = (folderID:any) => {
    const { associatedEmailId } = this.state
    const { associatedEmails } = this.props
    this.setState({ selectedFolder: folderID, currentMail: null })
    if (associatedEmailId === '') {
      this.props.getFolderAssociatedMails(associatedEmails.associatedEmails[0].id, folderID)
    } else {
      this.props.getFolderAssociatedMails(associatedEmailId, folderID)
    }
    if (associatedEmails.error === 500) {
      this.setState({ noContentFoundMessage: 'Error Fetching Emails' })
    }
  }

  getNavFolders = () => {
    const { selectedFolder } = this.state
    const { associatedEmails } = this.props

    return associatedEmails.associatedFolder.map((folder:any, index:any) =>
      <li key={index} onClick={() => this.getFolderMails(folder.id)}>
        <span className={`jr-link ${selectedFolder === 0 ?
          index === 0 ? 'active' : '' :
          selectedFolder === folder.id ? 'active' : ""
          }`}>
          <i className={`zmdi zmdi-${folder.icon}`} />
          <span>{folder.id}</span>
        </span>
      </li>
    )
  };
  onFolderMenuItemSelect = (folderId:any) => {
    this.handleRequestClose();
    const mails = this.state.allMail.map((mail:any) =>
      mail.selected && (mail.folder === this.state.selectedFolder) ?
        { ...mail, folder: folderId, selected: false, } : mail
    );
    this.setState({
      selectedMails: 0,
      allMail: mails,
      noContentFoundMessage: 'No mail found in selected folder',
      alertMessage: 'Mail has been moved successfully',
      showMessage: true,
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
  };
  onLabelMenuItemSelect = (label:any) => {
    this.handleRequestClose();
    const mails = this.state.allMail.map((mail:any) => {
      if (mail.selected && (mail.folder === this.state.selectedFolder)) {
        if (mail.labels.includes(label.id)) {
          return { ...mail, labels: this.removeLabel(mail, label.id) };
        } else {
          return { ...mail, labels: this.addLabel(mail, label.id) };
        }
      } else {
        return mail;
      }
    }
    );
    this.setState({
      noContentFoundMessage: 'No mail found in selected label',
      alertMessage: 'Label Updated Successfully',
      showMessage: true,
      allMail: mails,
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
  };
  handleRequestClose = () => {
    this.setState({
      composeMail: false,
      showMessage: false,
      folderMenuState: false,
      labelMenuState: false,
      optionMenuState: false
    });
  };
  getNavFilters = () => {
    return filters.map((filter, index) =>
      <li key={index} onClick={() => {
        const filterMails = this.state.allMail.filter((mail:any) => {
          if (filter.id === 0 && mail.starred) {
            return mail
          } else if (filter.id === 1 && mail.important) {
            return mail
          }
          return null;
        });
        this.setState({
          noContentFoundMessage: 'No mail found in selected filter',
          loader: true,
          folderMails: filterMails
        });
        setTimeout(() => {
          this.setState({ loader: false });
        }, 1500);
      }
      }>
        <span className="jr-link">
          <i className={`zmdi zmdi-${filter.icon}`} />
          <span>{filter.title}</span>
        </span>
      </li>
    )
  };
  onFolderSelect = (event:any) => {
    this.setState({
      anchorEl: event.currentTarget,
      folderMenuState: !this.state.folderMenuState
    })
  };
  onLabelSelect = (event:any) => {
    this.setState({
      anchorEl: event.currentTarget,
      labelMenuState: !this.state.labelMenuState
    })
  };
  onOptionMenuSelect = (event:any) => {
    this.setState({
      anchorEl: event.currentTarget,
      optionMenuState: !this.state.optionMenuState
    })
  };
  onOptionMenuItemSelect = (option:any) => {
    switch (option.title) {
      case 'All':
        this.handleRequestClose();
        this.getAllMail();
        break;
      case 'None':
        this.handleRequestClose();
        this.getUnselectedAllMail();
        break;
      case 'Read':
        this.handleRequestClose();
        this.getReadMail();
        break;
      case 'Unread':
        this.handleRequestClose();
        this.getUnreadMail();
        break;
      case 'Starred':
        this.handleRequestClose();
        this.getStarredMail();
        break;
      case 'Unstarred':
        this.handleRequestClose();
        this.getUnStarredMail();
        break;
      case 'Important':
        this.handleRequestClose();
        this.getImportantMail();
        break;
      case 'Unimportant':
        this.handleRequestClose();
        this.getUnimportantMail();
        break;
      default:
        this.handleRequestClose();
        this.getAllMail();
    }
  };
  getAllMail = () => {
    let mails = this.state.allMail.map((mail:any) => mail.folder === this.state.selectedFolder ? {
      ...mail,
      selected: true
    } : mail);
    this.setState({
      selectedMails: mails.length,
      allMail: mails,
      optionName: 'All',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
  };
  getUnselectedAllMail = () => {
    let mails = this.state.allMail.map((mail:any) => mail.folder === this.state.selectedFolder ? {
      ...mail,
      selected: false
    } : mail);
    this.setState({
      selectedMails: 0,
      allMail: mails,
      optionName: 'None',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
  };
  getReadMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (mail.read) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      allMail: mails,
      optionName: 'Read',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getUnreadMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (!mail.read) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      allMail: mails,
      optionName: 'Unread',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getStarredMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (mail.starred) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      allMail: mails,
      optionName: 'Starred',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getUnStarredMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (!mail.starred) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      allMail: mails,
      optionName: 'UnStarred',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getImportantMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (mail.important) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      allMail: mails,
      optionName: 'Important',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getUnimportantMail = () => {
    let selectedMail = 0;
    let mails = this.state.allMail.filter((mail:any) => mail.folder === this.state.selectedFolder);
    mails = mails.map((mail:any) => {
      if (!mail.important) {
        selectedMail++;
        return { ...mail, selected: true };
      }
      return { ...mail, selected: false }
    });
    this.setState({
      selectedMails: selectedMail,
      optionName: 'Unimportant',
      allMail: mails,
      noContentFoundMessage: 'No Mail found in selected Label',
      folderMails: mails.filter((mail:any) => mail.folder === this.state.selectedFolder)
    });
    return mails;
  };
  getNavLabels = () => {
    return labels.map((label, index) =>
      <li key={index} onClick={() => {
        const filterMails = this.state.allMail.filter((mail:any) => mail.labels.includes(label.id));
        this.setState({
          loader: true,
          noContentFoundMessage: 'No mail found in selected label',
          folderMails: filterMails
        });
        setTimeout(() => {
          this.setState({ loader: false });
        }, 1500);
      }
      }>
        <span className="jr-link">
          <i className={`zmdi zmdi-circle text-${label.color}`} />
          <span>{label.title}</span>
        </span>
      </li>
    )
  };
  searchMail = (searchText:any) => {
    if (searchText === '') {
      this.setState({ folderMails: this.state.allMail.filter((mail:any) => !mail.deleted) });
    } else {
      const searchMails = this.state.allMail.filter((mail:any) =>
        !mail.deleted && mail.subject.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      this.setState({
        folderMails: searchMails
      });
    }
  };
  displayMail = (currentMail:any, noContentFoundMessage:any) => {    
    const { associatedEmails } = this.props
    return (<div className="module-box-column">
      {currentMail === null ?
        _.isEmpty(associatedEmails.associatedFolderEmails) ?
          <div className="d-flex align-items-center justify-content-center"
            style={{ height: this.props.width >= 1200 ? 'calc(100vh - 259px)' : 'calc(100vh - 238px)' }}>
            {noContentFoundMessage}
          </div>
          :
          <MailList mails={associatedEmails.associatedFolderEmails} onStartSelect={this.onStartSelect.bind(this)}
            onMailSelect={this.onMailSelect.bind(this)}
            width={this.props.width}
            onMailChecked={this.onMailChecked.bind(this)} />
        :
        <MailDetail mail={currentMail} onStartSelect={this.onStartSelect.bind(this)}
          width={this.props.width}
          onImportantSelect={this.onImportantSelect.bind(this)} />}
    </div>)
  };
  getMailActions = () => {
    return <div>
      <IconButton onClick={this.onFolderSelect.bind(this)} className="icon-btn">
        <i className="zmdi zmdi-folder" />
      </IconButton>

      <IconButton onClick={this.onDeleteMail.bind(this)} className="icon-btn">
        <i className="zmdi zmdi-delete" />
      </IconButton>

      <IconButton
        onClick={this.onLabelSelect.bind(this)} className="icon-btn">
        <i className="zmdi zmdi-label-alt" />
      </IconButton>
    </div>
  };

  onMailChecked(data:any) {
    data.selected = !data.selected;
    let selectedMail = 0;
    const mails = this.state.folderMails.map((mail:any) => {
      if (mail.selected) {
        selectedMail++;
      }
      if (mail.id === data.id) {
        if (mail.selected) {
          selectedMail++;
        }
        return data;
      } else {
        return mail;
      }
    }
    );
    this.setState({
      selectedMails: selectedMail,
      folderMails: mails
    });
  }

  onAllMailSelect() {
    const selectAll = this.state.selectedMails <= this.state.folderMails.length;
    if (selectAll) {
      this.getAllMail();
    } else {
      this.getUnselectedAllMail();
    }
  }

  removeLabel(mail:any, label:any) {
    mail.labels.splice(mail.labels.indexOf(label), 1);
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: { ...mail, labels: mail.labels }
      })
    }
    return mail.labels;
  }

  onStartSelect(data:any) {
    data.starred = !data.starred;
    this.setState({
      alertMessage: data.starred ? 'Mail Mark as Star' : 'Mail Remove as Star',
      showMessage: true,
      folderMails: this.state.folderMails.map((mail) =>
        mail.id === data.id ?
          data : mail
      )
    });
  }

  onImportantSelect(data:any) {
    data.important = !data.important;
    this.setState({
      alertMessage: data.important ? 'Mail Mark as Important' : 'Mail Remove as Important',
      showMessage: true,
      folderMails: this.state.folderMails.map((mail:any) =>
        mail.id === data.id ?
          data : mail
      )
    });
  }

  onMailSend(data:any) {
    this.setState(
      {
        alertMessage: 'Mail Sent Successfully',
        showMessage: true,
        folderMails: this.state.allMail.concat(data),
        allMail: this.state.allMail.concat(data)
      }
    );
  }

  onMailSelect(mail:any) {
    this.setState({
      currentMail: mail,
    });
  }

  addLabel(mail:any, label:any) {
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: { ...mail, labels: mail.labels.concat(label) }
      })
    }
    return mail.labels.concat(label)
  }

  updateSearch(evt:any) {
    this.setState({
      searchMail: evt.target.value,
    });
    this.searchMail(evt.target.value)
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  render() {
    const { selectedMails, currentMail, folderMails, composeMail, user, alertMessage, showMessage, noContentFoundMessage } = this.state;
    const { associatedEmails } = this.props
    return (

      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="app-module">

            <div className="d-block d-xl-none">
              <Drawer
                open={this.state.drawerState}
                onClose={this.onToggleDrawer.bind(this)}>
                {this.MailSideBar()}
              </Drawer>
            </div>
            <div className="app-module-sidenav d-none d-xl-flex">
              {this.MailSideBar()}
            </div>

            <div className="module-box">

              <div className="module-box-header">

                <IconButton className="drawer-btn d-block d-xl-none" aria-label="Menu"
                  onClick={this.onToggleDrawer.bind(this)}>
                  <i className="zmdi zmdi-menu" />
                </IconButton>
                <AppModuleHeader placeholder="Search mails" user={this.state.user}
                  onChange={this.updateSearch.bind(this)}
                  value={this.state.searchMail} />

              </div>

              <div className="module-box-content">
                <div className="module-box-topbar">
                  {this.state.currentMail === null ?
                    <div className="d-flex">
                      <Checkbox color="primary"
                        indeterminate={selectedMails > 0 && selectedMails < folderMails.length}
                        checked={selectedMails > 0}
                        onChange={this.onAllMailSelect.bind(this)}
                        value="SelectMail" />
                      <div className="d-flex align-items-center" onClick={this.onOptionMenuSelect.bind(this)}>
                        <span className="px-2"> {this.state.optionName}</span>
                        <IconButton className="icon-btn-sm">
                          <i className="zmdi zmdi-caret-down" />
                        </IconButton>
                      </div>
                    </div>
                    :
                    <IconButton className="icon-btn"
                      onClick={() => {
                        this.setState({
                          currentMail: null
                        })
                      }}>
                      <i className="zmdi zmdi-arrow-back" />
                    </IconButton>
                  }

                  {(selectedMails > 0) && this.getMailActions()}

                  <Menu id="option-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.optionMenuState}
                    onClose={this.handleRequestClose}
                    MenuListProps={{
                      style: {
                        width: 150,
                      },
                    }}>
                    {options.map(option =>
                      <MenuItem key={option.title}
                        onClick={this.onOptionMenuItemSelect.bind(this, option)}>
                        {option.title}
                      </MenuItem>,
                    )}
                  </Menu>

                  <Menu id="folder-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.folderMenuState}
                    onClose={this.handleRequestClose}
                    MenuListProps={{
                      style: {
                        width: 150,
                      },
                    }}>
                    {folders.map(folder =>
                      <MenuItem key={folder.id}
                        onClick={this.onFolderMenuItemSelect.bind(this, folder.id)}>
                        {folder.title}
                      </MenuItem>,
                    )}
                  </Menu>
                  <Menu id="label-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.labelMenuState}
                    onClose={this.handleRequestClose}
                    MenuListProps={{
                      style: {
                        width: 150,
                      },
                    }}>
                    {labels.map(label =>
                      <MenuItem key={label.id}
                        onClick={this.onLabelMenuItemSelect.bind(this, label)}>
                        {label.title}
                      </MenuItem>,
                    )}
                  </Menu>
                </div>

                {associatedEmails.loader ?
                  <div className="loader-view"
                    style={{ height: this.props.width >= 1200 ? 'calc(100vh - 259px)' : 'calc(100vh - 238px)' }}>
                    <CircularProgress />
                  </div> : this.displayMail(currentMail, noContentFoundMessage)}

                <ComposeMail open={composeMail} user={user}
                  onClose={this.handleRequestClose.bind(this)}
                  onMailSend={this.onMailSend.bind(this)} />

              </div>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={showMessage}
            autoHideDuration={3000}
            onClose={this.handleRequestClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{alertMessage}</span>}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ settings, associatedEmails, commonData }:any) => {
  const { width } = settings;
  return {
    width,
    associatedEmails,
    commonData
  }
};

const mapDispatchToProps = (dispatch:any) => {
  return {
    getInitValues: () => dispatch(getInitValues()),
    getUserAssociatedEmail: (data:any) => dispatch(getUserAssociatedEmail(data)),
    getUserAssociatedFolder: (data:any) => dispatch(getUserAssociatedFolder(data)),
    getFolderAssociatedMails: (data:any, id:any) => dispatch(getFolderAssociatedMails(data, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mail);
