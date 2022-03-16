import React from 'react';
import ContactCell from "./ContactCell/index";
import { IContactListProps } from './Interface/IndexInterface';


const ContactList = ({contactList, addFavourite, onContactSelect, onSaveContact, onDeleteContact}: IContactListProps) => {
  return (
    <div className="contact-main-content">
      {contactList.map((contact, index) =>
        <ContactCell key={index} contact={contact} onDeleteContact={onDeleteContact}
                     onSaveContact={onSaveContact}
                     addFavourite={addFavourite} onContactSelect={onContactSelect}/>
      )}

    </div>
  )
};

export default ContactList;