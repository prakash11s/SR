export interface IContactListProps {
 contactList: {
   map?: any
   id?: number,
   name?: string,
   thumb?: string,
   email?: string,
   phone?: string,
   designation?: string,
   selected?: boolean,
   starred?: boolean,
   frequently?: boolean,
   first_name?: string,
   last_name?: string,
   role?: string
 }, 
 addFavourite: ({starred, id}) => void, 
 onContactSelect: ({starred, id}) => void, 
 onSaveContact: ({id}) => void, 
 onDeleteContact: ({id}) => void
}