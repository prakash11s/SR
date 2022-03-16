export interface IAddContactProps {
 onSaveContact: ({}) => void, 
 onContactClose: () => void, 
 open: boolean, 
 contact: {
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
 onDeleteContact: (data) => void;
}

export interface IAddContactState {
 id?: any,
 name?: string,
 thumb?: string,
 email?: string,
 phone?: string,
 designation?: string,
 selected?: boolean,
 starred?: boolean,
 frequently?: boolean
}