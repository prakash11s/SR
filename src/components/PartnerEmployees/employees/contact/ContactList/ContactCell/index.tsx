import React from 'react';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import AddContact from '../../AddContact/index';

export interface IContactCellProps {
  addFavourite: ({starred, id}) => void, 
  onContactSelect: ({starred, id}) => void, 
  onSaveContact: (id) => void, 
  onDeleteContact: ({id}) => void,  
  contact:  {  
    email?: string,
    phone?: string,
    designation?: string,
    selected?: boolean,
    starred: boolean,   
    first_name?: string,
    last_name?: string,
    role?: string,
    avatar?: string,
    id: any
  }
}


export interface IContactCellState {
  menuState: any, 
  anchorEl: any, 
  addContactState: any
}

class ContactCell extends React.Component<IContactCellProps, any> {

  onContactOptionSelect = event => {
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };
  handleRequestClose = () => {
    this.setState({ menuState: false });
  };
  onContactClose = () => {
    this.setState({ addContactState: false });
  };
  onDeleteContact = (contact) => {
    this.setState({ addContactState: false });
    this.props.onDeleteContact(contact);
  };
  onEditContact = () => {
    this.setState({ menuState: false, addContactState: true });
  };

  constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: undefined,
      menuState: false,
      addContactState: false,
    }
  }

  render() {
    const { contact, addFavourite, onContactSelect, onSaveContact } = this.props;
    const { menuState, anchorEl, addContactState } = this.state;
    // const {name, thumb, email, phone, designation, starred} = contact;
    const { first_name, last_name, email, phone, role, avatar, starred } = contact;

    const options = [
      'Edit',
      'Delete',
    ];
    return (

      <div className="contact-item">

        <Checkbox color="primary"
          checked={contact.selected}
          value="checkedF"
          onClick={() => {
            onContactSelect(contact)
          }}
        />
        <div className="col-auto px-1 actions d-none d-xs-flex">
          <IconButton className="icon-btn p-1" onClick={() => {
            addFavourite(contact)
          }}>
            {starred ? <i className="zmdi zmdi-star" /> : <i className="zmdi zmdi-star-outline" />}
          </IconButton>
        </div>


        <Avatar
          alt={first_name}
          src={avatar}
          className="user-avatar"
        >
          {first_name && first_name.charAt(0).toUpperCase()}
        </Avatar>

        <div className="col con-inf-mw-100">
          <p className="mb-0">
            <span className="text-truncate contact-name text-dark">
              {`${first_name} ${last_name}`}
            </span>
            <span className="d-inline-block toolbar-separator">&nbsp;</span>
            <span className="text-truncate job-title text-dark">
              {role}
            </span>
          </p>

          <div className="text-muted">
            <span className="email d-inline-block mr-2">
              {email},
                        </span>

            <span className="phone d-inline-block">
              {phone}
            </span>
          </div>
        </div>


        <div className="col-auto px-1 actions d-none d-sm-flex">
          <IconButton className="icon-btn p-2" onClick={this.onContactOptionSelect}>
            <i className="zmdi zmdi-more-vert" />
          </IconButton>

          <Menu id="long-menu"
            anchorEl={anchorEl}
            open={menuState}
            onClose={this.handleRequestClose}

            MenuListProps={{
              style: {
                width: 100,
              },
            }}>
            {options.map(option =>
              <MenuItem key={option} onClick={() => {
                if (option === 'Edit') {
                  this.onEditContact()
                } else {
                  this.handleRequestClose();
                  this.onDeleteContact(contact)
                }
              }
              }>
                {option}
              </MenuItem>,
            )}
          </Menu>
          {addContactState &&
            <AddContact open={addContactState} contact={contact} onSaveContact={onSaveContact}
              onContactClose={this.onContactClose} onDeleteContact={this.onDeleteContact} />}
        </div>
      </div>
    )
  }
}

export default ContactCell;